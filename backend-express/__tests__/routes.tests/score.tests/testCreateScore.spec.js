import request from 'supertest';
import app from '../../../src/index.js';
import Game from '../../../src/models/game.js';
import GamePlayer from '../../../src/models/gamePlayer.js';
import Player from '../../../src/models/player.js';

describe('POST /api/scores - Create Score', () => {
  let game;
  let player;

  beforeAll(async () => {
    player = await Player.create({
      username: 'testPlayerCreateScore',
      email: 'testPlayerCreateScore@gmail.com',
      password: 'password123',
    });

    game = await Game.create({
      title: 'Test Game',
      maxPlayers: 4,
      status: 'In progress',
      creatorId: player.id,
    });
  });

  afterAll(async () => {
    await GamePlayer.destroy({ where: { gameId: game.id } });
    await game.destroy();
    await player.destroy();
  });

  it('should create a score successfully', async () => {
    const response = await request(app)
      .post('/api/score')
      .send({ playerId: player.id, gameId: game.id, score: 100 });

    expect(response.status).toBe(201);
    expect(response.body.playerId).toBe(player.id);
    expect(response.body.gameId).toBe(game.id);
    expect(response.body.score).toBe(100);

    const gamePlayer = await GamePlayer.findOne({
      where: { playerId: player.id, gameId: game.id },
    });
    expect(gamePlayer).toBeDefined();
    expect(gamePlayer.score).toBe(100);
  });

  it('should return an error if parameters are invalid', async () => {
    const response = await request(app)
      .post('/api/score')
      .send({ playerId: player.id, gameId: game.id });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('Invalid params');
  });

  it('should return an error if the player is not found', async () => {
    const response = await request(app)
      .post('/api/score')
      .send({ playerId: 9999, gameId: game.id, score: 100 });

    expect(response.status).toBe(404);
    expect(response.body.message).toBe('Player not found');
  });

  it('should return an error if the game is not found', async () => {
    const response = await request(app)
      .post('/api/score')
      .send({ playerId: player.id, gameId: 9999, score: 100 });

    expect(response.status).toBe(404);
    expect(response.body.message).toBe('Game not found');
  });
});
