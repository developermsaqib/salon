/**
 *
 * @param fn
 * handle errors without using try catch
 */
exports.asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);
