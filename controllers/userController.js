const User = require("../models/user");
const bcrypt = require("bcrypt");

// INDEX
exports.getUsers = (req, res, next) => {
  User.find({}).then((users) => res.json(users));
};

// SHOW
exports.findUser = (req, res, next) => {
  const { userId } = req.params;

  User.findById(userId)
    .then((user) => res.json(user))
    .catch((err) => res.json({ message: "User not found." }));
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
  });

  user
    .save()
    .then((user) => res.json(user))
    .catch((err) => res.json(err.message));
};

// UPDATE

// DELETE
