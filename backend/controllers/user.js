const User = require("../models/user");
const bcrypt = require("bcrypt");
const { Op } = require("sequelize");
const jwt = require("jsonwebtoken");

exports.createUser = async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;
    let user = await User.findOne({
      where: { [Op.or]: [{ email: email }, { phone: phone }] },
    });
    if (user) {
      return res
        .status(403)
        .json({ success: false, msg: "User already exists" });
    }

    const hash = await bcrypt.hash(password, 10);
    user = await User.create({
      name: name,
      email: email,
      password: hash,
      phone,
    });
    return res.json({ success: true, msg: "User created successfully" });
  } catch (e) {
    console.log(e);
    return res
      .status(500)
      .json({ success: false, msg: "Internal server error" });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email: email } });
    if (!user)
      return res.status(404).json({ success: false, msg: "User not found" });

    const compare = await bcrypt.compare(password, user.password);
    if (compare) {
      const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET);
      return res.json({ success: true, token });
    } else {
      return res.status(401).json({ success: false, msg: "Wrong credentials" });
    }
  } catch (e) {
    console.log(e);
    return res.status(500).json({ success: false, msg: "Internal server error" });
  }
};
