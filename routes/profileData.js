const express = require("express");
const router = express.Router();
const profileController = require("./../controllers/profileDataController");

router.get("/:userId", profileController.getProfileImage);

module.exports = router;
