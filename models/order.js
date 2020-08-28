const mongoose = require('mongoose');


// const orderSchema =  new mongoose.Schema({
//     user: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
//     cart: {type: Object, required: true},
//     status:{ type: [String], required: true }
    
// });

const orderSchema = new mongoose.Schema({
  // PK: _id

  // FK to User
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'users', 
    required: true 
  },

  // Array of Item Detail
  items: [{
    // PK: _id

    // FK to Item
    itemId: {
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'items',
      required: true,
    },

    // Item quantity
    quantity: {
      type: Number, 
      required: true,
    } 
  }],

  // Order total amount
  total: { 
    type: Number, 
    required: true 
  },

  // Order status
  status: {
    type: String,
    enum: ['New', 'Packed', 'Shipped', 'Delivered', 'Cancelled'],
    required: true,
  }, 

  // Order create date
  created: {
    type: Date,
    default: Date.now,
  },

  // Order update date
  updated: {
    type: Date,
    default: null,
  }
});


module.exports = mongoose.model('orders', orderSchema);
