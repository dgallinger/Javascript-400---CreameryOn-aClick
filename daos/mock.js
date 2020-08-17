const mongoose = require('mongoose');
const Mock = require('../models/mock');


module.exports = {};

module.exports.create = async(mockItem) => {
  const created = await Mock.create(mockItem);
  return created;
}

module.exports.getAll = async() => {
  return Mock.find().lean();
}