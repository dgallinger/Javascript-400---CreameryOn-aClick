

const mongoose = require('mongoose');


const wishlistSchema =  new mongoose.Schema({
    userId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'users', 
        required: true 
      },
    // Array of Item Detail
        // Array of Item Detail
    items: [{
      itemId: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'items',
        required: true,
      } }],

    created: {
        type: Date,
        default: Date.now,
      },
    name: {type: String, required: true},
    
 });


module.exports = mongoose.model('wishlist', wishlistSchema);

