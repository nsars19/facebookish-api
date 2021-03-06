require("dotenv").config();
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const cors = require("cors");
const helmet = require("helmet");

// Setup MongoDB
const mongoose = require("mongoose");
const mongoDB = process.env.MONGODB_URI;
mongoose
  .connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true })
  .catch((err) => console.log(err));

const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));

// Setup Routes
const indexRouter = require("./routes/index");
const usersRouter = require("./routes/users");
const postsRouter = require("./routes/posts");
const commentsRouter = require("./routes/comments");
const profileDataRouter = require("./routes/profileData");
const likeRouter = require("./routes/likes");
const friendRouter = require("./routes/friends");
const uploadRouter = require("./routes/uploads");
const notificationRouter = require("./routes/notifications");
const loginRouter = require("./routes/login");
const imageRouter = require("./routes/images");

const app = express();

app.use(helmet());
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(cors());

app.use("/public", express.static(__dirname + "/public"));
app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/posts", postsRouter);
app.use("/comments", commentsRouter);
app.use("/profiledata", profileDataRouter);
app.use("/likes", likeRouter);
app.use("/friends", friendRouter);
app.use("/upload", uploadRouter);
app.use("/notifications", notificationRouter);
app.use("/login", loginRouter);
app.use("/images", imageRouter);

module.exports = app;
