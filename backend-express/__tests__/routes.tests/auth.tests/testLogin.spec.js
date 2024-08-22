import request from 'supertest';
import app from '../../../src/index.js';
import Player from '../../../src/models/player.js';

describe('POST /api/login', () => {
  beforeAll(async () => {
    await Player.create({
      username: 'testLogin',
      email: 'testLogin@example.com',
      password: 'password123',
    });
  });

  afterAll(async () => {
    await Player.destroy({
      where: {
        username: 'testLogin',
      },
    });
  });

  it('should return a valid authentication token', async () => {
    try {
      const response = await request(app).post('/api/login').send({
        username: 'testLogin',
        password: 'password123',
      });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('access_token');
    } catch (error) {
      console.error(error);
      throw error;
    }
  });

  it('should return an error for invalid credentials', async () => {
    const response = await request(app).post('/api/login').send({
      username: 'usernamgggge',
      password: 'invalidPassword',
    });

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty('error');
  });
});
