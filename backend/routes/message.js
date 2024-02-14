const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth");
const messageControllers = require("../controllers/message");

router.post("/add-message", auth, messageControllers.addMessage);
router.get("/get-messages/:id", auth, messageControllers.getMessages); // Update route definition to include :id parameter


module.exports = router;
