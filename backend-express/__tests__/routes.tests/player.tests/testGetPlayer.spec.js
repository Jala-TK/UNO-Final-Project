import request from 'supertest';
import app from '../../../src/index.js';
import Player from '../../../src/models/player.js';

describe('GET /api/player - Player', () => {
  const userData = {
    username: 'testGetPlayer',
    email: 'testGetPlayer@gmail.com',
    password: 'knx',
  };

  let player;

  beforeAll(async () => {
    player = await Player.create(userData);
  });

  afterAll(async () => {
    await Player.destroy({
      where: {
        username: userData.username,
      },
    });
  });

  it('should get a player with success', async () => {
    try {
      const response = await request(app).get(`/api/player/${player.id}`);

      expect(response.status).toBe(200);
      expect(response.body.username).toBe(player.username);
      expect(response.body.email).toBe(player.email);
    } catch (error) {
      console.error(error);
      throw error;
    }
  });

  it('should return an error because the player with that id was not found', async () => {
    try {
      const response = await request(app).get(`/api/player/${0}`);

      expect(response.status).toBe(404);
      expect(response.body.message).toBe('Player not found');
    } catch (error) {
      console.error(error);
      throw error;
    }
  });
});
