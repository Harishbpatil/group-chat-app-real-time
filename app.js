const express = require("express");
const cors = require("cors");
const path = require("path");

require("dotenv").config();
const app = express();

const sequelize = require("./backend/util/db");

const userRoutes = require("./backend/routes/user");

const Message = require("./backend/models/message");
const User = require("./backend/models/user");

const messageRoutes = require("./backend/routes/message");


User.hasMany(Message);
Message.belongsTo(User);

app.use(express.static(path.join(__dirname, "frontend")));
app.use("/user", userRoutes);
app.use("/message", messageRoutes);
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
    app.listen(4000);
  })
  .catch((e) => {
    console.log(e);
  });
