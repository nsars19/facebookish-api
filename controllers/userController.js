const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// INDEX
exports.getUsers = async (req, res, next) => {
  await User.find({}).then((users) => res.json(users));
};

exports.getDisconnectedUsers = async (req, res) => {
  const { userId } = req.params;
  const user = await User.findById(userId);
  const sent = await User.find({ pendingFriends: userId });

  const disqualified = user.friends
    .concat(user.pendingFriends)
    .concat(sent.map((user) => user._id))
    .concat(userId);

  await User.find({ _id: { $nin: disqualified } })
    .then((data) => res.send(data))
    .catch((err) => res.send(err));
};

// SHOW
exports.findUser = async (req, res, next) => {
  const { userId } = req.params;
  const userOptions = {
    firstName: 1,
    lastName: 1,
    profilePhotoSrc: 1,
    bannerSrc: 1,
  };

  await User.findById(userId)
    .populate("friends", userOptions)
    .then((user) => res.json(user))
    .catch((err) => res.json(err));
};

// CREATE
exports.newUser = async (req, res) => {
  const { firstName, lastName, email, password } = req.body;

  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(password, saltRounds);

  const user = new User({
    firstName,
    lastName,
    email,
    passwordHash,
    createdAt: Date.now(),
  });

  user
    .save()
    .then((user) => {
      const token = jwt.sign(
        { email: user.email, id: user._id },
        process.env.TOKEN_SECRET
      );

      res.json({ token, user: user._id });
    })
    .catch((err) => res.json(err.message));
};

// UPDATE
exports.updateUser = async (req, res) => {
  const { userId, newInfo } = req.body;

  const keys = Object.keys(newInfo);
  if (keys.includes("password")) {
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(newInfo.password, saltRounds);

    delete newInfo.password;
    newInfo.passwordHash = passwordHash;
  }

  const user = await User.findByIdAndUpdate(userId, newInfo);
  res.json(user);
};

// DELETE
exports.deleteUser = async (req, res) => {
  const { userId } = req.body;

  await User.findByIdAndDelete(userId)
    .then((result) => res.json(result))
    .catch((err) => res.json(err));
};
