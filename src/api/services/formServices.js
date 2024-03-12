const { User: Form } = require("../models");

const formServices = {
  findAll: (filter,options) => Form.paginate(filter,options),
  findOne: (query) => Form.findOne(query).populate(""),
  findById: (id) => Form.findById(id).populate(""),
  create: (data) => Form.create(data),
  update: (id, data) =>
    Form.findByIdAndUpdate(id, data, { new: true, runValidators: true }),
  delete: (id) => Form.findByIdAndDelete(id),
  deleteMany: (query) => Form.deleteMany(query),
  updateByEmail: (email,body)=> Form.findOneAndUpdate(email,body,{new:true})
};

module.exports = formServices;
