const express = require("express");
const cors = require("cors");
const path = require("path");

require("dotenv").config();
const app = express();

app.use(express.json());
app.use(cors({
  origin : 'http://127.0.0.1:5500',
  methods : [' GET' ,'POST']
}))


const sequelize = require("./backend/util/db");

const userRoutes = require("./backend/routes/user");

app.use(express.static(path.join(__dirname, "frontend")));

app.use("/user", userRoutes);

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "/frontend/signup/signup.html"));
});

sequelize
  .sync()
  .then(() => {
    app.listen(4000);
  })
  .catch((e) => {
    console.log(e);
  });
