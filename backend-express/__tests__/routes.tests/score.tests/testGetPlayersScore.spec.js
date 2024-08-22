import request from 'supertest';
import app from '../../../src/index.js';
import Game from '../../../src/models/game.js';
import GamePlayer from '../../../src/models/gamePlayer.js';
import Player from '../../../src/models/player.js';

describe('GET /api/score - Get Player Scores', () => {
  let game;
  let player1;
  let player2;
  let token;

  beforeAll(async () => {
    player1 = await Player.create({
      username: 'testPlayer1',
      email: 'testPlayer1@gmail.com',
      password: 'password123',
    });

    player2 = await Player.create({
      username: 'testPlayer2',
      email: 'testPlayer2@gmail.com',
      password: 'password123',
    });

    const response = await request(app).post('/api/login').send({
      username: player1.username,
      password: player1.password,
    });

    token = response.body.access_token;

    game = await Game.create({
      title: 'Test Game',
      maxPlayers: 4,
      status: 'In progress',
      creatorId: player1.id,
    });

    await GamePlayer.create({
      gameId: game.id,
      playerId: player1.id,
      score: 10,
    });
    await GamePlayer.create({
      gameId: game.id,
      playerId: player2.id,
      score: 20,
    });
  });

  afterAll(async () => {
    await GamePlayer.destroy({ where: { gameId: game.id } });
    await game.destroy();
    await player1.destroy();
    await player2.destroy();
  });

  it('should get player scores successfully', async () => {
    const response = await request(app)
      .get('/api/score')
      .send({ game_id: game.id });

    expect(response.status).toBe(200);
    expect(response.body.game_id).toBe(game.id);
    expect(response.body.scores).toEqual({
      testPlayer1: 10,
      testPlayer2: 20,
    });
  });

  it('should return an error if game_id is not provided', async () => {
    const response = await request(app).get('/api/score').send({});

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('Invalid params');
  });

  it('should return an error if game is not found', async () => {
    const response = await request(app)
      .get('/api/score')
      .send({ game_id: 9999 });

    expect(response.status).toBe(404);
    expect(response.body.message).toBe('Game not found');
  });

  it('should return an error if no players are found in the game', async () => {
    const newGame = await Game.create({
      title: 'Empty Game',
      maxPlayers: 4,
      status: 'In progress',
      creatorId: player1.id,
    });

    const response = await request(app)
      .get('/api/score')
      .send({ game_id: newGame.id });

    expect(response.status).toBe(404);
    expect(response.body.message).toBe('No players found in this game');

    await newGame.destroy();
  });
});
