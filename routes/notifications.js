const express = require("express");
const router = express.Router();
const notificationController = require("./../controllers/notificationController");

router.put("/complete", notificationController.markComplete);
router.get("/:userId", notificationController.getNotifications);

module.exports = router;
