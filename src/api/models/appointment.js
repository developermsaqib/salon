const mongoose = require("mongoose");
const mongoosePaginate = require('mongoose-paginate-v2');


const appointmentSchema = new mongoose.Schema({
  customer: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: [true, "Appointment must belong to a customer"],
  },
  salon: {
    type: mongoose.Schema.ObjectId,
    ref: "Salon",
    required: [true, "Appointment must belong to a salon"],
  },
  service: {
    type: mongoose.Schema.ObjectId,
    ref: "Service",
    required: [true, "Appointment must belong to a service"],
  },
  date: {
    type: Date,
    required: [true, "Appointment must have a date"],
  },
  time: {
    type: String,
    required: [true, "Appointment must have a time"],
  },
  status: {
    type: String,
    enum: ["pending", "confirmed", "cancelled"],
    default: "pending",
  },
  isDelete:{
    type:Boolean,
    default:false
  },
  
},{timestamps:true});

appointmentSchema.plugin(mongoosePaginate);

module.exports = mongoose.model("Appointment", appointmentSchema);
