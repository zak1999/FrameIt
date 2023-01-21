const Sequelize = require('sequelize');
const { DB_CONNECTION_STRING } = require('../config');
const sequelize = new Sequelize(process.env.DB_CONNECTION_STRING, {
  dialect: 'postgres',
  logging: false,
  // Undo for deployment.
  // dialectOptions: {
  //   ssl: {
  //     require: true,
  //     rejectUnauthorized: false,
  //   },
  //   client_encoding: 'auto',
  // },
});

async function start() {
  try {
    await sequelize.authenticate();
    // console.log('Successful Connection to the Database 🚀');
  } catch (error) {
    // console.log('err' + error);
  }
}
start();
module.exports = sequelize;
