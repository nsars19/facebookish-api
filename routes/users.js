const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

/* GET users listing. */
router.get("/", userController.getUsers);
router.get("/:userId", userController.findUser);
router.post("/new", userController.newUser);
router.post("/update/:userId", userController.updateUser);
router.post("/delete/:userId", userController.deleteUser);

module.exports = router;
