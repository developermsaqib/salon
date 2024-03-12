const ErrorResponse = require("../utils/errorResponse");
exports.validationHandler = (schema) => {
  // async (req, res, next) => {

  return async (req, res, next) => {
    const options = {
      errors: {
        wrap: {
          label: "",
        },
      },
    };
    const { error, value } = schema.validate(req.body, options);
    if (!error) {
      req.body = value;
      next();
    } else {
      const message = error.details[0].message;
      next(new ErrorResponse(message, 400));
    }
  };
};
