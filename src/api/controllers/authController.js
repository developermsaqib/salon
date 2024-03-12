
const { userServices, formServices } = require("../services");
const ErrorResponse = require("../../utils/errorResponse");
const emailService = require('../../utils/email');
const _ = require('lodash');

  exports.register = async (req, res, next) => {
    req.body.code = Math.floor(1000+Math.random()*9000);
    // const user = await userServices.create(req.body);
    const user = await userServices.create(req.body);
    if (!user) {
      return next(new ErrorResponse(`No user found`, 400));
    }
    const token = user.getSignedJwtToken();
    await emailService.sendVerificationEmail(user.email,null,user.code)
    res.status(200).json({ success: true, token, data: user._id });
  };
  
  // @desc      Login User
  // @route     Post api/v1/users/login
  // @access    User
  exports.login = async (req, res, next) => {
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
    if (!user.isEmailVerified) {
      return next(new ErrorResponse(`Email not verified`, 400));
    }
    

    // get token from model
    const token = user.getSignedJwtToken();
  
    res
      .status(200)
      .json({ success: true, msg: "user login successfully", token, data: user });
  };
  
exports.forgotPassword = async (req, res) => {
    let dbUser = await userServices.findOne({email: req.body.email});
    console.log(dbUser);
    if (!dbUser) {
      return res.status(404).send({
        status: 404,
        message: 'User not found',
      });
    }
    const code = Math.floor(1000+Math.random()*9000);
    
    await emailService.sendResetPasswordEmail(req.body.email, code);
    await userServices.updateByEmail({email:req.body.email}, {code}); 
    
    res.status(200).send({
      message: 'Password reset email has been successfully sent to your email',
    }); 
  };
  
  exports.verifyCode = async (req, res) => {
    const user = await userServices.findOne({email: req.body.email});
    const flag = user ? user.code === req.body.code : false
    console.log(flag);
    if (flag) {
      if (req.body.newPassword) {
        await userServices.updateByEmail({email: req.body.email}, {password: req.body.newPassword});
        res.status(200).send({
          status: 200,
          message: 'Code Verified & Password Updated Successfully',
        });
      } else {
        res.status(200).send({
          status: 200,
          message: 'Code verified',
        });
      }
    } else {
      res.status(400).send({
        status: 400,
        message: 'code didnot verified',
      });
    }
  }

  exports.verifyEmail = async (req,res)=>{
    const {userId,code} = req.body
    const user = await userServices.findOne({_id:userId});
    if(user.code == code){
      const userUpdated = await userServices.update(userId,{isEmailVerified:true,code:null})
      if(userUpdated.isEmailVerified){
        res.status(200).send("Email Verified Successfully!")
      }else{
        res.status(400).send("Email Not Verified & Please send token with right Email!")
      }
    }else{
      res.status(400).send('Code Not Verified!')
    }
  }
  
  exports.resetPassword = async (req, res) => {
    const {email,code,newPassword} = req.body
    let dbUser = await userService.getUserByEmail(email)
      if (!dbUser) {
        return res.status(404).send({
          status: 404,
          message: 'User not found',
        });
      }
        const passwordUpdatedUser = await authService.resetPassword(dbUser, code, newPassword );
        res.status(200).json({
          status: 200,
          message: 'Password changed successfully!',
          "userUpdated":passwordUpdatedUser
        });
      console.log(dbUser)
  }

  exports.logout = async (req,res)=>{

  }