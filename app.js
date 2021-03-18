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
const mongoDB = `mongodb+srv://${process.env.MONGODB_USER}:${process.env.MONGODB_PASS}@realmcluster.htwkr.mongodb.net/social_clone?retryWrites=true&w=majority`;
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });

const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));

// Setup Routes
const indexRouter = require("./routes/index");
const usersRouter = require("./routes/users");

const app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(cors({ origin: "http://localhost:3001" }));

app.use("/", indexRouter);
app.use("/users", usersRouter);

module.exports = app;
