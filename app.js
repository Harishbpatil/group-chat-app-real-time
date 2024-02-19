const express = require("express");
const cors = require("cors");
const path = require("path");

require("dotenv").config();
const app = express();
app.use(express.json());
const httpServer = require("http").createServer(app);
const io = require("socket.io")(httpServer, {
  cors: ["http://localhost:5500"],
});

const sequelize = require("./backend/util/db");

const Message = require("./backend/models/message");
const User = require("./backend/models/user");
const Group = require("./backend/models/group");
const Member = require("./backend/models/member");

const groupRoutes = require("./backend/routes/group");
const messageRoutes = require("./backend/routes/message");
const userRoutes = require("./backend/routes/user");
const adminRoutes = require("./backend/routes/admin");
const messagesRoutes = require("./backend/routes/messages");
const { socketAuthenticate } = require("./backend/middlewares/auth");

User.belongsToMany(Group, { through: Member });
Group.belongsToMany(User, { through: Member });

Group.hasMany(Message);
Message.belongsTo(Group);

Member.hasMany(Message);
Message.belongsTo(Member);

app.use(express.static(path.join(__dirname, "frontend")));
app.use("/user", userRoutes);
app.use("/message", messageRoutes);
app.use("/group", groupRoutes);
app.use("/admin", adminRoutes);

app.use(express.json());
app.use(
  cors({
    origin: "http://127.0.0.1:5500",
    methods: [" GET", "POST"],
  })
);

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "/frontend/signup/signup.html"));
});

app.get("/chatapp", (req, res) => {
  res.sendFile(path.join(__dirname, "/frontend/chatapp/chatapp.html"));
});

sequelize
  .sync()
  .then(() => {
    const connection = (socket) => {
      socket.use(async (packet, next) => {
        await socketAuthenticate(socket, next);
      });

      console.log(socket.id);
      messagesRoutes(io, socket);
    };

    io.on("connection", connection);
    httpServer.listen(4000);
  })
  .catch((e) => {
    console.log(e);
  });
