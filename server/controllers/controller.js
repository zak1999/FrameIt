const AuthTableOwner = require('../models/authTableOwner');
const Party = require('../models/party');
const { generateRandomString, ensureExists } = require('../helpers/helpers');
const path = require('path');

// obj that will map the intervals of the parties. -> mapOfIntervals = { partyId: interval }
const mapOfIntervals = {};

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

exports.createParty = async (req, res) => {
  try {
    const { email } = req.body;
    const partyId = generateRandomString(6);
    const user = await AuthTableOwner.findOne({ where: { user_email: email } });

    // If there is no user, then they cannot create a party.
    if (!user) {
      res.status(404);
      res.send({ status: 'User not found.' });
    } else if (user && user['party_id']) {
      res.status(400);
      res.send({ status: 'Party already exists' });
    } else {
      // Else, if the user exists and they don't have a partyId then update it.
      await AuthTableOwner.update(
        { party_id: partyId },
        { where: { user_email: email } }
      );
      const party = {
        party_id: partyId,
        pics: JSON.stringify([]),
        socket_room_id: generateRandomString(12),
      };
      // Create the new party to be returned to the user
      const newParty = await Party.create(party);
      const interval = await this.triggerSocket(
        newParty['socket_room_id'],
        partyId
      );
      mapOfIntervals[partyId] = interval;
      res.status(200);
      res.send({ status: 'Party Created', party_id: partyId });
    }
  } catch (error) {
    res.status(500);
    res.send({ status: 'Something went wrong. Party not created.' });
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

exports.deleteParty = async (req, res) => {
  try {
    const { id } = req.body;
    const party = await Party.findOne({ where: { party_id: id } });

    if (party) {
      // Update the AuthTableOwner table if the party exists.
      await AuthTableOwner.update(
        { party_id: '' },
        { where: { party_id: id } }
      );

      // Clearing the interval map of the deleted party
      clearInterval(mapOfIntervals[id]);

      // Destroying party from the table
      await Party.destroy({ where: { party_id: id } });
      res.status(200);
      res.send({ status: 'Party deleted successfully.', completed: true });
    } else {
      // Bad Request
      res.status(404);
      res.send({ status: 'Party does not exist.', completed: false });
    }
  } catch (error) {
    res.status(500);
    console.log(error);
    res.send({ status: 'Something went wrong.', completed: false });
  }
};

// exports.insertUrlInDb = async (req, res) => {
//   try {
//     // take variables from body
//     const url = req.body.url;
//     const partyId = req.body.partyId;
//     // console.log('Arrived pic for party' + partyId + ' url: ' + url);
//     // search the party in the db to get the url array of the pics
//     const partyObj = await Party.findOne({
//       where: { party_id: partyId },
//     });
//     // console.log('Prev url arr is: ' + partyObj.pics);
//     // parse the url string into an actual array
//     const picsArr = JSON.parse(partyObj.pics);
//     // push the new pic url into that
//     picsArr.push(url);
//     // console.log('New pics arr is: ' + picsArr);
//     // update the record in the db
//     await Party.update(
//       {
//         pics: JSON.stringify(picsArr),
//       },
//       {
//         where: { party_id: partyId },
//       }
//     );
//     // all good
//     res.status(200);
//     res.send(true);
//   } catch (error) {
//     console.log(error);
//     res.sendStatus(404);
//   }
// };

exports.insertUrlInDb = async (req, res) => {
  try {
    const { url } = req.body;
    const { partyId } = req.body;
    const party = await Party.findOne({ where: { party_id: partyId } });
    if (party) {
      const picsArr = JSON.parse(party.pics);
      picsArr.push(url);
      // Update the party to contain the image url.
      await Party.update(
        { pics: JSON.stringify(picsArr) },
        { where: { party_id: partyId } }
      );
      res.status(200);
      res.send({ status: 'Successfully sent to database.', completed: true });
    } else {
      // The scenario where there is no party to update
      res.status(404);
      res.send({ status: 'Party does not exist.', completed: false });
    }
  } catch (error) {
    res.status(500);
    console.log(error);
    res.send({ status: 'Something went wrong', completed: false });
  }
};

exports.getSocketRoom = async (req, res) => {
  try {
    const partyId = req.params.id;
    const party = await Party.findOne({
      where: { party_id: partyId },
    });

    // If the party exists, then we have a 200 status, else a 404
    res.status = 200;
    res.send({ socket_room_id: party.socket_room_id });
  } catch (error) {
    // console.log(error);
    res.sendStatus(500);
  }
};

exports.socketIoUpdateParty = async (socketRoom, id) => {
  try {
    let partyObj = await Party.findOne({
      where: { party_id: id },
    });
    let picsArr = JSON.parse(partyObj.pics);
    io.to(socketRoom).emit('pics', picsArr);
  } catch (error) {
    // console.log(error);
  }
  return;
};

exports.triggerSocket = async (socketRoom, partyId) => {
  // every 2 seconds, call this function (socketIoUpdateParty)
  // that will query the db, take the pics array, and broadcast it into the room.
  const id = setInterval(() => {
    this.socketIoUpdateParty(socketRoom, partyId);
  }, 2000);
  return id;
};

exports.startSetIntervals = async () => {
  // go into Party, take every party_id, with every socket_room_id
  // and call socketIoUpdateParty on them.
  let parties = await Party.findAll();
  for (let party of parties) {
    let id = party.dataValues.party_id;
    // call the function, wait for the id of the interval, then save in the party table
    let interval = await this.triggerSocket(
      party.dataValues.socket_room_id,
      id
    );

    // save the intervalId into the map of Intervals.
    mapOfIntervals[id] = interval;
  }
  return;
};

exports.checkIfPartyExists = async (req, res) => {
  try {
    const id = req.params.id;
    const partyObj = await Party.findOne({ where: { party_id: id } });
    if (partyObj) {
      res.status(200);
      res.send({ exists: true });
    } else {
      res.status(404);
      res.send({ exists: false });
    }
  } catch (error) {
    // console.log(error);
    res.sendStatus(500);
  }
};
