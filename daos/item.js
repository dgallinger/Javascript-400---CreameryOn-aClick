const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const Item = require('../models/items');

module.exports = {};

module.exports.getAllItems = async () => {
    const docs = await Item.find(); 
    let itemChunks = [];
    let chunkSize = 3;
    for(let i=0; i < docs.length; i+= chunkSize) {
        itemChunks.push(docs.slice(i, i+ chunkSize)); 
    }
    return itemChunks;
}

module.exports.updateItem = async (itemId, newItem) => {
    if (!mongoose.Types.ObjectId.isValid(itemId)) {
        return false;
      }
      const success = await Item.updateOne({ _id : itemId }, newItem);
      if (success) {
          return true;
      } else {
        return false;  
      }
}

module.exports.deleteById = async (id) => {

}

module.exports.create = async () => {

}
