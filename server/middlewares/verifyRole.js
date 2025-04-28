const ErrorResponse = require("../utils/ErrorResponse");

exports.verifyRole = (req, res, next) => {
  if (!req?.user?.isAdmin) return next(new ErrorResponse("Unauthorized", 401));
  next();
};
