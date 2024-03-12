const { User } = require("../models");

const userServices = {
  findAll: (filter,options) => User.paginate(filter,options),
  findOne: (query) => User.findOne({query}).populate(""),
  findById: (id) => User.findById(id).populate(""),
  create: (data) => User.create(data),
  update: (id, data) =>
    User.findByIdAndUpdate(id, data, { new: true, runValidators: true }),
  delete: (id) => User.findByIdAndDelete(id),
  deleteMany: (query) => User.deleteMany(query),
  updateByEmail: (email,body)=> User.findOneAndUpdate(email,body,{new:true})
};

module.exports = userServices;
