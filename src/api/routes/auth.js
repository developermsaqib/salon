const express = require('express');
const authRouter = express.Router();
require('dotenv').config();
const passport = require('passport');
// require('../../utils/passport')(passport);
const jwt = require('jsonwebtoken');
const { validationHandler, asyncHandler } = require('../../middleware');
const authController = require('../controllers/authController');
const {
    registerSchema,loginSchema,forgotPasswordSchema,verifyCodeSchema,resetPasswordSchema
}= require('../../validation/auth')

authRouter.post(
    "/register",
    validationHandler(registerSchema),
    asyncHandler(authController.register)
  );

authRouter.post(
    "/login",
    validationHandler(loginSchema),
    asyncHandler(authController.login)
  );

authRouter.post('/forgotPassword',
validationHandler(forgotPasswordSchema),
asyncHandler(authController.forgotPassword)
)

authRouter.post('/verifyCode',
validationHandler(verifyCodeSchema),
asyncHandler(authController.verifyCode)
)

authRouter.put('/resetPassword',
validationHandler(resetPasswordSchema),
asyncHandler(authController.forgotPassword)
)

authRouter.post('/verifyEmail',
validationHandler(verifyCodeSchema),
asyncHandler(authController.verifyEmail)
)

authRouter.get('/logout',
asyncHandler(authController.logout)
)

authRouter.get(
    "/google",
    passport.authenticate("google", { scope: ["email", "profile"] })
   );

authRouter.get(
    "/google/callback",
    passport.authenticate("google", { session: false }),
    (req, res) => {
        console.log("reqUser=>>>",req.user)
    jwt.sign(
    { user: req.user },
    process.env.JWT_SECRET,
    { expiresIn: "1h" },
    (err, token) => {
    if (err) {
        return res.json({
        token: null,
    });
   }
   res.json({
    id:req.user._id,
    token,
   });
    }
   );
    });

    

module.exports =  authRouter;
