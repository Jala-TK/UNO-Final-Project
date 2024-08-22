import request from 'supertest';
import app from '../../../src/index.js';
import Player from '../../../src/models/player.js';
import Game from '../../../src/models/game.js';
import GamePlayer from '../../../src/models/gamePlayer.js';

describe('GET /api/game/status - Get Status Game', () => {
  const gameData = {
    title: 'testGetStatusGame',
    maxPlayers: 4,
    status: 'Waiting for players',
  };

  let player;
  let token;
  let gameId;

  beforeAll(async () => {
    player = await Player.create({
      username: 'testGetStatusGame',
      email: 'testGetStatusGame@gmail.com',
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
        id: gameId,
      },
    });

    await player.destroy();
  });

  it('should return the game status successfully', async () => {
    const response = await request(app)
      .get('/api/game/status')
      .send({ game_id: gameId });

    expect(response.status).toBe(200);
    expect(response.body.status).toBe(gameData.status);
  });

  it('should return an error because game_id is missing', async () => {
    const response = await request(app).get('/api/game/status').send({});

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('Invalid params');
  });

  it('should return an error because the game does not exist', async () => {
    const invalidGameId = 9999;

    const response = await request(app)
      .get('/api/game/status')
      .send({ game_id: invalidGameId });

    expect(response.status).toBe(404);
    expect(response.body.message).toBe('Game not found');
  });
});
