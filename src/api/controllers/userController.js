const { userServices, productServices } = require("../services");
const {salonServices} = require("../services")
const ErrorResponse = require("../../utils/errorResponse");
const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");
const twilio = require("twilio");

dotenv.config();
// const { User } = require("../models/User");
const bcrypt = require("bcryptjs");

const _ = require("lodash");

// @desc      GetAll Users
// @route     Get api/v1/users/findAll
// @access    Private/Admin

exports.findAll = async (req, res, next) => {
  const filter = _.pick(req.query, ["firstName", "role"]);
  const options = _.pick(req.query, [
    "limit",
    "page",
    (limit = "perPage"),
    "populate",
  ]);
  const users = await userServices.findAll(filter, options);
  if (!users) {
    return next(new ErrorResponse(`users not found`, 400));
  }
  res.status(200).json({ success: true, count: users.length, data: users });
};

// @desc      Get Single User
// @route     Get api/v1/users/findOne/:id
// @access    Private/Admin

exports.findOne = async (req, res, next) => {
  const user = await userServices.findOne({ _id: req.params.id });
  if (!user) {
    return next(new ErrorResponse(`No user found`, 400));
  }
  res.status(200).json({ success: true, data: user });
};

// @desc      Update User Details
// @route     Put api/v1/users/update/:id
// @access    Private/Admin

exports.updateUser = async (req, res, next) => {
  const user = await userServices.findById(req.params.id);
  if (!user) {
    return next(
      new ErrorResponse(`User is Not Found With Id: ${req.params.id}`, 400)
    );
  }

  if(req.file){
    const profilePath = `${req.file.destination}/${req.file.filename}`;
    const profilePicUpdate = await userServices.update({_id:user._id},{profilePic:profilePath});
  }
  
  const updatedUser = await userServices.update(req.params.id, req.body); 
  
  res.status(200).json({ success: true, data: updatedUser });
};

// @desc    Update user Password
// @route   PUT /api/v1/users/updatePassword
// @access  Private
exports.updatePassword = async (req, res, next) => {
  const user = await userServices.findById(req.body.id).select("+password");
  // check current Password
  if (!(await user.matchPassword(req.body.currentPassword))) {
    return next(new ErrorResponse("Password Incorrect"));
  }
  user.password = req.body.newPassword;
  await user.save();
  res
    .status(200)
    .json({ success: true, msg: "password updated successfully", data: user });
};

// @desc      Delete User
// @route     Delete api/v1/users/delete/:id
// @access    Private/Admin

exports.deleteUser = async (req, res, next) => {
  const user = await userServices.delete(req.params.id);
  if (!user) {
    return next(
      new ErrorResponse(`User is Not Found With Id: ${req.params.id}`, 400)
    );
  }
  res
    .status(200)
    .json({ success: true, msg: "User deleted successfully", data: user });
};

// @desc      Register User
// @route     Post api/v1/users/create
// @access    User

exports.registerUser = async (req, res, next) => {
  try {
    const user = await userServices.create(req.body);
  if (!user) {
    return next(new ErrorResponse(`No user found`, 400));
  }

  const profilePath = `${req.file.destination}/${req.file.filename}`;
  if(profilePath){
    const profilePicUpload = await userServices.update({_id:user._id},{profilePic:profilePath});
  }

  const token = user.getSignedJwtToken();
  const updateUser = await userServices.update({_id:user._id},{refreshToken:token});
  res.status(200).json({ success: true, token, data: updateUser });
} catch (error) {
  res.status(400).json({ success: false,message:error.message });
  }
  
};

// @desc      Login User
// @route     Post api/v1/users/login
// @access    User
exports.loginUser = async (req, res, next) => {
  const { email, password } = req.body;
  // Validate email & password
  if (!email || !password) {
    return next(new ErrorResponse("Please provide an email and password", 400));
  }
  // validate user
  const user = await userServices.findOne({ email: email }).select("+password");
  if (!user) {
    return next(new ErrorResponse("Invalid credentials", 401));
  }
  const isMatch = await user.matchPassword(password);
  if (!isMatch) {
    return next(new ErrorResponse(`Invalid credentials`, 400));
  }

  // get token from model
  const token = user.getSignedJwtToken();
  // req.user.id = user._id;
  res.status(200).json({
    success: true,
    msg: "user login successfully",
    token,
    data: user,
    id: user._id,
  });
};

// @desc      Forgot User Password
// @route     forgotpassword api/v1/users/sendpasswordlink
// @access    user
const nodemailer = require("nodemailer");
const {
  SMTP_HOST,
  SMTP_PORT,
  SMTP_EMAIL,
  SMTP_PASSWORD,
  DOMAIN,
  JWT_SECRET,
  PASSWORD_LINK_EXPIRE_TIME,
} = process.env;

// Create and configure Nodemailer transporter
const transporter = nodemailer.createTransport({
  host: SMTP_HOST,
  port: SMTP_PORT,
  secure: true,
  auth: {
    user: SMTP_EMAIL,
    pass: SMTP_PASSWORD,
  },
});


exports.sendforgotPasswordLinkEmail = async (req, res) => {
  const { email } = req.body;
  if (!email) {
    res.status(401).json({ status: false, message: "Enter Your Email" });
  }
  try {
    const userfind = await userServices.findOne({ email: email });

    // token generate for reset password
    const token = jwt.sign({ _id: userfind._id }, JWT_SECRET, {
      expiresIn: PASSWORD_LINK_EXPIRE_TIME,
    });

    const id = { _id: userfind._id };
    const data = { verifytoken: token };
    const setusertoken = await userServices.update(id, data);
    if (setusertoken) {
      const mailOptions = {
        from: process.env.SMTP_EMAIL,
        to: email,
        subject: "Sending Email For password Reset",
        html: `This Link is Valid For 3 MINUTES <br> Click the button below: <br> <a style="cursor:pointer;" href="${DOMAIN}/forgotpassword/${userfind.id}/${setusertoken.verifytoken}"> <button style="padding:8px 12px; color:white; background-color:green; border:none; border-radius:8px; " >Reset Password</button></a>  OR <br> click the link below:<br>${DOMAIN}/forgotpassword/${userfind.id}/${setusertoken.verifytoken} <br> `,
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          res.status(401).json({ status: false, message: "Email not send" });
        } else {
          res.status(201).json({
            status: true,
            message: "Please Check Your Email and click the link",
          });
        }
      });
    }
  } catch (error) {
    res.status(401).json({ status: false, error: error });
  }
};

exports.forgotPasswordUserVerify = async (req, res) => {
  const { id, token } = req.params;

  try {
    const validuser = await userServices.findOne({
      _id: id,
      verifytoken: token,
    });

    const verifyToken = jwt.verify(token, process.env.JWT_SECRET);

    if (validuser && verifyToken._id) {
      res.status(201).json({ status: true, validuser });
    } else {
      res.status(401).json({ status: false, message: "user does not exist" });
    }
  } catch (error) {
    res.status(401).json({ status: false, error });
  }
};

exports.changePassword = async (req, res) => {
  const { id, token } = req.params;

  const { password } = req.body;
  try {
    const validuser = await userServices.findOne({
      _id: id,
      verifytoken: token,
    });

    const verifyToken = jwt.verify(token, process.env.JWT_SECRET);

    if (validuser && verifyToken._id) {
      const newpassword = await bcrypt.hash(password, 10);

      const setnewuserpass = await userServices.update(
        { _id: id },
        { password: newpassword }
      );

      setnewuserpass.save();
      res
        .status(201)
        .json({ status: true, message: "Password Change Successfully" });
    } else {
      res.status(401).json({ status: false, message: "user not exist" });
    }
  } catch (error) {
    res.status(401).json({ status: false, error });
  }
};

//@desc      Send otp to user
// @route     Get api/v1/users/send-otp/:id
// @access    user/admin

function generateOTP() {
  return Math.floor(1000 + Math.random() * 9000);
}
exports.sendOTPToSim = async (req, res, next) => {
  try {
    const id = req.params.id;
    const user = await userServices.findOne({ _id: id });
    if (!user) {
      return next(new ErrorResponse(`No user found`, 400));
    }
    const phoneNumber = user.phoneNumber;
    if (!phoneNumber) {
      return next(new ErrorResponse("Phone number is required", 400));
    }
    const otp = generateOTP();
    const updateUser = await userServices.update({ _id: id }, { otp: otp }); // Update user with OTP
    // Initialize Twilio client
    const twilioClient = twilio(
      process.env.TWILIO_ACCOUNT_SID,
      process.env.TWILIO_AUTH_TOKEN
    );
    // Send OTP via Twilio
    await twilioClient.messages.create({
      body: `Your OTP is ${updateUser.otp}`,
      to: phoneNumber,
      from: process.env.TWILIO_PHONE_NUMBER,
    });
    res.status(200).json({
      success: true,
      message: updateUser,
    });
  } catch (error) {
    res.status(500).json({ status: false, error: "Failed to send OTP" });
  }
};
//@desc      Send otp to user Via Email
// @route     Get api/v1/users/send-otp/:id
// @access    user/admin

exports.sendOTPToEmail = async (req, res, next) => {
  try {
    const id = req.params.id;
    const user = await userServices.findOne({ _id: id });
    if (!user) {
      return next(new ErrorResponse(`No user found`, 400));
    }
    const { email } = user;
    const otp = generateOTP();
    const updateUser = await userServices.update({ _id: id }, { otp: otp }); // Update user with OTP

    // send email the otp to user
    const mailOptions = {
      from: process.env.SMTP_EMAIL,
      to: email,
      subject: "OTP verification",
      html: `Your OTP verification Code is: ${otp} `,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        res
          .status(401)
          .json({ status: false, message: "OTP Not Send Please resend it" });
      } else {
        res.status(201).json({
          status: true,
          message: "Please Check OTP in Your Email",
        });
      }
    });
  } catch (error) {
    res.status(500).json({ status: false, error: "Failed to send OTP" });
  }
};

// @desc      Verify OTP of User
// @route     Get api/v1/users/verify-otp/:id
// @access    user/admin

exports.verifyOtp = async (req, res) => {
  try {
    const { id } = req.params;
    const { phoneNumber, otp } = req.body;

    if (!phoneNumber || !otp) {
      return res
        .status(400)
        .json({ status: false, error: "Phone number and OTP are required" });
    }

    const findUser = await userServices.findById(id);
    if (phoneNumber !== findUser.phoneNumber) {
      return res.status(400).json({
        status: false,
        error: "Phone Number is not matched to your account",
      });
    }

    if (findUser.otp !== otp) {
      return res.status(404).json({
        status: false,
        error: "OTP are Wrong. Please write correct OTP or resend OTP.",
      });
    }

    // OTP matched
    const updateUser = await userServices.update({ _id: id }, { otp: "" });
    if (updateUser) {
      return res.json({ status: true, message: "OTP verified successfully" });
    } else {
      return res.json({
        status: true,
        message: "Error Occured try to resend otp",
      });
    }
  } catch (error) {
    // OTP did not match
    return res.status(400).json({ status: false, error: "Invalid OTP" });
  }
};

// @desc      Toggle Favourite Salon
// @route     Get api/v1/users/toggle-favourite-salon/:userId/:salonId
// @access    user/admin
exports.toggleSalonInFavourites = async (req, res) => {
  try {
    const { userId, salonId } = req.params;

    // Find the user by userId
    const user = await userServices.findById(userId);

    // If user is not found, return an error
    if (!user) {
      throw new Error("User not found");
    }

    // Check if the salonId already exists in favouriteSalons
    const salonIndex = user.favouriteSalons.indexOf(salonId);
    console.log(salonIndex);
    if (salonIndex !== -1) {
      // Salon already exists, remove it from favouriteSalons array
      user.favouriteSalons.splice(salonIndex, 1);
      await user.save();
      return res.json({
        status: true,
        message: "Salon removed from favourites",
        user,
      });
    } else {
      // Salon doesn't exist, add it to favouriteSalons array
      user.favouriteSalons.push(salonId);
      await user.save();
      return res.json({
        status: true,
        message: "Salon added to favourites",
        user,
      });
    }
  } catch (error) {
    throw new Error(error.message);
  }
};

// @desc      Get Favourite Salons of user
// @route     Get api/v1/users/get-favourite-salons/:userId
// @access    user/admin

exports.getFavouriteSalon = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await userServices.findById(userId);

    // Fetch salon details for each salon ID in the favouriteSalons array
    const favouriteSalonsDetails = await Promise.all(
      user.favouriteSalons.map(async (salonId) => {
        const salon = await salonServices.findById(salonId);
        return salon;
      })
    );

    res.json({ salonDetails: favouriteSalonsDetails });
  } catch (error) {
    throw new Error(error.message);
  }
};


// @desc      Toggle Favourite Product
// @route     Get api/v1/users/toggle-favourite-product/:userId/:productId
// @access    user/admin
exports.toggleProductInFavourites = async (req, res) => {
  try {
    const { userId, productId } = req.params;

    // Find the user by userId
    const user = await userServices.findById(userId);

    // If user is not found, return an error
    if (!user) {
      throw new Error("User not found");
    }

    // Check if the productId already exists in favouriteProducts
    const salonIndex = user.favouriteProducts.indexOf(productId);
    console.log(salonIndex);
    if (salonIndex !== -1) {
      // Salon already exists, remove it from favouriteProducts array
      user.favouriteProducts.splice(salonIndex, 1);
      await user.save();
      return res.json({
        status: true,
        message: "Product removed from favourites",
        user,
      });
    } else {
      // Product doesn't exist, add it to favouriteProducts array
      user.favouriteProducts.push(productId);
      await user.save();
      return res.json({
        status: true,
        message: "Product added to favourites",
        user,
      });
    }
  } catch (error) {
    throw new Error(error.message);
  }
};


// @desc      Toggle Favourite Product
// @route     Get api/v1/users/toggle-favourite-product/:userId/:productId
// @access    user/admin
exports.getFavouriteProducts = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await userServices.findById(userId);

    // Fetch salon details for each salon ID in the favouriteSalons array
    const favouriteProductsDetails = await Promise.all(
      user.favouriteProducts.map(async (productId) => {
        const product = await productServices.findById(productId);
        return product;
      })
    );

    res.json({ status: true, favouriteProducts: favouriteProductsDetails });
  } catch (error) {
    throw new Error(error.message);
  }
};


