const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const mongoosePaginate = require("mongoose-paginate-v2");
//UserSchema
const userSchema = new mongoose.Schema({
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
  username: {
    type: String,
    default: function () {
      return this.firstName + this.lastName;
    },
  },
  email: {
    type: String,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      "Please add a valid email",
    ],
    required: [true, "E-mail is Required"],
    unique: [true, "E-mail Already Exist"],
    lowercase: true,
    default: function () {
      this.google.email ? (this.email = this.google.email) : null;
    },
  },
  password: {
    type: String,
    required: [true, "Please Add Password"],
    minlength: 6,
    select: false,
  },
  role: {
    type: String,
    enum: ["customer", "admin", "salonOwner", "staff"],
    default: "customer",
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  isLoggedIn: {
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
  country: {
    type: String,
    default: "",
  },
  code: {
    type: String,
  },
  otp: {
    type: String,
    default: '',
  },
  calendarId: {
    type: String,
    default: '',
  },
  profilePic: {
    type: String,
    default: '',
  },
  salonId: [
    {
      type: mongoose.Schema.ObjectId,
      ref: "Salon",
    },
  ],
  favouriteSalons:[
    {
      type:mongoose.Schema.ObjectId,
      ref:"Salon"
    }
  ],
  favouriteProducts:[
    {
      type:mongoose.Schema.ObjectId,
      ref:"Product"
    }
  ],
  method: String,
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
  isDelete: {
    type: Boolean,
    default: false,
  },
  isEmailVerified: {
    type: Boolean,
    default: false,
  },
  refreshToken: {
    type: String,
    default: "",
  },
  verifytoken: {
    type: String,
    default: "",
  },
  
  createdBy: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
  }
}, {timestamps:true});

userSchema.plugin(mongoosePaginate);

userSchema.post("save", function (error, doc, next) {
  if (error.code === 11000) {
    next(new Error("There was a duplicate key error"));
  } else {
    next();
  }
});

// Encrypt password using bcrypt
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

userSchema.pre(["updateOne", "findOneAndUpdate"], async function (next) {
  const user = this;
  if (this._update.password) {
    this._update.password = await bcrypt.hash(String(this._update.password), 8);
  }
  next();
});

// userSchema.pre(['find','findOne','findById'],function(next){
//   this.where({isDelete:false})
//   next()
// })
// Match user entered password to hashed password
userSchema.methods.matchPassword = async function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

// Sign JWT and return
userSchema.methods.getSignedJwtToken = function () {
  console.log(process.env.JWT_SECRET);
  return jwt.sign(
    { id: this._id, role: this.role, iat: Date.now() },
    process.env.JWT_SECRET,
    {
      expiresIn: "15d",
    }
  );
};

userSchema.post("save", function (error, doc, next) {
  console.log("SUSPECT ENTER->>>>>>>>>>>>>>>>>>>>>>>>>>");
  if (error.name === "MongoError" && error.code === 11000) {
    next(new Error("There was a duplicate key error"));
  } else {
    next();
  }
});

module.exports = mongoose.model("User", userSchema);
