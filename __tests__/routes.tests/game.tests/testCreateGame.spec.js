import request from 'supertest';
import app from '../../../src/index.js';
import Player from '../../../src/models/player.js';
import Game from '../../../src/models/game.js';
import GamePlayer from '../../../src/models/gamePlayer.js';

describe('POST /api/games - Create Game', () => {
  const gameData = {
    title: 'testCreateGame',
    maxPlayers: 4,
  };

  let player;
  let token;

  beforeAll(async () => {
    player = await Player.create({
      username: 'testCreateGame',
      email: 'testCreateGame@gmail.com',
      password: 'password123',
    });

    const response = await request(app).post('/api/login').send({
      username: player.username,
      password: player.password,
    });

    token = response.body.access_token;
  });

  afterAll(async () => {
    await GamePlayer.destroy({
      where: {
        playerId: player.id,
      },
    });

    await Game.destroy({
      where: {
        title: 'testCreateGame',
      },
    });

    await Player.destroy({
      where: {
        username: 'testCreateGame',
      },
    });
  });

  it('should create a game with success', async () => {
    try {
      const response = await request(app)
        .post(`/api/games`)
        .send({ ...gameData, access_token: token });

      expect(response.status).toBe(201);
      expect(response.body.message).toBe('Game created successfully');
      expect(response.body).toHaveProperty('game_id');

      const game = await Game.findByPk(response.body.game_id);
      expect(game.title).toBe(gameData.title);
      expect(game.maxPlayers).toBe(gameData.maxPlayers);
    } catch (error) {
      console.error(error);
      throw error;
    }
  });

  it('should return an error because not all the required arguments are present', async () => {
    try {
      const response = await request(app).post(`/api/games`).send(gameData);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toBe('Invalid params');
    } catch (error) {
      console.error(error);
      throw error;
    }
  });
});
