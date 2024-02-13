const express = require("express");

const router = express.Router();

const auth = require("../middlewares/auth");
const messageControllers = require("../controllers/message");

router.post("/add-message", auth, messageControllers.addMessage);


module.exports = router;
