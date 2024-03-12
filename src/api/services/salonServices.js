const { Salon } = require("../models");

const salonServices = {

  findAll: (filter,options) => Salon.paginate(filter,options),
  findOne: (query) => Salon.findOne(query).populate(""),
  findById: (id) => Salon.findById(id).populate(""),
  create: (data) => Salon.create(data),
  update: (id, data) =>
    Salon.findByIdAndUpdate(id, data, { new: true, runValidators: true }),
  updateOne: (query, data) =>
    Salon.findOneAndUpdate(query, data, { new: true, runValidators: true }),
  delete: (id) => Salon.findByIdAndDelete(id),
  deleteMany: (query) => Salon.deleteMany(query),
};

module.exports = salonServices;
