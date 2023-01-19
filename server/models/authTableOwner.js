const { DataTypes } = require('sequelize');
const sequelize = require('./index.js')

const AuthTableOwner = sequelize.define('AuthTableOwner', {
  user_email: {
    type: DataTypes.STRING,
    allowNull: false
  },
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  party_id: {
    type: DataTypes.STRING,
    allowNull: true
  }
})
AuthTableOwner.sync();
module.exports = AuthTableOwner;