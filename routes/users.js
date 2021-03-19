const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

/* GET users listing. */
router.get("/", userController.getUsers);
router.get("/:userId", userController.findUser);
router.post("/new", userController.newUser);
router.put("/update", userController.updateUser);
router.delete("/delete/:userId", userController.deleteUser);

module.exports = router;
