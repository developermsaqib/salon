const userRouter = require("express").Router();
const {
  asyncHandler,
  validationHandler,
  verifyJwt,
  verifyRole,
} = require("../../middleware");
const { userController } = require("../controllers");
const { registerSchema, loginSchema } = require("../../validation");
const { userServices } = require("../services");

userRouter.get(
  "/findAll",
  verifyJwt,
  verifyRole("admin", "salonOwner"),
  asyncHandler(userController.findAll)
);







userRouter.get("/findOne/:id", asyncHandler(userController.findOne));
userRouter.post("/create", asyncHandler(userController.registerUser));
userRouter.post("/login", asyncHandler(userController.loginUser));


userRouter.patch("/update/:id", asyncHandler(userController.updateUser));
userRouter.patch(
  "/updatePassword",
  asyncHandler(userController.updatePassword)
);
userRouter.delete("/delete/:id", asyncHandler(userController.deleteUser));




// Forgot Password
userRouter.post(
  "/sendpasswordlink",
  asyncHandler(userController.sendforgotPasswordLinkEmail)
);

userRouter.get(
  "/forgotpassword/:id/:token",
  asyncHandler(userController.forgotPasswordUserVerify)
);
// Reset Password after forgot password
userRouter.post(
  "/changepassword/:id/:token",
  asyncHandler(userController.changePassword)
);

// OTP

userRouter.get("/send-otp-sms/:id", asyncHandler(userController.sendOTPToSim));
userRouter.get(
  "/send-otp-email/:id",
  asyncHandler(userController.sendOTPToEmail)
  );
userRouter.post("/verify-otp/:id", asyncHandler(userController.verifyOtp));


// Favourite Salon
userRouter.get(
  "/toggle-favourite-salon/:userId/:salonId",
  asyncHandler(userController.toggleSalonInFavourites)
);
userRouter.get(
  "/get-favourite-salons/:userId",
  asyncHandler(userController.getFavouriteSalon)
);

// Favourite Products
userRouter.get(
  "/toggle-favourite-product/:userId/:productId",
  asyncHandler(userController.toggleProductInFavourites)
);
userRouter.get(
  "/get-favourite-products/:userId",
  asyncHandler(userController.getFavouriteProducts)
);


module.exports = userRouter;
