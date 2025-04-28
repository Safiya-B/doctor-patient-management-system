const crypto = require("crypto");
const User = require("../models/Users");
const ErrorResponse = require("../utils/ErrorResponse");
const jwt = require("jsonwebtoken");
const sendEmail = require("../utils/SendEmail");
const { getResetEmailTemplate } = require("../utils/resetEmailTemplate");
const clientURL = process.env.CLIENT_URL;

exports.register = async (req, res, next) => {
  const { lastName, firstName, email, password, phone } = req.body;

  try {
    //email already in use
    const duplicate = await User.findOne({ email });
    if (duplicate)
      return next(
        new ErrorResponse("Cannot create an account with this address.", 409)
      );

    const newUser = await User.create({
      lastName,
      firstName,
      email,
      phone,
      password,
    });

    res.status(201).json({
      success: true,
      user: newUser,
    });
  } catch (err) {
    next(err);
  }
};

exports.login = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email }).select("+password");

    if (!user)
      return next(
        new ErrorResponse(
          "Unable to connect. Please verify your credentials.",
          401
        )
      );

    const isMatch = await user.matchingPasswords(password);

    if (!isMatch)
      return next(
        new ErrorResponse("The email or password is incorrect.", 401)
      );

    const accessToken = user.getAccessToken();
    const refreshToken = user.getRefreshToken();

    user.refreshToken = refreshToken;
    await user.save();

    res.cookie("jwt", refreshToken, {
      httpOnly: true,
      secure: false,
      //sameSite: "none",
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.json({
      user: {
        id: user.id,
        filesList: user.filesList,
        isAdmin: user.isAdmin,
        waitingRoom: user.waitingRoom,
        lastName: user.lastName,
        firstName: user.firstName,
        email: user.email,
        phone: user.phone,
      },
      accessToken,
    });
  } catch (error) {
    next(error);
  }
};

exports.refresh = async (req, res, next) => {
  const cookies = req.cookies;

  if (!cookies || !cookies.jwt)
    return next(new ErrorResponse("Unauthorized", 401));

  try {
    const refreshToken = cookies.jwt;

    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);

    const user = await User.findById(decoded.id);

    if (!user) return next(new ErrorResponse("Unauthorized", 401));

    const accessToken = user.getAccessToken();

    res.json({
      user: {
        id: user.id,
        filesList: user.filesList,
        isAdmin: user.isAdmin,
        waitingRoom: user.waitingRoom,
        lastName: user.lastName,
        firstName: user.firstName,
        email: user.email,
        phone: user.phone,
      },
      accessToken,
    });
  } catch (error) {
    next(error);
  }
};

exports.logout = async (req, res, next) => {
  const cookies = req.cookies;

  if (!cookies || !cookies.jwt)
    return next(new ErrorResponse("No content", 204));

  const refreshToken = cookies.jwt;
  try {
    const user = await User.findOne({ refreshToken });
    if (!user) {
      res.clearCookie("jwt", {
        httpOnly: true,
        //sameSite: "None",
        secure: false,
      });
      return next(new ErrorResponse("No content", 204));
    }

    user.refreshToken = "";

    await user.save();

    res.clearCookie("jwt", {
      httpOnly: true,
      //sameSite: "None",
      secure: false,
    });

    return next(new ErrorResponse("No content", 204));
  } catch (err) {
    return next(err);
  }
};

exports.forgotPassword = async (req, res, next) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) return next(new ErrorResponse("Email could not be sent.", 400));

    const resetToken = user.getResetToken();

    await user.save();

    const resetUrl = `${clientURL}/resetpassword/${resetToken}`;

    const emailTemplate = getResetEmailTemplate(resetUrl);
    await sendEmail(email, "Reset Password", emailTemplate);

    res.status(201).json({
      success: true,
      message: "Reset email sent successfully",
      user: {
        id: user.id,
        lastName: user.lastName,
        firstName: user.firstName,
        email: user.email,
        phone: user.phone,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

exports.resetPassword = async (req, res, next) => {
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.resetToken)
    .digest("hex");

  try {
    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() },
    });
    if (!user) return next(new ErrorResponse("Invalid reset link.", 401));

    if (req.body.password !== req.body.confirmPswd)
      return next(new ErrorResponse("Passwords do not match.", 400));
    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    res.status(201).json({
      success: true,
      message: "Your password has been reset successfully.",
    });
  } catch (error) {
    next(error);
  }
};

exports.setupPassword = async (req, res, next) => {
  const { token } = req.params;
  const { password, confirmPassword } = req.body;

  try {
    // Hash the token from the URL to match the stored hashed token
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    // Find the user with the matching token and ensure it's not expired
    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpire: { $gt: Date.now() }, // Check if the token is still valid
    });

    if (!user) {
      return next(new ErrorResponse("Invalid or expired token", 400));
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ error: "Passwords do not match" });
    }

    // Update the user's password (hashing will happen automatically in the `pre("save")` middleware)
    user.password = password;

    // Clear the reset token fields
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    // Save the updated user
    await user.save();

    res
      .status(200)
      .json({ success: true, message: "Password setup successful" });
  } catch (error) {
    next(error);
  }
};
