const express = require("express");
const router = express.Router();
const postController = require("./../controllers/postController");

router.get("/", postController.getPosts);
router.get("/:postId", postController.showPost);
router.post("/new", postController.createPost);
router.put("/update/:postId", postController.updatePost);
router.delete("/delete/:postId", postController.deletePost);

module.exports = router;
