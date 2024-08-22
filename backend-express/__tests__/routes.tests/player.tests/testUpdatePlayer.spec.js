import request from 'supertest';
import app from '../../../src/index.js';
import Player from '../../../src/models/player.js';
import { Op } from 'sequelize';

describe('PUT /api/player - Update Player', () => {
  const userData = {
    username: 'testUpdatePlayer',
    email: 'testUpdatePlayer@gmail.com',
    password: 'knx',
  };

  const userUpdateData = {
    username: 'testUpdatedPlayer',
    email: 'testUpdatedPlayer@gmail.com',
    password: 'knx2',
  };

  const userExistsData = {
    username: 'testUpdateExistsPlayer',
    email: 'testUpdateExistsPlayer@gmail.com',
    password: 'knx',
  };

  let player;
  let playerExists;
  let token;

  beforeAll(async () => {
    playerExists = await Player.create(userExistsData);
    player = await Player.create(userData);

    const response = await request(app).post('/api/login').send({
      username: player.username,
      password: player.password,
    });

    token = response.body.access_token;
  });

  afterAll(async () => {
    await Player.destroy({
      where: {
        [Op.or]: [
          { username: userData.username },
          { username: userUpdateData.username },
          { username: userExistsData.username },
        ],
      },
    });
  });

  it('should update a player with success', async () => {
    try {
      const response = await request(app)
        .put(`/api/player/${player.id}`)
        .send({ ...userUpdateData, access_token: token });

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('User updated sucessfully');

      const user = await Player.findByPk(player.id);
      expect(user.username).toBe(userUpdateData.username);
      expect(user.email).toBe(userUpdateData.email);
    } catch (error) {
      console.error(error);
      throw error;
    }
  });

  it('should update a player with same username', async () => {
    try {
      const response = await request(app)
        .put(`/api/player/${player.id}`)
        .send({
          ...userUpdateData,
          username: userData.username,
          access_token: token,
        });

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('User updated sucessfully');

      const user = await Player.findByPk(player.id);
      expect(user.username).toBe(userData.username);
      expect(user.email).toBe(userUpdateData.email);
    } catch (error) {
      console.error(error);
      throw error;
    }
  });

  it('should update a player with same email', async () => {
    try {
      const response = await request(app)
        .put(`/api/player/${player.id}`)
        .send({
          ...userUpdateData,
          email: userData.email,
          access_token: token,
        });

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('User updated sucessfully');

      const user = await Player.findByPk(player.id);
      expect(user.username).toBe(userUpdateData.username);
      expect(user.email).toBe(userData.email);
    } catch (error) {
      console.error(error);
      throw error;
    }
  });

  it('should a error because the user to be updated does not have the same id', async () => {
    try {
      const response = await request(app)
        .put(`/api/player/${playerExists.id}`)
        .send({
          ...userUpdateData,
          access_token: token,
        });

      expect(response.status).toBe(401);
      expect(response.body.error).toBe('Unauthorized update this user');
    } catch (error) {
      console.error(error);
      throw error;
    }
  });

  it('an error should occur because the data to be updated is in use by another user', async () => {
    try {
      const response = await request(app)
        .put(`/api/player/${player.id}`)
        .send({
          ...userUpdateData,
          username: 'testUpdateExistsPlayer',
          access_token: token,
        });

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('User already exists');
    } catch (error) {
      console.error(error);
      throw error;
    }
  });

  it('should return an error because not all the required arguments are present', async () => {
    try {
      const response = await request(app)
        .put(`/api/player/${player.id}`)
        .send(userData);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    } catch (error) {
      console.error(error);
      throw error;
    }
  });
});
