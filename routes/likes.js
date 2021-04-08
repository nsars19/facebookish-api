const express = require("express");
const router = express.Router();
const likeController = require("./../controllers/likeController");
const {
  createNotification,
} = require("./../controllers/notificationController");

/* GET home page. */
router.post(
  "/like-post",
  likeController.getLike,
  createNotification({ type: "post/like" }),
  likeController.likePost
);

router.post(
  "/like-comment",
  likeController.getLike,
  createNotification({ type: "comment/like" }),
  likeController.likeComment
);

module.exports = router;
