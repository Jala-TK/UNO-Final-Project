import request from 'supertest';
import app from '../../../src/index.js';
import Player from '../../../src/models/player.js';
import Game from '../../../src/models/game.js';
import GamePlayer from '../../../src/models/gamePlayer.js';

describe('POST /api/game/join - Join Game', () => {
  const gameData = {
    title: 'testJoinGame',
    maxPlayers: 4,
  };

  let playerCreate;
  let player;
  let tokenCreator;
  let token;
  let gameId;

  beforeAll(async () => {
    playerCreate = await Player.create({
      username: 'testJoinCreateGame',
      email: 'testJoinCreateGame@gmail.com',
      password: 'password123',
    });

    player = await Player.create({
      username: 'testJoinGame',
      email: 'testJoinGame@gmail.com',
      password: 'password123',
    });

    const responseCreator = await request(app).post('/api/login').send({
      username: playerCreate.username,
      password: playerCreate.password,
    });

    tokenCreator = responseCreator.body.access_token;

    const response = await request(app).post('/api/login').send({
      username: player.username,
      password: player.password,
    });

    token = response.body.access_token;

    const responseGame = await request(app)
      .post('/api/games')
      .send({ ...gameData, access_token: tokenCreator });

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
    await playerCreate.destroy();
  });

  it('should allow the user to join the game successfully', async () => {
    try {
      const response = await request(app)
        .post('/api/game/join')
        .send({ game_id: gameId, access_token: token });

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('User joined the game successfully');
    } catch (error) {
      console.error(error);
      throw error;
    }
  });

  it('should return an error because game_id is missing', async () => {
    const response = await request(app)
      .post('/api/game/join')
      .send({ access_token: token });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('Invalid params');
  });

  it('should return an error because access_token is missing', async () => {
    const response = await request(app)
      .post('/api/game/join')
      .send({ game_id: gameId });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('Invalid params');
  });

  it('should return an error because the game does not exist', async () => {
    const invalidGameId = 9999;

    const response = await request(app)
      .post('/api/game/join')
      .send({ game_id: invalidGameId, access_token: token });

    expect(response.status).toBe(404);
    expect(response.body.message).toBe('Game not found');
  });

  it('should return an error because the user is already in the game', async () => {
    // Join the game for the first time
    await request(app)
      .post('/api/game/join')
      .send({ game_id: gameId, access_token: token });

    // Try to join the game again
    const response = await request(app)
      .post('/api/game/join')
      .send({ game_id: gameId, access_token: token });

    expect(response.status).toBe(400);
    expect(response.body.error).toBe('User is already in the game');
  });
});
