const express = require("express");

const router = express.Router();

const auth = require("../middlewares/auth");
const groupController = require("../controllers/group");

router.post("/create", auth, groupController.createNewGroup);
router.get("/get-groups", auth, groupController.getGroups);
router.get("/join-group/:groupId", auth, groupController.joinGroup);
router.get("/all-users/:groupId", auth, groupController.getUsers);
router.get("/other-users", auth, groupController.getOtherUsers);

module.exports = router;
