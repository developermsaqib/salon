const { Stock } = require("../models");

const stockServices = {
  findAll: (filter,options) => Stock.paginate(filter,options),
  findOne: (query) => Stock.findOne(query).populate(""),
  findById: (id) => Stock.findById(id).populate(""),
  create: (data) => Stock.create(data),
  update: (id, data) =>
    Stock.findByIdAndUpdate(id, data, { new: true, runValidators: true }),
  updateOne: (query, data) =>
    Stock.findOneAndUpdate(query, data, { new: true, runValidators: true }),
  delete: (id) => Stock.findByIdAndDelete(id),
  deleteMany: (query) => Stock.deleteMany(query),
};

module.exports = stockServices;
