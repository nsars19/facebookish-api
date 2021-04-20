const express = require("express");
const router = express.Router();
const { getImage } = require("./../controllers/imageController");

router.get("/:key", getImage);

module.exports = router;
