import request from 'supertest';
import app from '../../../src/index.js';
import Player from '../../../src/models/player.js';

describe('POST /api/logout', () => {
  let token;
  let player;

  beforeAll(async () => {
    player = await Player.create({
      username: 'testGetPerfil',
      email: 'testGetPerfil@example.com',
      password: 'password123',
    });

    const response = await request(app).post('/api/login').send({
      username: 'testGetPerfil',
      password: 'password123',
    });

    token = response.body.access_token;
  });

  afterAll(async () => {
    await Player.destroy({
      where: {
        username: 'testGetPerfil',
      },
    });
  });

  it('should return a valid logout message', async () => {
    try {
      const response = await request(app).post('/api/logout').send({
        access_token: token,
      });

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('User logged out successfully');
    } catch (error) {
      console.error(error);
      throw error;
    }
  });

  it('should return an error for invalid token', async () => {
    const response = await request(app).post('/api/logout').send({
      access_token: 'token',
    });

    expect(response.status).toBe(401);
  });

  it('should return an error for blacklisted token', async () => {
    const response = await request(app).post('/api/logout').send({
      access_token: token,
    });

    expect(response.status).toBe(403);
  });
});
