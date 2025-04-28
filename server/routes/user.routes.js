const express = require("express");
const router = express.Router();
const validateRequest = require("../middlewares/validateRequest");
const {
  userValidation,
  passwordValidation,
} = require("../validation/validation");
const { verifyRole } = require("../middlewares/verifyRole");

const {
  GetUserInfo,
  GetAllUsers,
  AddUser,
  SetupPassword,
  DeleteUsers,
  UpdateUserProfile,
  UpdateProfile,
  UpdateProfilePassword,
} = require("../controllers/user.controller");

router
  .route("/")
  .all(verifyRole)
  .get(GetAllUsers)
  .post(userValidation, validateRequest, AddUser);

router.put(
  "/:userID",
  verifyRole,
  userValidation,
  validateRequest,
  UpdateUserProfile
);

router
  .route("/profile")
  .get(GetUserInfo)
  .put(userValidation, validateRequest, UpdateProfile);

router.post("/delete", verifyRole, DeleteUsers);

router.put(
  "/profile/password",
  passwordValidation,
  validateRequest,
  UpdateProfilePassword
);

module.exports = router;
