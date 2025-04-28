const User = require("../models/Users");
const ErrorResponse = require("../utils/ErrorResponse");
const {
  getInvitationEmailTemplate,
} = require("../utils/invitationEmailTemplate");
const sendEmail = require("../utils/SendEmail");
const clientURL = process.env.CLIENT_URL;

exports.GetUserInfo = (req, res, next) => {
  if (!req.user) return next(new ErrorResponse("no user", 404));
  res.status(200).json(req.user);
};

exports.GetAllUsers = async (req, res, next) => {
  try {
    const users = await User.find().sort({ createdAt: -1 }).limit(10);
    if (!users) return next(new ErrorResponse("no users", 404));
    res.status(200).json({
      success: true,
      usersList: users,
    });
  } catch (error) {
    return next(error);
  }
};

exports.AddUser = async (req, res, next) => {
  const { lastName, firstName, email, phone } = req.body;

  try {
    const duplicate = await User.findOne({ email });
    if (duplicate) {
      return next(
        new ErrorResponse("A user with this email address already exists.", 409)
      );
    }

    const user = await User.create({
      lastName,
      firstName,
      email,
      phone,
    });

    // Generate a reset token (invitation token)
    const resetToken = user.getResetToken();
    await user.save(); // Save the hashed token and expiration in the DB

    const invitationUrl = `${clientURL}/setup-password/${resetToken}`;

    const emailTemplate = getInvitationEmailTemplate(invitationUrl);
    await sendEmail(email, "Account Invitation", emailTemplate);

    res.status(201).json({
      success: true,
      message: "User created successfully and invitation email sent",
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
    return next(error);
  }
};

exports.DeleteUsers = async (req, res, next) => {
  const { ids } = req.body;

  try {
    await User.deleteMany({ _id: { $in: ids } });

    const updatedUsers = await User.find();

    return res.json({
      success: "Selected users were deleted successfully",
      users: updatedUsers,
    });
  } catch (error) {
    return next(error);
  }
};

exports.UpdateProfile = async (req, res, next) => {
  try {
    const user = await User.findOne({ _id: req.user._id });

    if (!user) return next(new ErrorResponse("aucun utilisateur", 404));

    user.lastName = req.body.lastName || user.lastName;
    user.firstName = req.body.firstName || user.firstName;
    user.email = req.body.email || user.email;
    user.phone = req.body.phone || user.phone;

    const updatedUser = await user.save();

    return res.json({
      _id: updatedUser._id,
      lastName: updatedUser.lastName,
      firstName: updatedUser.firstName,
      email: updatedUser.email,
      phone: updatedUser.phone,
    });
  } catch (error) {
    return next(error);
  }
};

exports.UpdateUserProfile = async (req, res, next) => {
  try {
    const user = await User.findOne({ _id: req.params.userID });

    if (!user) return next(new ErrorResponse("No user found", 404));

    user.lastName = req.body.lastName || user.lastName;
    user.firstName = req.body.firstName || user.firstName;
    user.email = req.body.email || user.email;
    user.phone = req.body.phone || user.phone;

    await user.save();

    const updatedUsers = await User.find().sort({ updatedAt: -1 }).limit(10);
    return res.json({
      updatedUsers,
    });
  } catch (error) {
    return next(error);
  }
};

exports.UpdateProfilePassword = async (req, res, next) => {
  try {
    const user = await User.findOne({ _id: req.user._id }).select("+password");
    if (!user) return next(new ErrorResponse("aucun utilisateur", 404));

    const { password, newPassword, confirmPassword } = req.body;

    if (password && newPassword && confirmPassword) {
      const isMatch = await user.matchingPasswords(password);
      if (!isMatch)
        return next(
          new ErrorResponse("Le mot de passe actuel ne correspond pas", 401)
        );

      if (newPassword !== confirmPassword)
        return next(
          new ErrorResponse(
            "Le nouveau mot de passe et le mot de passe de confirmation ne correspondent pas",
            400
          )
        );
      user.password = newPassword;
      await user.save();
      return res.json({
        success: "Le mot de passe a bien été modifié",
      });
    }

    return next(new ErrorResponse("Unauthorized", 401));
  } catch (error) {
    return next(error);
  }
};
