import request from 'supertest';
import app from '../../../src/index.js';
import Player from '../../../src/models/player.js';

describe('POST /api/player - Create Player', () => {
  const userData = {
    username: 'testCreatePlayer',
    email: 'testCreatePlayer@gmail.com',
    password: 'knx',
  };
  afterAll(async () => {
    await Player.destroy({
      where: {
        username: userData.username,
      },
    });
  });

  it('should create a player with success', async () => {
    try {
      const response = await request(app).post('/api/player').send(userData);

      expect(response.status).toBe(201);
      expect(response.body.message).toBe('User registered successfully');
    } catch (error) {
      console.error(error);
      throw error;
    }
  });

  it('should return an error because there is already a user with that email', async () => {
    try {
      const response = await request(app)
        .post('/api/player')
        .send({ ...userData, username: 'test' });

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Email already exists');
    } catch (error) {
      console.error(error);
      throw error;
    }
  });

  it('should return an error because there is already a user with that username', async () => {
    try {
      const response = await request(app)
        .post('/api/player')
        .send({ ...userData, email: 'test@test' });

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
        .post('/api/player')
        .send({ email: 'test@test' });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    } catch (error) {
      console.error(error);
      throw error;
    }
  });
});
