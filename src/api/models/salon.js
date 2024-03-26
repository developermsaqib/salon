const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

const salonSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please add a name"],
    trim: true,
    unique: true,
  },
  business_hours: {
    type: mongoose.SchemaTypes.Mixed,
    required: true,
  },
  aboutUs: {
    type: String,
    trim: true,
  },
  address: {
    type: String,
    required: [true, "Please add an address"],
    trim: true,
  },
  city: {
    type: String,
    required: true,
  },
  rating: {
    type: Number
  },
  pictures: [
      {type: String}
  ],
  location: {
    type: {
      type: String,
      enum: ["Point"],
      required: false,
    },
    coordinates: {
      type: String,
      required: false,
    },
  },
  service: [
    {
      type: mongoose.Schema.ObjectId,
      ref: "Service",
      onDelete: "cascade",
      cascade: true,
    },
  ],
  userId: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
  },
  websiteURL: {
    type: String,
  },
  views:[
    {
      userId:{
        type: mongoose.Schema.ObjectId,
        ref:"User"
      },
      timestamp:{
        type: Date,
        default: Date.now
      }
    }
  ],
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

salonSchema.plugin(mongoosePaginate);

module.exports = mongoose.model("Salon", salonSchema);
