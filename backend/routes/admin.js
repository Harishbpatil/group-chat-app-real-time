const express = require("express");

const router = express.Router();
const auth = require("../middlewares/auth");
const adminControllers = require("../controllers/admin");

router.post("/remove-member/:groupId", auth, adminControllers.removeMember);

router.post("/make-admin/:groupId", auth, adminControllers.makeAdmin);

router.post("/remove-admin/:groupId", auth, adminControllers.removeAdmin);
router.post("/show-users/:groupId", auth, adminControllers.showUser);
router.post("/add-user/:groupId", auth, adminControllers.addUser);

module.exports = router;
