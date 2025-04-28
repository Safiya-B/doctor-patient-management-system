const { Slot, Settings, Appointments } = require("../models/Appointments");
const ErrorResponse = require("../utils/ErrorResponse");
const { body, validationResult } = require("express-validator");
const mongoose = require("mongoose");
const moment = require("moment");

exports.AddSlots = async (req, res, next) => {
  const days = [];
  const { times, startDate, endDate, startTime, endTime } = req.body;

  //hashmap with each day as a number
  const timesMap = new Map();
  timesMap.set(0, times.dimanche);
  timesMap.set(1, times.lundi);
  timesMap.set(2, times.mardi);
  timesMap.set(3, times.mercredi);
  timesMap.set(4, times.jeudi);
  timesMap.set(5, times.vendredi);
  timesMap.set(6, times.samedi);

  if (
    moment(startDate).isBefore(moment()) ||
    moment(endDate).isBefore(moment())
  )
    return next(new ErrorResponse("Invalid date", 404));

  //if startDate is greater than endDate
  if (!moment(startDate).isSameOrBefore(moment(endDate)))
    //start-date must be before end-date
    return next(
      new ErrorResponse(
        "La date de début doit être inférieure à la date de fin",
        404
      )
    );

  if (parseInt(startTime) > parseInt(endTime))
    //start-time must be before end-time
    return next(
      new ErrorResponse(
        "L'heure de début doit être inferieure à l'heure de fin'",
        404
      )
    );
  //loop through date dateRange

  for (
    let m = moment(startDate);
    m.isSameOrBefore(endDate, "days");
    m.add(1, "days")
  ) {
    days.push({ day: m.day(), date: m.format("DD-MM-YYYY") });
  }

  try {
    //first delete every dates and settings saved before
    await Slot.deleteMany({});
    await Settings.deleteMany({});

    for (d of days) {
      const timesArray = timesMap.get(d.day);
      const slot = {
        date: d.date,
        timeSlots: timesArray,
      };
      //save document only if timesArray is not empty
      if (timesArray.length > 0) await Slot.create(slot);
    }
    await Settings.create(req.body);

    res.json({ success: "Vos disponibilités sont enregistrés" });
  } catch (err) {
    return next(err);
  }
};

exports.AddSlot = async (req, res, next) => {
  const { date, time } = req.body;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const sortByTime = (a, b) => {
    return a.localeCompare(b);
  };

  try {
    const slots = await Slot.findOne({ date });
    //if slot date is not there, add it( only for today's date)
    if (!slots) {
      if (moment(date, "DD-MM-YYYY").isSameOrAfter(moment().startOf("day"))) {
        const newSlot = {
          date,
          timeSlots: time,
        };
        const slotCreated = await Slot.create(newSlot);
        return res.json(slotCreated);
      } else next(new ErrorResponse("Cannot add slot", 404));
    }

    if (slots.timeSlots.indexOf(time) !== -1) {
      return next(new ErrorResponse("Time already exists", 404));
    }

    slots.timeSlots = [...slots.timeSlots, time];
    slots.timeSlots.sort(sortByTime);
    await slots.save();
    res.json(slots);
  } catch (err) {
    return next(err);
  }
};

exports.GetSettings = async (req, res, next) => {
  try {
    const settings = await Settings.find({});
    res.json({ settings });
  } catch (err) {
    return next(err);
  }
};

exports.GetTimeSlots = async (req, res, next) => {
  try {
    const slots = await Slot.find({});
    const currentDate = moment().startOf("day");

    if (!slots) return next(new ErrorResponse("Aucune disponibilité", 400));

    //check if slots date is past the current date, if so remove it

    slots.forEach(async (slot) => {
      if (moment(slot.date, "DD-MM-YYYY").isBefore(currentDate))
        try {
          await Slot.deleteOne({ date: slot.date });
        } catch (err) {
          return next(err);
        }
    });

    const slotsAfterDelete = await Slot.find({});

    res.json(slotsAfterDelete);
  } catch (error) {
    return next(error);
  }
};

exports.GetAppointments = async (req, res, next) => {
  const currentDate = moment().startOf("day");
  try {
    const appointmentsList = await Appointments.find().populate({
      path: "user",
      select: ["lastName", "firstName"],
    });

    if (appointmentsList) {
      appointmentsList.forEach((list) => {
        list.appointments.forEach((a) => {
          if (moment(a.date, "DD-MM-YYYY").isBefore(currentDate))
            a.ended = true;
        });
      });
      return res.json(appointmentsList);
    }

    return res.json({ message: "no appointments" });
  } catch (err) {
    return next(err);
  }
};

exports.BookAppointment = async (req, res, next) => {
  const { date, time } = req.body;
  const userId = req.user._id;

  if (!date || !time) {
    return next(new ErrorResponse("Choisir une date et un horaire", 400));
  }

  try {
    // if timeSlot exists, remove it from the array so that no other user can book it
    const bookTime = await Slot.findOneAndUpdate(
      { date, timeSlots: time },
      {
        $pull: { timeSlots: time },
      }
    );

    if (!bookTime)
      return next(new ErrorResponse("Cette horaire n'est pas disponible", 400));

    const bookings = await Appointments.findOne({
      user: userId,
    });

    if (!bookings) {
      await Appointments.create({
        user: userId,
        appointments: [{ date: date, time: time }],
      });
      return res.json({
        success: "Votre rendez-vous a bien été enregistré. Merci.",
      });
    }

    bookings.appointments.push({
      date: date,
      time: time,
    });
    const updatedAppointment = await bookings.save();

    res.json({
      success: "Votre rendez-vous a bien été enregistré. Merci.",
      updatedAppointment,
    });
  } catch (err) {
    return next(err);
  }
};

exports.GetUserAppointments = async (req, res, next) => {
  const userId = req.user._id;
  try {
    const appointmentsList = await Appointments.findOne({ user: userId });

    //update appointment if it ended

    const currentDate = moment().startOf("day");
    if (appointmentsList) {
      appointmentsList.appointments.forEach((a) => {
        if (moment(a.date, "DD-MM-YYYY").isBefore(currentDate)) {
          a.ended = true;
        }
      });

      await appointmentsList.save();
      return res.json(appointmentsList);
    } else return res.json({ appointments: [] });
  } catch (err) {
    return next(err);
  }
};

exports.CancelUserAppointment = async (req, res, next) => {
  const userId = req.user._id;
  const { appointmentId } = req.body;

  try {
    const appointment = await Appointments.findOneAndUpdate(
      {
        user: userId,
        appointments: { $elemMatch: { _id: appointmentId } },
      },
      { $set: { "appointments.$.cancelled": true } },
      { new: true }
    );
    // make the slot available again
    const s = appointment.appointments.filter((a) => a._id == appointmentId);

    if (s.length === 0)
      return next(
        new ErrorResponse("impossible d'annuler ce rendez vous ", 400)
      );
    const newSlot = {
      date: s[0].date,
      timeSlots: s[0].time,
    };
    const slots = await Slot.findOne({ date: s[0].date });

    if (slots && !slots.timeSlots.includes(s[0].time)) {
      slots.timeSlots.push(s[0].time);
      await slots.save();
    }

    return res.json(slots);
  } catch (err) {
    return next(err);
  }
};

exports.CancelAppointment = async (req, res, next) => {
  const { appointmentId, userId } = req.body;

  try {
    const appointment = await Appointments.findOneAndUpdate(
      {
        user: userId,
        appointments: { $elemMatch: { _id: appointmentId } },
      },
      { $set: { "appointments.$.cancelled": true } },
      { new: true }
    );
    // make the slot available again
    const s = appointment.appointments.filter((a) => a._id == appointmentId);

    if (s.length === 0)
      return next(
        new ErrorResponse("impossible d'annuler ce rendez vous ", 400)
      );
    const newSlot = {
      date: s[0].date,
      timeSlots: s[0].time,
    };
    const slots = await Slot.findOne({ date: s[0].date });

    if (slots && !slots.timeSlots.includes(s[0].time)) {
      slots.timeSlots.push(s[0].time);
      await slots.save();
    }

    return res.json(slots);
  } catch (err) {
    return next(err);
  }
};

exports.RemoveAppointment = async (req, res, next) => {
  const { date, time } = req.body;

  if (!date || !time)
    return next(new ErrorResponse("you must provide the date and time", 400));

  try {
    const slot = await Slot.findOne({ date });

    if (!slot)
      return next(
        new ErrorResponse("found no slot with this date and time", 400)
      );

    slot.timeSlots = slot.timeSlots.filter((t) => t != time);

    await slot.save();

    return res.json(slot);
  } catch (error) {
    return next(error);
  }
};
