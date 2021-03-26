const express = require("express");
const router = express.Router();
const likeController = require("./../controllers/likeController");

/* GET home page. */
router.post("/like-post", likeController.likePost);
router.post("/like-comment", likeController.likeComment);

module.exports = router;
