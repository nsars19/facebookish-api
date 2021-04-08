const express = require("express");
const comment = require("../models/comment");
const router = express.Router();
const commentController = require("./../controllers/commentController");
const {
  createNotification,
} = require("./../controllers/notificationController");

router.get("/bypost/:postId", commentController.getCommentsByPostId);
router.get("/byuser/:userId", commentController.getCommentsByUserId);
router.get("/byId/:commentId", commentController.getCommentById);
router.put("/update", commentController.updateComment);
router.delete("/delete", commentController.deleteComment);

router.post(
  "/child/new",
  createNotification({ type: "comment/comment" }),
  commentController.createChildComment
);

router.post(
  "/new",
  createNotification({ type: "post/comment" }),
  commentController.createComment
);

module.exports = router;
