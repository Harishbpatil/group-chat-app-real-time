const Sequelize = require("sequelize");

const sequelize = require("../util/db");

const archieved = sequelize.define("archieved", {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,

    allowNull: false,
  },
  message: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  type: {
    type: Sequelize.STRING,
    allowNull: false,
    defaultValue: "text",
  },
  groupId: {
    type: Sequelize.UUID,
    allowNull: false,
  },
  memberId: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
});

module.exports = archieved;
