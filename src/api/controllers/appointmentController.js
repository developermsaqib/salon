const { appointmentServices } = require("../services");

const ErrorResponse = require("../../utils/errorResponse");
const _ = require("lodash");
const axios = require("axios");
const { Salon, User } = require("../models");
const { io, getReceiverSocketId } = require("../socket/socket");
const Notification = require("../models/notification");

// @desc      Get all appointments
// @route     GET /api/v1/appointment/findAll
// @access    Private/Admin

exports.getAppointments = async (req, res, next) => {
  const filter = _.pick(req.query, ["", ""]);
  const options = _.pick(req.query, ["limit", "page", "perPage", "populate"]);

  const appointments = await appointmentServices.findAll(filter, options);
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
  // req.body.customer = req.user.id;
  req.body.customer = "65d6ea6c2cab0eaa1203b50e";
  //   check the booking date is not in the past
  //Generating Event ID fn
  function generateEventID() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    const seconds = String(now.getSeconds()).padStart(2, "0");
    const milliseconds = String(now.getMilliseconds()).padStart(3, "0");

    const eventID = `E${year}${month}${day}${hours}${minutes}${seconds}${milliseconds}`;

    return eventID;
  }

  if (req.body.date < Date.now()) {
    return next(
      new ErrorResponse("Booking date cannot available in the past", 400)
    );
  }
  const { date, summary, description, startDate, endDate, tzid, location } =
    req.body;
  const dateObject = new Date(date);
  const hours = dateObject.getUTCHours();
  const minutes = dateObject.getUTCMinutes();
  const formattedTime = `${hours.toString().padStart(2, "0")}:${minutes
    .toString()
    .padStart(2, "0")}`;
  req.body.time = formattedTime;
  {
    try {
      const eventData = {
        event_id: generateEventID(),
        summary: summary,
        description: description,
        start: startDate,
        end: endDate,
        tzid: tzid,
        location: {
          description: location,
        },
      };
      const response = await axios.post(
        `https://api.cronofy.com/v1/calendars/${req.cronofyGoogleCalendarId}/events`,
        eventData,
        {
          headers: {
            Authorization: `Bearer ${req.cronofyAccessToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      // console.log(response.status);
    } catch (error) {
      res
        .status(500)
        .json({ error: "Failed to create event", message: error.message });
    }
  }
  const appointment = await appointmentServices.create(req.body);
  const salonId = appointment.salon;
  console.log(salonId);
  const salon = await Salon.findById(salonId).populate("userId", "userId");
  // const salonOwnerId = salon.userId;
  // console.log("Salon Id:", salonId, "Salon Owner ID:", salonOwnerId);
  console.log(salon);
  const user = await User.findOne({ salonId: salon._id });
  console.log(user);
  const salonOwnerId = user._id;
  const notification = await Notification.create({
    recipient_id: salonOwnerId,
    // sender_id: req.user.id,
    sender_id: "65d6ea6c2cab0eaa1203b50e",
    content: "The New Appointment has been booked",
    type: "appointment",
  });
  console.log(notification);
  const adminNamespace = io.of("/admin");
  const receiverSocketId = getReceiverSocketId(salonOwnerId);
  if (notification) {
    adminNamespace.to(receiverSocketId).emit("newAppointment", notification);
    console.log("Notification Sended");
  }
  console.log(appointment);
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

// Controller function to get appointments by status
exports.getAppointmentsByStatus = async (req, res) => {
  try {
    const { status } = req.params; // Assuming status is passed as a route parameter

    // Query appointments with the specified status
    const appointments = await appointmentServices.findAll({ status });

    // Check if appointments were found
    if (appointments.docs.length === 0) {
      return res.status(404).json({
        status: false,
        message: "No appointments found with the specified status.",
      });
    }

    // Return the found appointments
    res.status(200).json({ appointments });
  } catch (error) {
    res.status(500).json({ status: false, message: "Internal server error" });
  }
};
