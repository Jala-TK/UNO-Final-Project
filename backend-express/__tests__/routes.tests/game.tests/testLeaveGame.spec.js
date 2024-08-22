import request from 'supertest';
import app from '../../../src/index.js';
import Player from '../../../src/models/player.js';
import Game from '../../../src/models/game.js';
import GamePlayer from '../../../src/models/gamePlayer.js';

describe('POST /api/game/leave - Leave Game', () => {
  const gameData = {
    title: 'testLeaveGame',
    maxPlayers: 4,
    status: 'Active',
  };

  let player;
  let anotherPlayer;
  let token;
  let anotherToken;
  let gameId;

  beforeAll(async () => {
    player = await Player.create({
      username: 'testLeaveGame',
      email: 'testLeaveGame@gmail.com',
      password: 'password123',
    });

    anotherPlayer = await Player.create({
      username: 'testAnotherLeaveGame',
      email: 'testAnotherLeaveGame@gmail.com',
      password: 'password123',
    });

    let response = await request(app).post('/api/login').send({
      username: player.username,
      password: player.password,
    });

    token = response.body.access_token;

    response = await request(app).post('/api/login').send({
      username: anotherPlayer.username,
      password: anotherPlayer.password,
    });

    anotherToken = response.body.access_token;

    const responseGame = await request(app)
      .post('/api/games')
      .send({ ...gameData, access_token: token });

    gameId = responseGame.body.game_id;

    await request(app)
      .post('/api/game/join')
      .send({ game_id: gameId, access_token: anotherToken });
  });

  beforeEach(async () => {
    await request(app)
      .post('/api/game/join')
      .send({ game_id: gameId, access_token: anotherToken });
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
    await anotherPlayer.destroy();
  });

  it('should allow the user to leave the game successfully', async () => {
    const response = await request(app)
      .post('/api/game/leave')
      .send({ game_id: gameId, access_token: anotherToken });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Player left the game successfully');
  });

  it('should return an error because game_id is missing', async () => {
    const response = await request(app)
      .post('/api/game/leave')
      .send({ access_token: token });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('Invalid params');
  });

  it('should return an error because access_token is missing', async () => {
    const response = await request(app)
      .post('/api/game/leave')
      .send({ game_id: gameId });

    expect(response.status).toBe(400);
    expect(response.body.error).toBe('Invalid credentials');
  });

  it('should return an error because the game does not exist', async () => {
    const invalidGameId = 9999;

    const response = await request(app)
      .post('/api/game/leave')
      .send({ game_id: invalidGameId, access_token: token });

    expect(response.status).toBe(404);
    expect(response.body.message).toBe('Game not found');
  });

  it('should return an error because the player is not in this game', async () => {
    const newPlayer = await Player.create({
      username: 'testNewPlayerLeaveGame',
      email: 'testNewPlayerLeaveGame@gmail.com',
      password: 'password123',
    });

    const newPlayerResponse = await request(app).post('/api/login').send({
      username: newPlayer.username,
      password: newPlayer.password,
    });

    const newToken = newPlayerResponse.body.access_token;

    const response = await request(app)
      .post('/api/game/leave')
      .send({ game_id: gameId, access_token: newToken });

    await newPlayer.destroy();

    expect(response.status).toBe(404);
    expect(response.body.error).toBe('Player not found in this game');
  });

  it('should change the creator and allow the creator to leave the game', async () => {
    const response = await request(app)
      .post('/api/game/leave')
      .send({ game_id: gameId, access_token: token });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Player left the game successfully');

    const game = await Game.findByPk(gameId);
    expect(game.creatorId).toBe(anotherPlayer.id);
  });

  it('should delete the game if the creator is the last player and leaves the game', async () => {
    const responseJoin = await request(app)
      .post('/api/game/join')
      .send({ game_id: gameId, access_token: token });

    const response = await request(app)
      .post('/api/game/leave')
      .send({ game_id: gameId, access_token: token });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Player left the game successfully');

    const responseDelete = await request(app)
      .post('/api/game/leave')
      .send({ game_id: gameId, access_token: anotherToken });

    expect(responseDelete.status).toBe(200);
    expect(responseDelete.body.message).toBe('Game deleted successfully');

    const game = await Game.findByPk(gameId);
    expect(game.auditExcluded).toBe(true);
  });
});
