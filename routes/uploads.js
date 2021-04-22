const express = require("express");
const router = express.Router();
const uploadController = require("./../controllers/uploadController");

router.post("/:imgPath/:feedType/:userId", uploadController.handleUpload);

module.exports = router;
