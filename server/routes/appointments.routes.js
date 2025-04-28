const express = require("express");
const router = express.Router();
const { verifyRole } = require("../middlewares/verifyRole");
const { body, validationResult } = require("express-validator");
const { validDate, validTime } = require("../utils/Validation");

const {
  AddSlots,
  AddSlot,
  GetSettings,
  GetTimeSlots,
  BookAppointment,
  GetAppointments,
  GetUserAppointments,
  CancelAppointment,
  CancelUserAppointment,
  RemoveAppointment,
} = require("../controllers/appointments.controller");

router.route("/").post(verifyRole, AddSlots).get(verifyRole, GetAppointments);
router.post(
  "/slot",
  verifyRole,
  body("time").custom(validTime),
  body("date").custom(validDate),
  AddSlot
);

router.get("/settings", verifyRole, GetSettings);
router.put("/cancel", verifyRole, CancelAppointment);
router.put("/remove", verifyRole, RemoveAppointment);
router.get("/timeslots", GetTimeSlots);
router.post("/booking", BookAppointment);
router.put("/booking/cancel", CancelUserAppointment);
router.get("/bookings", GetUserAppointments);
router.get("/list", GetAppointments);

module.exports = router;
