const express = require("express");
const router = express.Router();
const userController = require("../controllers/user");

router.post("/create", userController.createUser);
router.post("/login", userController.login);
module.exports = router;
