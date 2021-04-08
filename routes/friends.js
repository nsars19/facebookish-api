const express = require("express");
const router = express.Router();
const friendController = require("./../controllers/friendController");
const {
  createNotification,
} = require("./../controllers/notificationController");

router.get("/pending/:userId", friendController.getPending);
router.get("/pending-sent/:userId", friendController.getSentRequests);
router.post(
  "/add",
  createNotification({ type: "friendRequest/add" }),
  friendController.addFriend
);
router.post(
  "/accept",
  createNotification({ type: "friendRequest/accept" }),
  friendController.acceptRequest
);
router.post("/deny", friendController.denyRequest);

module.exports = router;
