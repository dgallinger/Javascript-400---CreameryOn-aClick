const mongoose = require('mongoose');


const mockSchema = new mongoose.Schema({
  name: { type: String, required: true, index: true },
  pricePerSingleScoop: { type: Number, required: true }
});


module.exports = mongoose.model("mocks", mockSchema);