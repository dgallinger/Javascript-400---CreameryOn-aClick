const mongoose = require('mongoose');


const itemSchema =  new mongoose.Schema({
    imagePath: {type: String },
    title: {type: String},
    description: {type: String},
    story:  {type: String},
    size: {type: String},
    price: {type: String, required: true}
});

module.exports = mongoose.model('items', itemSchema);


