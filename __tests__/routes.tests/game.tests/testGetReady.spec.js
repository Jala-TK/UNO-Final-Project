import request from 'supertest';
import app from '../../../src/index.js';
import Player from '../../../src/models/player.js';
import Game from '../../../src/models/game.js';
import GamePlayer from '../../../src/models/gamePlayer.js';

describe('POST /api/game/ready - Get Ready', () => {
  const gameData = {
    title: 'testGetReady',
    maxPlayers: 4,
  };

  let player;
  let token;
  let gameId;

  beforeAll(async () => {
    player = await Player.create({
      username: 'testGetReady',
      email: 'testGetReady@gmail.com',
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

    await GamePlayer.create({
      gameId: gameId,
      playerId: player.id,
      status: false,
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

    await player.destroy();
  });

  it('should mark the player as ready successfully', async () => {
    const response = await request(app)
      .post('/api/game/ready')
      .send({ game_id: gameId, access_token: token });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('The player is ready');

    const playerInGame = await GamePlayer.findOne({
      where: { gameId: gameId, playerId: player.id },
    });

    expect(playerInGame.status).toBe(true);
  });

  it('should return an error because game_id or access_token is missing', async () => {
    const response = await request(app)
      .post('/api/game/ready')
      .send({ game_id: gameId });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('Invalid params');
  });

  it('should return an error because the game does not exist', async () => {
    const invalidGameId = 9999;

    const response = await request(app)
      .post('/api/game/ready')
      .send({ game_id: invalidGameId, access_token: token });

    expect(response.status).toBe(404);
    expect(response.body.message).toBe('Game not found');
  });

  it('should return an error because the player is not in this game', async () => {
    const otherPlayer = await Player.create({
      username: 'otherPlayer',
      email: 'otherPlayer@gmail.com',
      password: 'password123',
    });

    const response = await request(app).post('/api/login').send({
      username: otherPlayer.username,
      password: otherPlayer.password,
    });

    const otherToken = response.body.access_token;

    const responseReady = await request(app)
      .post('/api/game/ready')
      .send({ game_id: gameId, access_token: otherToken });

    expect(responseReady.status).toBe(400);
    expect(responseReady.body.error).toBe('The player is not in this game');

    await otherPlayer.destroy();
  });

  it('should return an error because the player is already ready', async () => {
    await GamePlayer.update(
      { status: true },
      { where: { gameId: gameId, playerId: player.id } },
    );

    const response = await request(app)
      .post('/api/game/ready')
      .send({ game_id: gameId, access_token: token });

    expect(response.status).toBe(400);
    expect(response.body.error).toBe('The player was ready');
  });
});
