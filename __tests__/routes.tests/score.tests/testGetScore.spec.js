import request from 'supertest';
import app from '../../../src/index.js';
import GamePlayer from '../../../src/models/gamePlayer.js';
import Game from '../../../src/models/game.js';
import Player from '../../../src/models/player.js';

describe('GET /api/score/:id - Get Score', () => {
  let game;
  let player;
  let gamePlayer;

  beforeAll(async () => {
    player = await Player.create({
      username: 'testPlayer',
      email: 'testPlayer@gmail.com',
      password: 'password123',
    });

    game = await Game.create({
      title: 'Test Game',
      maxPlayers: 4,
      status: 'In progress',
      creatorId: player.id,
    });

    gamePlayer = await GamePlayer.create({
      gameId: game.id,
      playerId: player.id,
      score: 10,
    });
  });

  afterAll(async () => {
    await gamePlayer.destroy();
    await game.destroy();
    await player.destroy();
  });

  it('should get the score successfully', async () => {
    const response = await request(app)
      .get(`/api/score/${gamePlayer.id}`)
      .send();

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({
      id: gamePlayer.id,
      gameId: game.id,
      playerId: player.id,
      score: 10,
    });
  });

  it('should return an error if the score is not found', async () => {
    const response = await request(app).get('/api/score/9999').send();

    expect(response.status).toBe(404);
    expect(response.body.message).toBe('Score not found');
  });
});
