const Post = require("./../models/post");
const User = require("./../models/user");
const Comment = require("./../models/comment");
const Notification = require("./../models/notification");

exports.getNotifications = async (req, res) => {
  const { userId } = req.params;

  await Notification.find({
    user: userId,
    readStatus: false,
  })
    .populate("sender", { firstName: 1, lastName: 1, profilePhotoSrc: 1 })
    .sort({ createdAt: "descending" })
    .then((data) => res.send(data))
    .catch((err) => res.send(err));
};

exports.markComplete = async (req, res) => {
  const { notifId, userId } = req.body;

  await Notification.findByIdAndUpdate(notifId, { readStatus: true });

  await Notification.find({ user: userId, readStatus: false })
    .populate("sender", { firstName: 1, lastName: 1, profilePhotoSrc: 1 })
    .sort({ createdAt: "descending" })
    .then((data) => res.send(data))
    .catch((err) => res.send(err));
};

exports.createNotification = (notification) => {
  return async (req, res, next) => {
    const [mainType, subType] = notification.type.split("/");

    // Prevent notifying if 'unliking' an item
    if (subType === "like" && req.unliked) {
      next();
    } else {
      switch (mainType) {
        case "post":
          handlePostNotification(subType, req.body);
          break;
        case "comment":
          handleCommentNotification(subType, req.body);
          break;
        case "friendRequest":
          handleRequestNotification(subType, req.body);
          break;
        default:
          break;
      }

      next();
    }
  };
};

// HANDLER FUNCTIONS
async function handlePostNotification(subType, reqBody) {
  if (subType === "comment") {
    createPostCommentNotification(reqBody);
  }

  if (subType === "like") {
    createPostLikeNotification(reqBody);
  }
}

async function handleCommentNotification(subType, reqBody) {
  if (subType === "comment") {
    createCommentCommentNotification(reqBody);
  }

  if (subType === "like") {
    createCommentLikeNotification(reqBody);
  }
}

async function handleRequestNotification(subType, reqBody) {
  if (subType === "add") {
    createAddRequestNotification(reqBody);
  }

  if (subType === "accept") {
    createAcceptRequestNotification(reqBody);
  }
}

// CREATOR FUNCTIONS
async function createPostCommentNotification(reqBody) {
  const { author, post } = reqBody;

  const postItem = await Post.findById(post);

  // Prevent the user from sending themselves a notification
  if (postItem.author.toString() === author) return;

  new Notification({
    user: postItem.author._id,
    notificationType: "post/comment",
    sender: author,
    createdAt: Date.now(),
  }).save();
}

async function createPostLikeNotification(reqBody) {
  const { user, post } = reqBody;

  const postItem = await Post.findById(post);

  if (postItem.author.toString() === user) return;

  new Notification({
    user: postItem.author,
    notificationType: "post/like",
    sender: user,
    createdAt: Date.now(),
  }).save();
}

async function createCommentCommentNotification(reqBody) {
  const { author, comment } = reqBody;

  const commentItem = await Comment.findById(comment);

  if (commentItem.author.toString() === author) return;

  new Notification({
    user: commentItem.author,
    notificationType: "comment/comment",
    sender: author,
    createdAt: Date.now(),
  }).save();
}

async function createCommentLikeNotification(reqBody) {
  const { user, comment } = reqBody;

  const commentItem = await Comment.findById(comment);

  if (commentItem.author.toString() === user) return;

  new Notification({
    user: commentItem.author,
    notificationType: "comment/like",
    sender: user,
    createdAt: Date.now(),
  }).save();
}

async function createAddRequestNotification(reqBody) {
  const { receiverId, senderId } = reqBody;

  new Notification({
    user: receiverId,
    notificationType: "friendRequest/add",
    sender: senderId,
    createdAt: Date.now(),
  }).save();
}

async function createAcceptRequestNotification(reqBody) {
  const { senderId, accepterId } = reqBody;

  new Notification({
    user: senderId,
    notificationType: "friendRequest/accept",
    sender: accepterId,
    createdAt: Date.now(),
  }).save();
}
