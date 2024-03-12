const { Staff } = require("../models");

const staffServices = {
  findAll: (filter, options) => Staff.paginate(filter, options),
  findOne: (query) => Staff.findOne(query).populate(""),
  findById: (id) => Staff.findById(id).populate(""),
  create: (data) => Staff.create(data),
  update: (id, data) =>
    Staff.findByIdAndUpdate(id, data, { new: true, runValidators: true }),
  updateOne: (query, data) =>
    Staff.findOneAndUpdate(query, data, { new: true, runValidators: true }),
  delete: (id) => Staff.findByIdAndDelete(id),
  deleteMany: (query) => Staff.deleteMany(query),
};

module.exports = staffServices;
