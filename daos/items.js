const mongoose = require('mongoose');
const Item = require('../models/items');

module.exports = {};


module.exports.create = async (title, price, imagePath, description, story, size) => {

    let item = await Item.findOne({ title: title});

    if (item){
        return false;
    } else {

    try{
       const newItem = await Item.create({
                imagePath: imagePath,
                title: title,
                price: price,
                decription: description,
                story: story,
                size: size

            });
            return newItem; 
        }catch(error){
            throw error;
        }
    }
      
 };

 module.exports.getAll = async(itemChunks) => {
    const allItems =  Item.find(function(err, docs) {

        let chunkSize = 3;
        for(let i=0; i < docs.length; i+= chunkSize){
          itemChunks.push(docs.slice(i, i+ chunkSize));
        }

        return itemChunks;
 })
    return allItems;

        
};


// module.exports.getAllbyId = (itemId,cart) => {
//     console.log("inside item dao")
//     let item =   Item.findById(itemId);
//     console.log(item)
//     return item;
// };

module.exports.getById = async(itemId) => {
    const item = await Item.findOne({ _id : itemId });
    return item;

    }





 module.exports.updateItem = async(itemId, price, title, description, story, size, imagePath) => {
    
        try{
            const updatedItem = await Item.update({ _id: itemId }, { price: price }, 
                {title: title},{description:description},{story: story},{size: size},{imagePath: imagePath});
            return updatedItem;

        }catch(error){
            throw error;
        }
    

 };

 //// Delete
 module.exports.deleteById = async (itemId) => {
  if (!mongoose.Types.ObjectId.isValid(itemId)) {
    return false;
  }
  await Item.deleteOne({ _id: itemId });
  return true;
}

