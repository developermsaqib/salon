const jwt = require("jsonwebtoken");
const asyncHandler = require("./asyncHandler");
const ErrorResponse = require("../utils/errorResponse");
const { userServices } = require("../api/services");

// @desc      verify jwt token
exports.verifyJwt = async (req, res, next) => {
  try {
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      // set Token for Bearer Token
      token = req.headers.authorization.split(" ")[1];
    }
    
    // Make Sure Token Is Exist
    if(!token){
      if(
        req.query.token
      ){
        token = req.query.token
      }
      if (!token) {
      console.log("no TOken");
      return next(
        new ErrorResponse("Not Authorize to Access this Route ", 401)
      );
    }}
    try {
      // verify Token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await userServices.findById(decoded.id).select("+password");
      next();
    } catch (err) {
      return next(new ErrorResponse("Not Authorize to Access this Route", 401));
    }
  } catch (err) {
    console.log("err", err);
    return next(new ErrorResponse("Not Authorize to Access this Route", 401));
  }
};
