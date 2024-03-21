const  Rating  = require("../models/rating"); 

const RatingServices = {

  findAll: (filter,options) => Rating.paginate(filter,options),
  findOne: (query) => Rating.findOne(query).populate(""),
  findById: (id) => Rating.findById(id).populate(""),
  create: (data) => Rating.create(data),
  update: (id, data) =>
    Rating.findByIdAndUpdate(id, data, { new: true, runValidators: true }),
  updateOne: (query, data) =>
    Rating.findOneAndUpdate(query, data, { new: true, runValidators: true }),
  delete: (id) => Rating.findByIdAndDelete(id),
  deleteMany: (query) => Rating.deleteMany(query),
};

module.exports = RatingServices;
