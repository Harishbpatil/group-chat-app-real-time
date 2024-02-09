const User = require("../models/user");

const bcrpt = require("bcrypt");

exports.createUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    let user = await User.findOne({ where: { email: email } });
    if (user) {
      return res
        .status(403)
        .json({ success: false, msg: "User already exists" });
    }

    const hash = await bcrpt.hash(password, 10);
    user = await User.create({
      name: name,
      email: email,
      password: hash,
    });
    return res.json({ success: true, msg: "User created successfully" });
  } catch (e) {
    console.log(e);
    return res
      .status(500)
      .json({ success: false, msg: "Internal server error" });
  }
};
