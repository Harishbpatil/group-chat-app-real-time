const Group = require("../models/group");

exports.createNewGroup = async (req, res) => {
  try {
    const name = req.body.name;

    const group = await Group.create({ name: name, admin: true });
    const member = await req.user.addGroup(group, { through: { admin: true } });
    return res.json({ group, member });
  } catch (e) {
    console.log(e);
    return res
      .status(500)
      .json({ success: false, msg: "Internal server error" });
  }
};

exports.getGroups = async (req, res) => {
  try {
    const groups = await req.user.getGroups();
    return res.json(groups);
  } catch (e) {
    console.log(e);
    return res
      .status(500)
      .json({ success: false, msg: "Internal server error" });
  }
};

exports.joinGroup = async (req, res) => {
  try {
    const groupId = req.params.groupId;
    const group = await Group.findByPk(groupId);
    if (group) {
      const member = await group.addUser(req.user);
      return res.json(member);
    } else {
      return res.status(404).json({ msg: "Group does not exist" });
    }
  } catch (e) {
    console.log(e);
    return res
      .status(500)
      .json({ success: false, msg: "Internal server error" });
  }
};
