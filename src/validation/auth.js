const joi = require("joi");

// create user Validation

exports.registerSchema = joi.object({}).keys({
  firstName: joi.string().trim(),
  lastName: joi.string().trim(),
  email: joi
    .string()
    .email()
    .required("email is require field")
    .trim()
    .lowercase(),
  password: joi.string().required().trim().min(6),
  role: joi.string().trim().required("role is required field"),
  phoneNumber: joi.string().trim(),
  address: joi.string().trim(),
  status: joi.string().trim(),
  gender: joi.string().trim(),
  country:joi.string().required()
});

exports.loginSchema = joi.object({}).keys({
  email: joi
    .string()
    .email()
    .required("email is require field")
    .trim()
    .lowercase(),
  password: joi.string().required("password is require field").trim().min(6),
});

exports.forgotPasswordSchema = joi.object().keys({
  email: joi.string().email().required("email is require field")
})

exports.verifyCodeSchema = joi.object().keys({
  email: joi.string().email().optional(),
  userId: joi.string(),
  code:joi.string().max(4),
  newPassword: joi.string().optional()
})

exports.resetPasswordSchema = joi.object().keys({
  email: joi.string().email().required("email is require field"),
  newPassword: joi.string().optional()
})
