const { DataTypes } = require('sequelize');
const Image = require('./image.js');
const sequelize = require('./index.js')

const Party = sequelize.define('Party', {
  interval_id : {
    type: DataTypes.TEXT,
    allowNull: true
  },
  party_id: {
    type: DataTypes.STRING,
    allowNull: false
  },
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  socket_room_id: {
    type: DataTypes.STRING,
    allowNull: false
  }
})
async function synchronize() {
  await Party.sync();
} synchronize();

module.exports = Party;