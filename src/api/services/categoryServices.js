const { Category } = require("../models");

const categoryServices = {

  findAll: () => Category.find().lean(),
  findOne: (query) => Category.findOne(query).populate(""),
  findById: (id) => Category.findById(id).populate(""),
  create: (data) => Category.create(data),
  update: (id, data) =>
    Category.findByIdAndUpdate(id, data, { new: true, runValidators: true }),
  updateOne: (query, data) =>
    Category.findOneAndUpdate(query, data, { new: true, runValidators: true }),
  delete: (id) => Category.findByIdAndDelete(id),
  deleteMany: (query) => Category.deleteMany(query),

};

module.exports = categoryServices;
