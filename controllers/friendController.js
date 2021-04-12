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
    const newRec = await User.findByIdAndUpdate(
      receiverId,
      { $push: { pendingFriends: senderId } },
      { new: true }
    );

    res.send(newRec.pendingFriends);
  }
};

exports.acceptRequest = async (req, res) => {
  const { senderId, accepterId } = req.body;

  const sender = await User.findByIdAndUpdate(senderId, {
    $push: { friends: accepterId },
    $pull: { pendingFriends: accepterId },
  }).catch((err) => res.send(err));

  const accepter = await User.findByIdAndUpdate(accepterId, {
    $push: { friends: senderId },
    $pull: { pendingFriends: senderId },
  }).catch((err) => res.send(err));

  res.sendStatus(200);
};

exports.denyRequest = async (req, res) => {
  const { senderId, denierId } = req.body;

  await User.findByIdAndUpdate(denierId, {
    $pull: { pendingFriends: senderId },
  })
    .then((result) => {
      res.sendStatus(200);
    })
    .catch((err) => res.send(err));
};
