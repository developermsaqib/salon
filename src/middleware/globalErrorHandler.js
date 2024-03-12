exports.globalErrorHandler = (err, req, res, next) => {
  console.log(err.stack);
  res.status(err.statusCode || 500).json({
    success: false,
    msg: err.message || "server Error",
    // error: err.stack,
  });
};
