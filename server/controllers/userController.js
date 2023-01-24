const AuthTableOwner = require('../models/authTableOwner');
const path = require('path');

async function checkIfUserExists(userInfo) {
  const user = await AuthTableOwner.findOne({
    where: { user_email: userInfo['user_email'] },
  });
  return user ? true : false;
}

exports.createOwner = async (req, res) => {
  try {
    const { email } = req.body;
    const userInfo = { user_email: email };
    const userExists = await checkIfUserExists(userInfo);
    // If the user exists, send back a status code
    if (userExists) {
      res.status(200);
      res.send({ status: 'User Already Exists', email });
    } else {
      const created = await AuthTableOwner.create(userInfo);
      res.status(200);
      res.send({ status: 'User Created', email });
    }
  } catch (error) {
    res.status(500);
    res.send({ status: 'Error, something went wrong', error });
  }
};

exports.checkIfUserHasParty = async (req, res) => {
  try {
    const { email } = req.params;
    const user = await AuthTableOwner.findOne({ where: { user_email: email } });

    if (user && user['party_id']) {
      res.status(200);
      res.send({ status: 'User Found.', party_id: user['party_id'] });
    } else {
      res.status(404);
      res.send({ status: 'User/Party not found.', party_id: false });
    }
  } catch (error) {
    res.status(500);
    res.send({ status: 'Something went wrong.', party_id: false });
  }
};
