const { body } = require("express-validator");
const {
  validateName,
  validateEmail,
  validatePhone,
  validatePassword,
} = require("./validationRules");

const signupValidation = [
  validateName("lastName"),
  validateName("firstName"),
  validatePhone,
  validateEmail,
  validatePassword,
];

const loginValidation = [
  validateEmail,
  body("password").notEmpty().withMessage("Please enter your password"),
];

const userValidation = [
  validateName("lastName"),
  validateName("firstName"),
  validatePhone,
  validateEmail,
];

const forgotPasswordValidation = [validateEmail];

const passwordValidation = [validatePassword];

module.exports = {
  signupValidation,
  userValidation,
  loginValidation,
  forgotPasswordValidation,
  passwordValidation,
};
