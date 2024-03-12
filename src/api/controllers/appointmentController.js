const { appointmentServices } = require("../services");
const ErrorResponse = require("../../utils/errorResponse");
const _ = require('lodash');

// @desc      Get all appointments
// @route     GET /api/v1/appointment/findAll
// @access    Private/Admin

exports.getAppointments = async (req, res, next) => {
  const filter = _.pick(req.query,['','']);
  const options = _.pick(req.query,['limit','page','perPage','populate']);
  
  const appointments = await appointmentServices.findAll(filter,options);
  res.status(200).json({
    success: true,
    count: appointments.length,
    data: appointments,
  });
};

// @desc      Get single appointment
// @route     GET /api/v1/appointment/findOne/:id
// @access    Private/Admin,Customer

exports.getAppointment = async (req, res, next) => {
  const appointment = await appointmentServices.findById(req.params.id);

  if (!appointment) {
    return next(
      new ErrorResponse(
        `Appointment not found with id of ${req.params.id}`,
        404
      )
    );
  }

  res.status(200).json({ success: true, data: appointment });
};

// @desc      Create new appointment
// @route     POST /api/v1/appointment/create
// @access    Private/Customer,Admin

exports.createAppointment = async (req, res, next) => {
  // get the user id from the token and put into req.body
  req.body.customer = req.user.id;

  //   check the booking date is not in the past
  if (req.body.date < Date.now()) {
    return next(
      new ErrorResponse("Booking date cannot available in the past", 400)
    );
  }
  const appointment = await appointmentServices.create(req.body);

  res.status(201).json({
    success: true,
    data: appointment,
  });
};

// @desc      Update appointment
// @route     PUT /api/v1/appointment/update/:id
// @access    Private/Admin,Customer

exports.updateAppointment = async (req, res, next) => {
  const appointment = await appointmentServices.update(req.params.id, req.body);
  if (!appointment) {
    return next(
      new ErrorResponse(
        `Appointment not found with id of ${req.params.id}`,
        404
      )
    );
  }

  res
    .status(200)
    .json({ success: true, msg: "updated successfully", data: appointment });
};

// @desc      Delete appointment
// @route     DELETE /api/v1/appointment/delete/:id
// @access    Private/Admin,Customer

exports.deleteAppointment = async (req, res, next) => {
  const appointment = await appointmentServices.delete(req.params.id);
  if (!appointment) {
    return next(
      new ErrorResponse(
        `Appointment not found with id of ${req.params.id}`,
        404
      )
    );
  }

  res
    .status(200)
    .json({ success: true, msg: "deleted successfully", data: appointment });
};
