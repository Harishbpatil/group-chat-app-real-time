const express = require("express");
const router = express.Router();
const userController = require("../controllers/user");
const auth = require("../middlewares/auth");

router.post("/create", userController.createUser);
router.post("/login", userController.login);
router.get("/all-users", auth, userController.getAll);
module.exports = router;
