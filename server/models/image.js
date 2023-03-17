const { DataTypes } = require('sequelize');
const sequelize = require('./index.js')

const Image = sequelize.define('Image', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  url: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  party_id: {
    type: DataTypes.STRING,
    allowNull: false
  },
})
async function synchronize() {
  await Image.sync();
} synchronize();

module.exports = Image;