const ErrorResponse = require("../utils/errorResponse");
exports.verifyRole = (...role) => {
  return (req, res, next) => {
    if (!role.includes(req.user.role)) {
      return next(
        new ErrorResponse(
          `role ${req.user.role}, is not authorized to access this route `,
          403
        )
      );
    }
    next();
  };
};
