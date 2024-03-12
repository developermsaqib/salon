const { services, salonServices } = require("../services");
const ErrorResponse = require("../../utils/errorResponse");
const _ = require('lodash');
const EVENT = require('../../triggers/triggerEvents')

//@desc      GetAll Services
// @route     Get api/v1/services/findAll
// @access    Private/Admin,salonOwner

exports.findAll = async (req, res, next) => {
  const filter = _.pick(req.query,['','']);
  const options = _.pick(req.query,['limit','page','perPage','populate']);

  const servicesData = await services.findAll(filter,options);
  if (!servicesData) {
    return next(new ErrorResponse(`services not found`, 400));
  }
  res
    .status(200)
    .json({ success: true, count: servicesData.length, data: servicesData });
};

//@desc      Get Single Services
// @route     Get api/v1/services/findOne/:id
// @access    Private/Admin,salonOwner

exports.findOne = async (req, res, next) => {
  const servicesData = await services.findOne({ _id: req.params.id });
  if (!servicesData) {
    return next(new ErrorResponse(`No services found`, 400));
  }
  res.status(200).json({ success: true, data: servicesData });
};

// @desc      Add services
// @route     Post api/v1/services/addServices
// @access    Private/Admin

exports.addServices = async (req, res, next) => {
  const servicesData = await services.create(req.body);

  if (!servicesData) {
    return next(new ErrorResponse(`services not created`, 400));
  }
  res.status(200).json({ success: true, data: servicesData });
};

// @desc      Update services
// @route     Put api/v1/services/update/:id
// @access    Private/Admin

exports.update = async (req, res, next) => {
  const servicesData = await services.update(req.params.id, req.body);
  if (!servicesData) {
    return next(new ErrorResponse(`services not updated`, 400));
  }
  res.status(200).json({ success: true, data: servicesData });
};

// @desc      Delete services
// @route     Delete api/v1/services/delete/:id
// @access    Private/Admin

exports.deleteServices = async (req, res, next) => {
  const userId = req.user.id;
  console.log(userId);
  // when services is deleted, remove servicesId from salon document in servicesId array
  const servicesSalon = await salonServices.updateOne(userId, {
    $pull: { serviceId: req.params.id },
  });
  console.log("service deleted", servicesSalon);
  if (servicesSalon) {
    const servicesData = await services.delete(req.params.id);
    res.status(200).json({ success: true, data: servicesData });
  } else {
    return next(new ErrorResponse(`service not deleted`, 400));
  }
};
