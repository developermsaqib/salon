const { Services } = require("../models");

const services = {
  findAll: (filter,options) => Services.paginate(filter,options),
  findMany: (filter) => Services.find(filter),
  findOne: (query) => Services.findOne(query).populate(""),
  findById: (id) => Services.findById(id).populate(""),
  create: (data) => Services.create(data),
  update: (id, data) =>
    Services.findByIdAndUpdate(id, data, { new: true, runValidators: true }),
  updateOne: (query, data) =>
    Services.findOneAndUpdate(query, data, { new: true, runValidators: true }),
  delete: (id) => Services.findByIdAndDelete(id),
  deleteMany: (query) => Services.deleteMany(query),
};

module.exports = services;
