const express = require("express");
const router = express.Router();
const validateRequest = require("../middlewares/validateRequest");

const {
  register,
  login,
  forgotPassword,
  resetPassword,
  setupPassword,
  refresh,
  logout,
} = require("../controllers/auth.controller");

const {
  signupValidation,
  loginValidation,
  forgotPasswordValidation,
  passwordValidation,
} = require("../validation/validation");

router.post("/register", signupValidation, validateRequest, register);

router.post("/login", loginValidation, validateRequest, login);
router.get("/logout", logout);
router.get("/refresh", refresh);

router.post(
  "/forgot-password",
  forgotPasswordValidation,
  validateRequest,
  forgotPassword
);

router.put(
  "/reset-password/:resetToken",
  passwordValidation,
  validateRequest,
  resetPassword
);

router.put(
  "/setup-password/:token",
  passwordValidation,
  validateRequest,
  setupPassword
);

module.exports = router;
