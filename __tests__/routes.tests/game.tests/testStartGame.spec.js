import request from 'supertest';
import app from '../../../src/index.js';
import Player from '../../../src/models/player.js';
import Game from '../../../src/models/game.js';
import GamePlayer from '../../../src/models/gamePlayer.js';
import Card from '../../../src/models/card.js';

describe('POST /api/game/start - Start Game', () => {
  const gameData = {
    title: 'testStartGame',
    maxPlayers: 4,
    status: 'Pending',
  };

  let player;
  let anotherPlayer;
  let token;
  let anotherToken;
  let gameId;

  beforeAll(async () => {
    player = await Player.create({
      username: 'testStartGame',
      email: 'testStartGame@gmail.com',
      password: 'password123',
    });

    anotherPlayer = await Player.create({
      username: 'testAnotherStartGame',
      email: 'testAnotherStartGame@gmail.com',
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
    await GamePlayer.update(
      { status: true, auditExcluded: false },
      { where: { gameId: gameId } },
    );
  });

  afterAll(async () => {
    await Card.destroy({
      where: {
        gameId: gameId,
      },
    });

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

  it('should start the game successfully', async () => {
    const response = await request(app)
      .post('/api/game/start')
      .send({ game_id: gameId, access_token: token });

    console.log(response.body);
    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Game started successfully');

    const game = await Game.findByPk(gameId);
    expect(game.status).toBe('In progress');
    expect(game.currentPlayer).toBe(player.id);
  });

  it('should return an error because game_id is missing', async () => {
    const response = await request(app)
      .post('/api/game/start')
      .send({ access_token: token });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('Invalid params');
  });

  it('should return an error because access_token is missing', async () => {
    const response = await request(app)
      .post('/api/game/start')
      .send({ game_id: gameId });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('Invalid params');
  });

  it('should return an error because the game does not exist', async () => {
    const invalidGameId = 9999;

    const response = await request(app)
      .post('/api/game/start')
      .send({ game_id: invalidGameId, access_token: token });

    expect(response.status).toBe(404);
    expect(response.body.message).toBe('Game not found');
  });

  it('should return an error because only the creator can start the game', async () => {
    const response = await request(app)
      .post('/api/game/start')
      .send({ game_id: gameId, access_token: anotherToken });

    expect(response.status).toBe(403);
    expect(response.body.error).toBe('Only the creator can start the game');
  });

  it('should return an error because there are not enough players', async () => {
    await GamePlayer.update(
      { auditExcluded: true },
      { where: { gameId: gameId, playerId: anotherPlayer.id } },
    );

    const response = await request(app)
      .post('/api/game/start')
      .send({ game_id: gameId, access_token: token });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('Only one player in the room');

    await request(app)
      .post('/api/games/join')
      .send({ game_id: gameId, access_token: anotherToken });
  });

  it('should return an error because some players are not ready', async () => {
    await GamePlayer.update(
      { status: false },
      { where: { gameId: gameId, playerId: anotherPlayer.id } },
    );

    const response = await request(app)
      .post('/api/game/start')
      .send({ game_id: gameId, access_token: token });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('Some players are not ready');
  });

  it('should return an error because the game has already started', async () => {
    await request(app)
      .post('/api/game/start')
      .send({ game_id: gameId, access_token: token });

    const response = await request(app)
      .post('/api/game/start')
      .send({ game_id: gameId, access_token: token });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('The game has already started');
  });
});
