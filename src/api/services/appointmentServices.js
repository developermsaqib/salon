const { Appointment } = require("../models");

const appointment = {
  findAll: (filter,options) => Appointment.paginate(filter,options),
  findOne: (query) => Appointment.findOne(query).populate(""),
  findById: (id) => Appointment.findById(id).populate(""),
  create: (data) => Appointment.create(data),
  update: (id, data) =>
    Appointment.findByIdAndUpdate(id, data, { new: true, runValidators: true }),
  updateOne: (query, data) =>
    Appointment.findOneAndUpdate(query, data, {
      new: true,
      runValidators: true,
    }),
  delete: (id) => Appointment.findByIdAndDelete(id),
  deleteMany: (query) => Appointment.deleteMany(query),
};

module.exports = appointment;
