require("dotenv").config();
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const User = require("./models/user");
const Post = require("./models/post");
const Comment = require("./models/comment");
const cors = require("cors");

// Setup MongoDB
const mongoose = require("mongoose");
const mongoDB = `${process.env.MONGO_URI}`;
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });

const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));

// Setup Routes
const indexRouter = require("./routes/index");
const usersRouter = require("./routes/users");
const postsRouter = require("./routes/posts");
const commentsRouter = require("./routes/comments");
const profileDataRouter = require("./routes/profileData");
const likeRouter = require("./routes/likes");

const app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(cors({ origin: "http://localhost:3001" }));

app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/posts", postsRouter);
app.use("/comments", commentsRouter);
app.use("/profiledata", profileDataRouter);
app.use("/likes", likeRouter);
app.use("/friends", friendRouter);

module.exports = app;
