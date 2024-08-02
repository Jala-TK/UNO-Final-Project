import request from 'supertest';
import app from '../../../src/index.js';
import GamePlayer from '../../../src/models/gamePlayer.js';
import Game from '../../../src/models/game.js';
import Player from '../../../src/models/player.js';

describe('PUT /api/score/:id - Update Score', () => {
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

  it('should update the score successfully', async () => {
    const newScore = 20;
    const response = await request(app)
      .put(`/api/score/${gamePlayer.id}`)
      .send({
        playerId: player.id,
        gameId: game.id,
        score: newScore,
      });

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({
      playerId: player.id,
      gameId: game.id,
      score: newScore,
    });

    const updatedGamePlayer = await GamePlayer.findByPk(gamePlayer.id);
    expect(updatedGamePlayer.score).toBe(newScore);
  });

  it('should return an error if the score is not found', async () => {
    const response = await request(app).put('/api/score/9999').send({
      playerId: player.id,
      gameId: game.id,
      score: 20,
    });

    expect(response.status).toBe(404);
    expect(response.body.message).toBe('Score not found');
  });

  it('should return an error if invalid params are provided', async () => {
    const response = await request(app)
      .put(`/api/score/${gamePlayer.id}`)
      .send({
        playerId: player.id,
        gameId: game.id,
      });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('Invalid params');
  });

  it('should return an error if playerId does not match', async () => {
    const newScore = 20;
    const response = await request(app)
      .put(`/api/score/${gamePlayer.id}`)
      .send({
        playerId: player.id + 1, // Invalid playerId
        gameId: game.id,
        score: newScore,
      });

    expect(response.status).toBe(404);
    expect(response.body.message).toBe('Score with playerId not found');
  });

  it('should return an error if gameId does not match', async () => {
    const newScore = 20;
    const response = await request(app)
      .put(`/api/score/${gamePlayer.id}`)
      .send({
        playerId: player.id,
        gameId: game.id + 1, // Invalid gameId
        score: newScore,
      });

    expect(response.status).toBe(404);
    expect(response.body.message).toBe('Score with gameId not found');
  });
});
