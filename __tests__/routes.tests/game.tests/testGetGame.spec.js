import request from 'supertest';
import app from '../../../src/index.js';
import Player from '../../../src/models/player.js';
import Game from '../../../src/models/game.js';
import GamePlayer from '../../../src/models/gamePlayer.js';

describe('GET /api/games - Get Game', () => {
  const gameData = {
    title: 'testGetGame',
    maxPlayers: 4,
  };

  let player;
  let token;
  let gameId;

  beforeAll(async () => {
    player = await Player.create({
      username: 'testGetGame',
      email: 'testGetGame@gmail.com',
      password: 'password123',
    });

    const response = await request(app).post('/api/login').send({
      username: player.username,
      password: player.password,
    });

    token = response.body.access_token;

    const responseGame = await request(app)
      .post('/api/games')
      .send({ ...gameData, access_token: token });

    gameId = responseGame.body.game_id;
  });

  afterAll(async () => {
    await GamePlayer.destroy({
      where: {
        gameId: gameId,
      },
    });

    await Game.destroy({
      where: {
        title: 'testGetGame',
      },
    });

    await player.destroy();
  });

  it('should get a game with success', async () => {
    try {
      const response = await request(app)
        .get(`/api/games/${gameId}`)
        .send({ access_token: token });

      expect(response.status).toBe(200);

      const game = await Game.findByPk(gameId);

      expect(response.body.id).toBe(game.id);
      expect(response.body.title).toBe(game.title);
      expect(response.body.status).toBe(game.status);
      expect(response.body.maxPlayers).toBe(game.maxPlayers);
    } catch (error) {
      console.error(error);
      throw error;
    }
  });

  it('should return an error because the game with that id was not found', async () => {
    try {
      const response = await request(app).get(`/api/games/${0}`);

      expect(response.status).toBe(404);
      expect(response.body.message).toBe('Game not found');
    } catch (error) {
      console.error(error);
      throw error;
    }
  });
});
