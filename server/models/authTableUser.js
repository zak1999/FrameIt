const { DataTypes } = require('sequelize');
const sequelize = require('./index.js')

const AuthTableUser = sequelize.define('AuthTableUser', {
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

async function synchronize() {
  await AuthTableUser.sync(); 
} synchronize();

module.exports = { AuthTableUser };