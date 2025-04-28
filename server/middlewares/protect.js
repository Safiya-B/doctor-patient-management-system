const jwt = require("jsonwebtoken");
const User = require("../models/Users");
const ErrorResponse = require("../utils/ErrorResponse");

exports.protect = async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }
  if (!token)
    return next(
      new ErrorResponse("Authorization failed. No token provided.", 401)
    );

  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    const user = await User.findById(decoded.id);
    if (!user)
      return next(
        new ErrorResponse("Authorization failed. User does not exist.", 404)
      );

    req.user = user;
    next();
  } catch (error) {
    return res.sendStatus(403);
  }
};
