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
    Item.find(function(err, docs) {
        
        let chunkSize = 3;
        for(let i=0; i < docs.length; i+= chunkSize){
          itemChunks.push(docs.slice(i, i+ chunkSize));
        }
        return itemChunks
 })
};



 module.exports.updateItem = async(itemId, price, title, description, story, size, imagePath) => {
    if (!mongoose.Types.ObjectId.isValid(itemId)) {
        throw new BadDataError('Not valid item id');
      }else{
        try{
            const updatedItem = await Item.update({ _id: itemId }, { price: price }, 
                {title: title},{description:description},{story: story},{size: size},{imagePath: imagePath});
            return updatedItem;

        }catch(error){
            throw error;
        }
    }

 };

 //// Delete
 module.exports.deleteById = async (itemId) => {
  if (!mongoose.Types.ObjectId.isValid(itemId)) {
    return false;
  }
  await Book.deleteOne({ _id: itemId });
  return true;
}








class BadDataError extends Error {};
module.exports.BadDataError = BadDataError;