const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema({
  _id: String,
  roomDuration: String,
  roomEndTime: String,
  participants: [],
});

const Room = mongoose.model("Room", roomSchema);

module.exports = Room;
