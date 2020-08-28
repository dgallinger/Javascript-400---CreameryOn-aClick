const mongoose = require('mongoose');


const orderSchema =  new mongoose.Schema({
    user: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    cart: {type: Object, required: true},
    status:{ type: [String], required: true }
    
});

module.exports = mongoose.model('orders', orderSchema);
