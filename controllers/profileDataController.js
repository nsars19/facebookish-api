const User = require("./../models/user");
const path = require("path");

exports.getProfileImage = async (req, res) => {
  const { userId } = req.params;
  await User.findById(userId)
    .then((data) => {
      res.sendFile(path.join(__dirname, "../", data.profilePhotoSrc));
    })
    .catch((err) => res.json(err));
};
