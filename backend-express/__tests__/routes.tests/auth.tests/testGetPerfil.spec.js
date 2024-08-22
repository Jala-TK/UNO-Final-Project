import request from 'supertest';
import app from '../../../src/index.js';
import Player from '../../../src/models/player.js';

describe('GET /api/getPerfil', () => {
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

  it('should return a valid perfil user', async () => {
    try {
      const response = await request(app).get('/api/getPerfil').send({
        access_token: token,
      });

      expect(response.status).toBe(200);

      expect(response.body.username).toBe(player.username);
      expect(response.body.email).toBe(player.email);
    } catch (error) {
      console.error(error);
      throw error;
    }
  });

  it('should return an error for invalid token', async () => {
    const response = await request(app).get('/api/getPerfil').send({
      access_token: 'token',
    });

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty('error');
  });
});
