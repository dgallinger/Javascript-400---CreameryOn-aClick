const mongoose = require('mongoose');


const itemSchema =  new mongoose.Schema({
    imagePath: {type: String, required: true },
    title: {type: String, required: true},
    description: {type: String, required: true},
    story:  {type: String, required: true},
    size: {type: String, required: true},
    price: {type: Number, required: true}
});

module.exports = mongoose.model('items', itemSchema);


