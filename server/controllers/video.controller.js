const Twilio = require("twilio");
const User = require("../models/Users");
const Room = require("../models/Rooms");
const ErrorResponse = require("../utils/ErrorResponse");

exports.GetVideoToken = (req, res, next) => {
  const id = req.body.id;

  if (!id) return next(new ErrorResponse("No identity", 404));

  const AccessToken = Twilio.jwt.AccessToken;
  const VideoGrant = AccessToken.VideoGrant;

  const token = new AccessToken(
    process.env.TWILIO_ACCOUNT_SID,
    process.env.TWILIO_API_KEY,
    process.env.TWILIO_API_SECRET,
    { identity: id }
  );

  const grant = new VideoGrant({ room: "téléconsultation" });

  token.addGrant(grant);

  res.json({
    id: id,
    jwt: token.toJwt(),
  });
};

exports.GetVideoParticipants = async (req, res, next) => {
  const client = new Twilio(
    process.env.TWILIO_API_KEY,
    process.env.TWILIO_API_SECRET,
    { accountSid: process.env.TWILIO_ACCOUNT_SID }
  );

  const participantsArr = [];
  client.video.rooms
    .list({ status: "completed", limit: 5 })
    .then(async (rooms) => {
      const {
        sid: lastRoomSid,
        duration: roomDuration,
        endTime: roomEndTime,
      } = rooms[0];

      try {
        const room = await Room.findOne({ _id: lastRoomSid });
        //if the latest room is not in the db
        if (!room) {
          // add participans to participantsArray
          client.video
            .rooms(lastRoomSid)
            .participants.list({ status: "disconnected" })
            .then(async (participant) => {
              participant.forEach((p) => participantsArr.push(p.identity));
              // create a new room
              const newRoom = new Room({
                _id: lastRoomSid,
                roomDuration,
                roomEndTime,
                participants: participantsArr,
              });
              //save the new room in db
              try {
                await newRoom.save();
                res.json;
              } catch (error) {
                return next(error);
              }
            })
            .catch((err) => next(err));
        }
        const roomsDB = await Room.find({});
        const sortByDate = (a, b) =>
          new Date(b.roomEndTime) - new Date(a.roomEndTime);

        return res.json(roomsDB.sort(sortByDate));
      } catch (err) {
        return next(err);
      }
    })
    .catch((err) => next(err));
};

exports.GetVideoParticipant = async (req, res, next) => {
  try {
    const user = req.user;
    const rooms = await Room.find({
      participants: { $all: [`${user._id}_${user.lastName}`] },
    });
    if (!rooms) return next(new ErrorResponse("rooms not found", 404));
    else if (rooms.length === 0) return res.json(rooms);
    else console.log(rooms);
    return res.json(
      rooms.sort((a, b) => new Date(b.roomEndTime) - new Date(a.roomEndTime))
    );
  } catch (error) {
    return next(error);
  }
};

exports.UpdateWaitingRoom = async (req, res, next) => {
  const { lastName, email } = req.body;
  try {
    const user = await User.findOne({
      email,
      lastName: lastName.toLowerCase(),
    });
    if (!user) return next(new ErrorResponse("Aucun utilisateur trouvé", 404));
    user.waitingRoom = true;
    await user.save();
    return res.json({
      success: `Téléconsultation pour ${lastName} ajoutée avec succès`,
    });
  } catch (error) {
    return next(error);
  }
};

exports.RemoveWaitingRoom = async (req, res, next) => {
  const { lastName, email } = req.body;
  try {
    const user = await User.findOne({
      email,
      lastName: lastName.toLowerCase(),
    });
    if (!user) return next(new ErrorResponse("Aucun utilisateur trouvé", 404));
    user.waitingRoom = false;
    await user.save();
    return res.json({
      success: `Téléconsultation annulée`,
    });
  } catch (error) {
    return next(error);
  }
};

exports.UpdateUserWaitingRoom = async (req, res, next) => {
  try {
    const user = req.user;
    user.waitingRoom = false;
    await user.save();
    return res.json({
      success: `Téléconsultation terminée`,
    });
  } catch (error) {
    return next(error);
  }
};
