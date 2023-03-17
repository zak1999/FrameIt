const router = require('express').Router();
const userController = require('./controllers/userController');
const partyController = require('./controllers/partyController');

router.post('/users/owner', userController.createOwner);
router.get('/users/info/party/:email', userController.checkIfUserHasParty);
router.post('/users/party/create', partyController.createParty);
router.delete('/party', partyController.deleteParty);
router.get('/party/:id', partyController.checkIfPartyExists);
router.post('/party/upload', partyController.insertUrlInDb);
router.get('/party/socketRoom/:id', partyController.getSocketRoom);

module.exports = router;
