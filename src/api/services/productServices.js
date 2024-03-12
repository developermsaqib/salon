const { Product } = require("../models");

const productServices = {

  findAll: (filter,options) => Product.find(filter,options),
  findOne: (query) => Product.findOne(query).populate(""),
  findById: (id) => Product.findById(id).populate(""),
  create: (data) => Product.create(data),
  update: (id, data) =>
    Product.findByIdAndUpdate(id, data, { new: true, runValidators: true }),
  updateOne: (query, data) =>
    Product.findOneAndUpdate(query, data, { new: true, runValidators: true }),
  delete: (id) => Product.findByIdAndDelete(id),
  deleteMany: (query) => Product.deleteMany(query),

};

module.exports = productServices;
