const { Appointments } = require("../models/Appointments");
const File = require("../models/Files");
const User = require("../models/Users");

const users = [
  new User({
    _id: "64d8aca9ce990a8af733b2b2",
    lastName: "Admin",
    firstName: "admin",
    email: "admin@mail.com",
    isAdmin: true,
    phone: "1397988863",
    password: "azertyuiop",
  }),
  new User({
    lastName: "Smith",
    firstName: "Emma",
    email: "emma.smith@example.com",
    phone: "5551234567",
    password: "BlueSky42!",
  }),
  new User({
    lastName: "John",
    firstName: "Liam",
    email: "liam.j@example.com",
    phone: "5552345678",
    password: "GreenTree$9",
  }),
  new User({
    lastName: "Williams",
    firstName: "Olivia",
    email: "olivia.w@example.com",
    phone: "5553456789",
    password: "Sunset@2024",
  }),

  new User({
    lastName: "Garcia",
    firstName: "James",
    email: "j.garcia@example.com",
    phone: "5556789012",
    password: "Firefly*7",
  }),
  new User({
    lastName: "Davis",
    firstName: "Benjamin",
    email: "ben.davis@example.com",
    phone: "5558901234",
    password: "Thunder!99",
  }),
  new User({
    lastName: "Rodriguez",
    firstName: "Mia",
    email: "mia.rod@example.com",
    phone: "5559012345",
    password: "Starlight^4",
  }),
];

exports.seedData = async () => {
  try {
    await User.deleteMany({});
    await File.deleteMany({});

    for (let i = 0; i < users.length; i++) {
      await users[i].save();
    }
  } catch (err) {
    console.error(err);
  }

  console.log("Mock data is seeded from seed script.");
};
