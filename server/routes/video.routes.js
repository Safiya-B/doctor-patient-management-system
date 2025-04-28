const express = require("express");
const router = express.Router();
const { verifyRole } = require("../middlewares/verifyRole");

const {
  GetVideoToken,
  GetVideoParticipants,
  UpdateWaitingRoom,
  UpdateUserWaitingRoom,
  GetVideoParticipant,
  RemoveWaitingRoom,
} = require("../controllers/video.controller");

router.post("/token", GetVideoToken);
router.get("/participants", verifyRole, GetVideoParticipants);
router.get("/participant", GetVideoParticipant);
router.put("/add-waitingroom", verifyRole, UpdateWaitingRoom);
router.put("/remove-waitingroom", verifyRole, RemoveWaitingRoom);
router.put("/user-waitingroom", UpdateUserWaitingRoom);

module.exports = router;
