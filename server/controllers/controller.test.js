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
      expect(res2.status).toBe(400);
    });
    afterEach(async () => {
      // Delete user afterwards
      await AuthTableOwner.destroy({
        where: { user_email: 'testing@email.com' },
      });
    });
  });

  describe('Creating a Party', () => {
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
    });
  });
});
