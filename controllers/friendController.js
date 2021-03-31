const User = require("./../models/user");

exports.getPending = async (req, res) => {
  const { userId } = req.params;

  const user = await User.findById(userId).populate("pendingFriends", {
    firstName: 1,
    lastName: 1,
    profilePhotoSrc: 1,
    friends: 1,
  });

  res.json(user.pendingFriends);
};

exports.getSentRequests = async (req, res) => {
  const { userId } = req.params;
  await User.find({ pendingFriends: userId })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => res.send(err));
};

exports.addFriend = async (req, res) => {
  const { receiverId, senderId } = req.body;
  const receiver = await User.findById(receiverId);

  if (receiver.pendingFriends.includes(senderId)) {
    res.send(receiver.pendingFriends);
  } else {
    receiver.pendingFriends = [...receiver.pendingFriends].concat(senderId);
    receiver.save();
    res.send(receiver.pendingFriends);
  }
};
