const Party = require('../models/party');
const AuthTableOwner = require('../models/authTableOwner');
const { generateRandomString } = require('../helpers/helpers');
const path = require('path');
const mapOfIntervals = {};

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
    const { id } = req.params;
    const party = await Party.findOne({ where: { party_id: id } });

    // If the party exists, then we have a 200 status, else a 404
    if (party && party['socket_room_id']) {
      res.status(200);
      res.send({
        status: 'Party/SocketId Found.',
        socket_room_id: party['socket_room_id'],
      });
    } else {
      res.status(404);
      res.send({ status: 'Party/SocketId Not Found', socket_room_id: '' });
    }
  } catch (error) {
    res.status(500);
    res.send({ status: 'Something went wrong.', socket_room_id: '' });
  }
};

exports.socketIoUpdateParty = async (socketRoom, id) => {
  try {
    const partyObj = await Party.findOne({
      where: { party_id: id },
    });
    const picsArr = JSON.parse(partyObj.pics);
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
  const parties = await Party.findAll();
  for (const party of parties) {
    const id = party.dataValues['party_id'];
    // call the function, wait for the id of the interval, then save in the party table
    const interval = await this.triggerSocket(
      party.dataValues['socket_room_id'],
      id
    );

    // save the intervalId into the map of Intervals.
    mapOfIntervals[id] = interval;
  }
};
