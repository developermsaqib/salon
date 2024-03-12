const mongoose = require("mongoose");
const mongoosePaginate = require('mongoose-paginate-v2');

const formSchema = new mongoose.Schema({
  firstName: {
    type: String,
    lowercase: true,
    trim: true,
    default: "",
  },
  lastName: {
    type: String,
    lowercase: true,
    trim: true,
    default: "",
  },
  name:String,
  email: {
    type: String,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      "Please add a valid email",
    ],
    required: [true, "E-mail is Required"],
    unique: [true, "E-mail Already Exist"],
    lowercase: true,
    default: function() {
      this.google.email ? this.email = this.google.email : null
    }
  },
  password: {
    type: String,
    // required: [true, "Please Add Password"],
    minlength: 6,
    select: false,
  },
  role: {
    type: String,
    enum: ["customer", "admin", "salonOwner"],
    default: "customer",
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  status: {
    type: String,
    enum: ["active", "inactive"],
    default: "active",
  },
  gender: {
    type: String,
    enum: ["male", "female", "other"],
    default: "male",
  },
  address: {
    type: String,
    trim: true,
    default: "",
  },
  phoneNumber: {
    type: String,
    trim: true,
    default: "",
  },
  dateOfBirth: {
    type: Date,
    default: "",
  },
  code:{
    type:String
  },
  salonId: [
    {
      type: mongoose.Schema.ObjectId,
      ref: "Salon",
    },
  ],
  method:String,
  google: {
    id: {
     type: String,
    },
    name: {
     type: String,
    },
    email: {
     type: String,
    },
     },
  isEmailVerified:{
    type:Boolean,
    default:false
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

formSchema.plugin(mongoosePaginate);



module.exports = mongoose.model("Form", formSchema);
