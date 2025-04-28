require("dotenv").config();
const app = require("./app");
const cors = require("cors");
const corsOptions = require("./config/corsOptions");
const credentials = require("./middlewares/credentials");
const morganBody = require("morgan-body");
const cookieParser = require("cookie-parser");
const connectDB = require("./config/db");
const { protect } = require("./middlewares/protect");
const errorHandler = require("./middlewares/error");
const helmet = require("helmet");
const { seedData } = require("./utils/seedData");

// connect to the database
connectDB();

app.use(credentials);
app.use(cors(corsOptions));

app.use(cookieParser());
app.use(helmet());

seedData();
morganBody(app);

// public routes
app.use("/api/auth", require("./routes/auth.routes"));

// protected routes
app.use(protect);
app.use("/api/users", require("./routes/user.routes"));
app.use("/api/files", require("./routes/files.routes"));
app.use("/api/video", require("./routes/video.routes"));
app.use("/api/appointments", require("./routes/appointments.routes"));

// Error handler last middleware
app.use(errorHandler);

const port = process.env.PORT || 3000;

const server = app.listen(port, () =>
  console.log(`Server running on port ${port}`)
);
