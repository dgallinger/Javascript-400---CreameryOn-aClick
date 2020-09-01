const mongoose = require('mongoose');
const Order = require('../models/order');
const Item = require('../models/items');


const aggregationGetOrder = [
  { $unwind: "$items" },
  { $lookup: {
      from: "items",
      localField: "items.itemId",
      foreignField: "_id",
      as: "it",
  }},
  { $unwind: "$it" },
  { $project: { 
    total: 1, 
    userId: 1,
    status: 1,
    address: 1,
    recipient: 1,
    created: 1,
    itemDetail: {
      _id: "$it._id",
      title: "$it.title",
      size: "$it.size",
      price: "$it.price", 
      quantity: "$items.quantity"
    }, 
  }},
  { $group: {
    _id: "$_id",
    userId: {$first: "$userId"},
    status: {$first: "$status"},
    total: {$first: "$total"},
    address: {$first: "$address"},
    recipient: {$first: "$recipient"},
    created: {$first: "$created"},
    items: { $addToSet: "$itemDetail"},
  }},
];


module.exports.create = async(userId, itemObjs, address, recipient) => {

  const mappedItems = await mapReqItems(itemObjs);
  const itemsResultSet = await getDBItems(mappedItems);
  const areItemsValid = await areValid(itemObjs, itemsResultSet);

  if (!areItemsValid) {
    throw new BadDataError('invalid order item');
  }

  const total = await computeTotal(itemObjs, itemsResultSet);

  const newOrder = {
    userId,
    items: mappedItems, 
    total,
    status: 'New',
    address,
    recipient
    
  };
  const created = await Order.create(newOrder);
  return created;
}


module.exports.getAll = async() => {
  //return Order.find().lean();
  const query = [
    { $match: { } },
    ...aggregationGetOrder,
  ];

  const result = (await Order.aggregate(query));
  return result;
}


module.exports.getAllByUserId = async(userId) => {
  //return Order.find( { userId } ).lean();
  const query = [
    { $match: { userId: mongoose.Types.ObjectId(userId) } },
    ...aggregationGetOrder,
  ];

  const result = (await Order.aggregate(query));
  return result;
}


module.exports.getById = async(orderId) => {
  const query = [
    { $match: { _id: mongoose.Types.ObjectId(orderId) } },
    ...aggregationGetOrder,
  ];

  const result = (await Order.aggregate(query))[0];
  return result;
}


module.exports.updateById = async (orderId, itemObjs) => {
  const mappedItems = await mapReqItems(itemObjs);
  const itemsResultSet = await getDBItems(mappedItems);
  const areItemsValid = await areValid(itemObjs, itemsResultSet);
  
  if (!areItemsValid) {
    throw new BadDataError('invalid order item');
  }

  const total = await computeTotal(itemObjs, itemsResultSet);


  await Order.updateOne({ _id: orderId }, { $set: { items: mappedItems, total, updated: new Date() } });
  return true;
}


module.exports.cancelById = async (orderId) => {
  await Order.updateOne({ _id: orderId }, { $set: { status: 'Cancelled' } });
  return true;
}

/*
 * Validate order items.
 */
const areValid = async(itemObjs, itemsResultSet, address) => {
  let isValid = true;

  // if order item is not found within the Items result set, itemObjs is invalid
  for(let i = 0; i < itemObjs.length; i++) {
    const foundItem = itemsResultSet.find(doc => doc.id === itemObjs[i].itemId);

    if (foundItem === undefined) {
      isValid = false;
      break;
    } 
  }

  return isValid;
}

/*
 * Compute order total.
 */
const computeTotal = async(itemObjs, itemsResultSet) => {
  // iterate the order items and compute total
  let total = 0;
  for(let i = 0; i < itemObjs.length; i++) {
    const foundItem = itemsResultSet.find(doc => doc.id === itemObjs[i].itemId);
    total += foundItem.price * itemObjs[i].quantity;
  }
  return total; 
}

/*
 * Map order items array so itemId is of type ObjectId
 */
const mapReqItems = async (reqItems) => {
  let items = reqItems.map(function(orderItem) {
    return { 
      itemId: mongoose.Types.ObjectId(orderItem.itemId), 
      quantity: orderItem.quantity
    }
  });
  return items;
}

/*
 * Filter Items result set by the item ids contained in the order
 */
const getDBItems = async (items) => {
    const result = (await Item.find( { _id: { $in: items.map(it => it.itemId) } 
  })) .map(function(doc) { return { id: doc._id.toString(), price: doc.price }; 
  });
    return result;
}


class BadDataError extends Error {};
module.exports.BadDataError = BadDataError;