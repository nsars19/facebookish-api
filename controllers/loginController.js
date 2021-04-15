const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("./../models/user");

exports.handleLogIn = async (req, res) => {
  const { email, pass } = req.body;

  const user = await User.findOne({ email });

  const correctPassword =
    user === null ? false : await bcrypt.compare(pass, user.passwordHash);

  if (!(user && correctPassword)) {
    res.status(401).json({
      error: "Invalid email or password",
    });
  }

  const tokenUser = {
    email: user.email,
    id: user._id,
  };

  const token = jwt.sign(tokenUser, process.env.TOKEN_SECRET);

  res.send({ token, user: user._id });
};
