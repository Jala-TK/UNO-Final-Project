import request from 'supertest';
import app from '../../../src/index.js';
import Player from '../../../src/models/player.js';
import Game from '../../../src/models/game.js';
import GamePlayer from '../../../src/models/gamePlayer.js';

describe('GET /api/game/players - Get Players in Game', () => {
  const gameData = {
    title: 'testGetPlayersInGame',
    maxPlayers: 4,
  };

  let player1, player2;
  let token1, token2;
  let gameId;

  beforeAll(async () => {
    player1 = await Player.create({
      username: 'player1',
      email: 'player1@gmail.com',
      password: 'password123',
    });

    player2 = await Player.create({
      username: 'player2',
      email: 'player2@gmail.com',
      password: 'password123',
    });

    const response1 = await request(app).post('/api/login').send({
      username: player1.username,
      password: player1.password,
    });

    const response2 = await request(app).post('/api/login').send({
      username: player2.username,
      password: player2.password,
    });

    token1 = response1.body.access_token;
    token2 = response2.body.access_token;

    const responseGame = await request(app)
      .post('/api/games')
      .send({ ...gameData, access_token: token1 });

    gameId = responseGame.body.game_id;

    await GamePlayer.create({
      gameId: gameId,
      playerId: player1.id,
    });

    await GamePlayer.create({
      gameId: gameId,
      playerId: player2.id,
    });
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

    await player1.destroy();
    await player2.destroy();
  });

  it('should return the players in the game successfully', async () => {
    const response = await request(app)
      .get('/api/game/players')
      .send({ game_id: gameId });

    expect(response.status).toBe(200);
    expect(response.body.game_id).toBe(gameId);
    expect(response.body.players).toEqual(
      expect.arrayContaining([player1.username, player2.username]),
    );
  });

  it('should return an error because game ID is not provided', async () => {
    const response = await request(app).get('/api/game/players').send({});

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('Invalid Params');
  });

  it('should return an error because the game does not exist', async () => {
    const invalidGameId = 9999;

    const response = await request(app)
      .get('/api/game/players')
      .send({ game_id: invalidGameId });

    expect(response.status).toBe(404);
    expect(response.body.message).toBe('Game not found');
  });
});
