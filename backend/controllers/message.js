const { fn, Sequelize, col, Op } = require("sequelize");
const Message = require("../models/message");
const User = require("../models/user");
const Group = require("../models/group");
const Member = require("../models/member");

exports.addMessage = async (req, res) => {
  try {
    const groupId = req.body.groupId;
    const memberId = req.body.memberId;
    const message = req.body.message;
    const member = await Member.findOne({ groupId, id: memberId });
    const result = await member.createMessage({ message, groupId });

    return res.json(result);
  } catch (e) {
    console.log(e);
    return res
      .status(500)
      .json({ success: false, msg: "Internal server error" });
  }
};

exports.getMessages = async (req, res) => {
  try {
    const groupId = req.params.id; // Use req.params.id to access the message ID
    if (!groupId) {
      return res
        .status(400)
        .json({ success: false, msg: "Group id is required" });
    }

    const group = await Group.findByPk(groupId);
    if (!group) {
      return res.status(404).json({ success: false, msg: "Group not found" });
    }

    const messages = await group.getMessages();

    return res.json({ success: true, messages: messages, groupId: groupId }); // Send groupId as response
  } catch (e) {
    console.log(e);
    return res
      .status(500)
      .json({ success: false, msg: "Internal server error" });
  }
};
