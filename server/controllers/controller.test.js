const express = require('express');
const router = require('../router');
const supertest = require('supertest');
const AuthTableOwner = require('../models/authTableOwner');
const Party = require('../models/party');
const Sequelize = require('sequelize');
const dotenv = require('dotenv');
dotenv.config();

describe('Controller Testing', () => {
  const app = express();
  app.use(express.json());
  app.use(router);
  const request = supertest(app);

  beforeAll(async () => {
    const connectionString = `${process.env.TEST_DB_CONNECTION_STRING}`;
    const sequelize = new Sequelize(connectionString, {
      dialect: 'postgres',
      logging: false,
    });
    await sequelize.authenticate();
  });

  describe('Creating a User', () => {
    it('Should Create a User in the Database', async () => {
      const mockUser = { user_email: 'testing@email.com' };
      const user = await AuthTableOwner.create(mockUser);
      expect(user['user_email']).toBe('testing@email.com');
    });

    it('Should not create a user in the Database if the entry already exists', async () => {
      const res1 = await request
        .post('/users/owner')
        .send({ email: 'testing@email.com' });
      const res2 = await request
        .post('/users/owner')
        .send({ email: 'testing@email.com' });

      expect(res1.status).toBe(204);
      expect(res2.status).toBe(204);
    });

    afterEach(async () => {
      // Delete user afterwards
      await AuthTableOwner.destroy({
        where: { user_email: 'testing@email.com' },
      });
    });
  });

  describe('Creating a Party', () => {
    // // Create a dummy user
    // beforeEach(async () => {
    //   const mockUser = { user_email: 'user@email.com' };
    //   await AuthTableOwner.create(mockUser);
    // });
    // // Reset / Delete this user each time
    // afterEach(async () => {
    //   await AuthTableOwner.destroy({
    //     where: { user_email: 'user@email.com' },
    //   });
    // });

    it('Should not create a party if the user does not exist', async () => {
      const res = await request
        .post('/users/party/create')
        .send({ email: 'doesnot@exist.com' });
      expect(res.status).toBe(404);
    });

    it('Should not create a party if the user already has one', async () => {
      // Setting up a user with a party_id
      const mockUser = { user_email: 'user@email.com' };
      await AuthTableOwner.create(mockUser);
      await AuthTableOwner.update(
        { party_id: 'abcdef' },
        { where: { user_email: mockUser.user_email } }
      );

      const userWithParty = await AuthTableOwner.findOne({
        where: { user_email: 'user@email.com' },
      });

      const res = await request
        .post('/users/party/create')
        .send({ email: mockUser.user_email });
      expect(userWithParty['party_id']).toBe('abcdef');
      expect(res.status).toBe(400);

      // Deleting the mock user with a party_id
      await AuthTableOwner.destroy({
        where: { user_email: 'user@email.com' },
      });
    });

    it('Should create a new Party and send it to the User if the User exists and the Party does not', async () => {
      // Create a user with no party_id
      const mockUser = { user_email: 'user@email.com' };
      await AuthTableOwner.create(mockUser);

      // Testing undefined party_id property in the table
      const res1 = await request
        .post('/users/party/create')
        .send({ email: mockUser.user_email });
      expect(res1.status).toBe(200);

      // Making sure that a party was made with a party_id the same as the user
      const owner = await AuthTableOwner.findOne({
        where: { user_email: mockUser.user_email },
      });
      const party = await Party.findOne({
        where: { party_id: owner.party_id },
      });

      expect(party.party_id).toBe(owner.party_id);
      await AuthTableOwner.destroy({
        where: { user_email: 'user@email.com' },
      });
    });
  });

  describe('Deleting a Party', () => {
    it('Should reset the party_id for the Owner, and delete the Party from the table', async () => {
      // Create a user with no party_id
      const mockUser = { user_email: 'user@email.com' };
      await AuthTableOwner.create(mockUser);

      // Creating a party for a user
      await request
        .post('/users/party/create')
        .send({ email: mockUser.user_email });

      const user = await AuthTableOwner.findOne({
        where: { user_email: mockUser.user_email },
      });

      const { party_id } = user;

      // Deleting a party for the user
      const res2 = await request.delete('/party').send({ id: party_id });
      expect(res2.status).toBe(200);

      const updatedUser = await AuthTableOwner.findOne({
        where: { user_email: mockUser.user_email },
      });

      expect(updatedUser.party_id).toBe('');

      const deletedParty = await Party.findOne({
        where: { party_id: party_id },
      });
      expect(deletedParty).toBe(null);
      expect(updatedUser).not.toBe(null);
      await AuthTableOwner.destroy({
        where: { user_email: 'user@email.com' },
      });
    });
  });

  describe('Checking if the User has a corresponding Party', () => {
    it('Should correctly check if the user has a party', async () => {
      // Create a user with no party_id
      const mockUser = { user_email: 'user@email.com' };
      await AuthTableOwner.create(mockUser);

      // Test for no party
      const res1 = await request.get('/users/info/party/user@email.com');
      expect(res1.status).toBe(204);

      // Creating a party for a user
      const res2 = await request
        .post('/users/party/create')
        .send({ email: mockUser.user_email });
      expect(res2.status).toBe(200);

      const user = await AuthTableOwner.findOne({
        where: { user_email: mockUser.user_email },
      });

      const { party_id } = user;

      // Testing for user having a party
      const res3 = await request.get('/users/info/party/user@email.com');
      expect(res3.status).toBe(200);
      expect(res3.text).toBe(party_id);

      // Deleting entries from table
      await AuthTableOwner.destroy({
        where: { user_email: 'user@email.com' },
      });
      await Party.destroy({ where: { party_id: party_id } });
    });
  });

  describe('Updating Party Photos', () => {
    it('Should correctly add photo URLs to the Party Table', async () => {
      // Create a user and a party and add a photo to it
      // Create a user with no party_id
      const mockUser = { user_email: 'user@email.com' };
      await AuthTableOwner.create(mockUser);

      // Creating a party for a user
      await request
        .post('/users/party/create')
        .send({ email: mockUser.user_email });

      const user = await AuthTableOwner.findOne({
        where: { user_email: mockUser.user_email },
      });
      // console.log(user.party_id);

      const { party_id } = user;

      const res = await request
        .post('/party/upload')
        .send({ url: 'testing_url', partyId: party_id });

      // console.log(res);

      const updatedParty = await Party.findOne({
        where: { party_id: party_id },
      });
      // console.log(updatedParty.pics);

      expect(res.status).toBe(200);
      expect(updatedParty.pics).toBe('["testing_url"]');

      // Clear the AuthTableOwner and Party entries.
      await AuthTableOwner.destroy({
        where: { user_email: 'user@email.com' },
      });
      await Party.destroy({ where: { party_id: party_id } });
    });
  });

  describe('Checking if a Party Exists', () => {
    it('Should correctly identify if a Party does not exist', async () => {
      const mockId = 'testing123';
      const res = await request.get(`/party/${mockId}`);
      expect(res.status).toBe(404);
      expect(res.body).toEqual({ exists: false });
    });

    it('Should correctly identify if a Party does exist', async () => {
      const mockId = 'testing456';
      await Party.create({ party_id: mockId, socket_room_id: 'testing789' });
      const res = await request.get(`/party/${mockId}`);
      expect(res.status).toBe(200);
      expect(res.body).toEqual({ exists: true });

      // Deleting the dummy party.
      await Party.destroy({ where: { party_id: mockId } });
    });
  });

  describe('Getting the Socket Room Id', () => {
    it('Should correctly retrieve the Socket ID for a given Party', async () => {
      const mockParty = {
        party_id: 'partyTester',
        socket_room_id: 'socketTester',
      };
      const party = await Party.create(mockParty);

      const res2 = await request.get(`/party/socketRoom/${party.party_id}`);
      expect(res2.status).toBe(200);
      expect(res2.body).toEqual({ socket_room_id: 'socketTester' });

      const res1 = await request.get('/party/socketRoom/incorrectId');
      expect(res1.status).toBe(500);

      await Party.destroy({ where: { party_id: 'partyTester' } });
    });
  });
});
