const { salonServices, userServices } = require("../services");
const ErrorResponse = require("../../utils/errorResponse");
const { User } = require("../models/user");

const _ = require('lodash');
//@desc      GetAll Salon
// @route     Get api/v1/salon/findAll
// @access    Private/Admin

exports.findAll = async (req, res, next) => {
  const filter = _.pick(req.query,['','']);
  const options = _.pick(req.query,['limit','page','perPage','populate']);
  
  const salon = await salonServices.findAll(filter,options);
  if (!salon) {
    return next(new ErrorResponse(`salon not found`, 400));
  }
  res.status(200).json({ success: true, count: salon.length, data: salon });
};

//@desc      Get Single Salon
// @route     Get api/v1/salon/findOne/:id
// @access    Private/Admin

exports.findOne = async (req, res, next) => {
  const salon = await salonServices.findOne({ _id: req.params.id });
  if (!salon) {
    return next(new ErrorResponse(`No salon found`, 400));
  }
  res.status(200).json({ success: true, data: salon });
};

// @desc      Add salon
// @route     Post api/v1/salon/create
// @access    Private/User

exports.addSalon = async (req, res, next) => {
  const { id } = req.body;
  // put user id in req.body
  req.body.userId = id;
  const salon = await salonServices.create(req.body);
  if (!salon) {
    return next(new ErrorResponse(`salon not created`, 400));
  }
  // add salonId to user document in salonId array
  await userServices.update(id, {
    $push: { salonId: salon._id },
  });
  
  res.status(200).json({ success: true, data: salon });
};

// @desc      Delete salon
// @route     Delete api/v1/salon/delete/:id
// @access    Private/User

exports.deleteSalon = async (req, res, next) => {
  const salon = await salonServices.delete(req.params.id);
  if (!salon) {
    return next(new ErrorResponse(`salon not deleted`, 400));
  }
  // remove salonId from user document in salonId array
  await userServices.update(req.user.id, {
    $pull: { salonId: req.params.id },
  });
  res.status(200).json({ success: true, data: salon });
};

// @desc  update salon
// @route PATCH api/v1/salon/update/:id
// @access Private/salonOwner

exports.updateSalon = async (req, res, next) => {
  // check if user is salon owner
  // const auth = await userServices.findOne({
  //   _id: req.user.id,
  //   salonId: req.params.id,
  // });
  
  const condition = {_id:req.user.id, salonId:req.params.id};
  const auth = await userServices.findOne(condition); 

  if (!auth) {
    return next(new ErrorResponse(`Not authorized to update salon`, 401));
  }
  const salon = await salonServices.update(req.params.id, req.body);
  if (!salon) {
    return next(new ErrorResponse(`salon not updated`, 400));
  }
  res.status(200).json({ success: true, data: salon });
};

// @desc  update servicesId in salon document
// @route PATCH api/v1/salon/updateServices/:id
// @access Private/salonOwner

exports.updateServices = async (req, res, next) => {
  // check if user is salon owner
  const auth = await userServices.findOne({
    userId: req.user.id,
    salonId: req.params.id,
  });
  if (!auth) {
    return next(new ErrorResponse(`Not authorized to update salon`, 401));
  }
  //find serviceId and compare req,body.serviceId and remove duplicate serviceId from req.body
  const service = await salonServices.findOne({ _id: req.params.id });
  if (!service) {
    return next(new ErrorResponse(`No service found`, 400));
  }
  const serviceId = service.serviceId;
  const newServiceId = req.body.serviceId.filter(
    (item) => !serviceId.includes(item)
  );
  // update salon document
  const salon = await salonServices.update(req.params.id, {
    $push: { serviceId: newServiceId },
  });
  if (!salon) {
    return next(new ErrorResponse(`salon not updated`, 400));
  }
  res.status(200).json({ success: true, data: salon });
};

// @desc  delete servicesId in salon document
// @route PATCH api/v1/salon/deleteServices/:id
// @access Private/salonOwner

exports.deleteServices = async (req, res, next) => {
  // check if user is salon owner
  const auth = await userServices.findOne({
    userId: req.user.id,
    salonId: req.params.id,
  });
  if (!auth) {
    return next(new ErrorResponse(`Not authorized to update salon`, 401));
  }
  //find serviceId and compare req,body.serviceId and remove duplicate serviceId from req.body
  const service = await salonServices.findOne({ _id: req.params.id });
  if (!service) {
    return next(new ErrorResponse(`No service found`, 400));
  }
  // remove multiple serviceId from salon document
  const salon = await salonServices.update(req.params.id, {
    $pull: { serviceId: { $in: req.body.serviceId } },
  });
  if (!salon) {
    return next(new ErrorResponse(`salon not updated`, 400));
  }
  res.status(200).json({ success: true, data: salon });
};