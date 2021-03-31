const express = require("express");
const router = express.Router();
const friendController = require("./../controllers/friendController");

router.get("/pending/:userId", friendController.getPending);
router.get("/pending-sent/:userId", friendController.getSentRequests);
router.post("/add", friendController.addFriend);

module.exports = router;
