const express = require("express");
const comment = require("../models/comment");
const router = express.Router();
const commentController = require("./../controllers/commentController");

router.get("/bypost/:postId", commentController.getCommentsByPostId);
router.get("/byuser/:userId", commentController.getCommentsByUserId);
router.post("/new", commentController.createComment);
router.put("/update", commentController.updateComment);
router.delete("/delete", commentController.deleteComment);

module.exports = router;
