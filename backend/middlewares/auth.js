const jwt = require("jsonwebtoken");
const User = require("../models/user");

const authenticate = async (req, res, next) => {
  try {
    const token = req.headers["auth-token"];
    if (!token) {
      return res.status(401).json({ success: false, msg: "No token provided" });
    }

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Decoded token:", decodedToken); // Log decoded token for debugging

    const user = await User.findByPk(decodedToken.id);
    if (!user) {
      return res.status(401).json({ success: false, msg: "Invalid token" });
    }

    req.user = user;
    next();
  } catch (e) {
    console.error("Authentication error:", e); 
    return res
      .status(500)
      .json({ success: false, msg: "Internal server error" });
  }
};

const socketAuthenticate = async(socket, next) => {
  console.log('demo')
  const token = socket.handshake.auth.token
  if(token){


  const data = jwt.verify(token, process.env.JWT_SECRET)
  const user = await User.findByPk(data.id)
  socket.user = user
  next()
  }else{
      next(new Error("token not found"))
  }
}


module.exports = { auth: authenticate, socketAuthenticate };
