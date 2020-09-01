const mongoose = require('mongoose');
const Item = require('../models/items');
const Wishlist = require('../models/wishlist');


const aggregationGetWishlist = [
    { $unwind: "$items" },
    { $lookup: {
        from: "items",
        localField: "items.itemId",
        foreignField: "_id",
        as: "it",
    }},
    { $unwind: "$it" },
    { $project: { 
      userId: 1,
      name:1,
      itemDetail: {
        _id: "$it._id",
        title: "$it.title",
        price: "$it.price", 
      }, 
    }},
    { $group: {
      _id: "$_id",
      userId: {$first: "$userId"},
      name: {$first: "$name"},
      items: { $addToSet: "$itemDetail"},
    }},
  ];


  
  
  
  module.exports.create = async(userId, itemObjs, name) => {
  
    const mappedItems = await mapReqItems(itemObjs);
    
    const newWishlist = {
      userId,
      items: mappedItems, 
      name
      
    };
    const created = await Wishlist.create(newWishlist);
    return created;
  }


  module.exports.getAllByUserId = async(userId) => {
    
    const query = [
      { $match: { userId: mongoose.Types.ObjectId(userId) } },
      ...aggregationGetWishlist,
    ];
  
    const result = (await Wishlist.aggregate(query));
    return result;
  }


  module.exports.updateWishlist = async(wishlistId, name) => {
    if (!mongoose.Types.ObjectId.isValid(wishlistId)) {
        throw new BadDataError('Not valid wishlist id');
      }else{
        try{
            const updatedItem = await Wishlist.update({ _id: wishlistId }, { name: name });
            return updatedItem;

        }catch(error){
            throw error;
        }
    }

 };
  


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


  
  
  
  
  class BadDataError extends Error {};
  module.exports.BadDataError = BadDataError;
  