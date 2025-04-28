const mongoose = require("mongoose");

const SlotSchema = new mongoose.Schema({
  date: { type: String, unique: true },
  timeSlots: [String],
});

const SettingsSchema = new mongoose.Schema({
  times: {},
  startDate: String,
  endDate: String,
  minutes: Number,
  startTime: String,
  endTime: String,
});

const AppointmentsSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    appointments: [
      {
        date: String,
        time: String,
        cancelled: { type: Boolean, default: false },
        ended: { type: Boolean, default: false },
      },
    ],
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

const Slot = mongoose.model("Slot", SlotSchema);
const Settings = mongoose.model("Setting", SettingsSchema);
const Appointments = mongoose.model("Appointments", AppointmentsSchema);

module.exports = {
  Slot,
  Settings,
  Appointments,
};
