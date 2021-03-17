const User = require("../models/user");

exports.getUsers = (req, res, next) => {
  User.find({}).then((users) => res.json(users));
};

exports.findUser = (req, res, next) => {
  const { userId } = req.params;

  User.findById(userId)
    .populate("posts")
    .then((user) => res.json(user));
};
