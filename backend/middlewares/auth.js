const jwt = require("jsonwebtoken");
const User = require("../models/user");

const authenticate = async (req, res, next) => {
  try {
    const token = req.headers["auth-token"];
    const data = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findByPk(data.id);
    req.user = user;
    next();
  } catch (e) {
    console.log(e);
    return res
      .status(500)
      .json({ success: false, msg: "Internal server error" });
  }
};

module.exports = authenticate;
