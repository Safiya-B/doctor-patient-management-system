const { body } = require("express-validator");

const validateName = (fieldName) =>
  body(fieldName)
    .notEmpty()
    .withMessage(`Please enter your ${fieldName}`)
    .isAlpha()
    .withMessage(`Please enter a valid ${fieldName}`);

const validateEmail = body("email")
  .trim()
  .isEmail()
  .withMessage("Please enter a valid email address");

const validatePhone = body("phone")
  .trim()
  .matches(/^(0|\+33)[1-9]([-. ]?[0-9]{2}){4}$/)
  .withMessage("Please enter a valid phone number");

const validatePassword = body("password")
  .isStrongPassword({
    minLength: 8,
    minLowercase: 1,
    minUppercase: 1,
    minNumbers: 1,
    minSymbols: 1,
  })
  .withMessage(
    "Password must have at least 8 characters, including an uppercase letter, a lowercase letter, a number, and a symbol"
  );

module.exports = {
  validateName,
  validateEmail,
  validatePhone,
  validatePassword,
};
