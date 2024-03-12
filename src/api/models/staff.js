const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

const salonStaffSchema = new mongoose.Schema({
  profile_pic: {
    type: String,
  },
  name: {
    type: String,
    required: [true, "Please add a name"],
    trim: true,
    unique: true,
  },
  duty_hours: {
    type: Number,
  },
  designation: {
    type: String,
  },
  address: {
    type: String,
    required: [true, "Please add an address"],
    trim: true,
  },
  userId: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
  },
  status: {
    type: String,
    enum: ["active", "inactive"],
    default: "active",
  },
  isDelete: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

salonStaffSchema.plugin(mongoosePaginate);

module.exports = mongoose.model("Staff", salonStaffSchema);
