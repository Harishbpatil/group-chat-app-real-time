const { fn, Sequelize, col, Op } = require("sequelize");
const Message = require("../models/message");
const User = require("../models/user");

exports.addMessage = async (req, res) => {
  try {
    const { message } = req.body; 
    if (!message) {
      return res
        .status(400)
        .json({ success: false, msg: "Message is required" });
    }
    const result = await Message.create({ message });
    return res.json({ success: true, message: result });
  } catch (e) {
    console.log(e);
    return res
      .status(500)
      .json({ success: false, msg: "Internal server error" });
  }
};

exports.getMessages = async (req, res) => {
  try {
    const { id } = req.query; 
    const result = await Message.findAll({
      where: {
        id: { [Op.gt]: id }
      }
    });

    return res.json({ success: true, messages: result, id: req.user.id });
  } catch (e) {
    console.log(e);
    return res
      .status(500)
      .json({ success: false, msg: "Internal server error" });
  }
};
