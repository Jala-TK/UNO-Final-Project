import request from 'supertest';
import app from '../../../src/index.js';
import Game from '../../../src/models/game.js';
import GamePlayer from '../../../src/models/gamePlayer.js';
import Player from '../../../src/models/player.js';

describe('DELETE /api/score/:id - Delete Score', () => {
  let game;
  let player;
  let gamePlayer;

  beforeAll(async () => {
    player = await Player.create({
      username: 'testPlayerDeleteScore',
      email: 'testPlayerDeleteScore@gmail.com',
      password: 'password123',
    });

    game = await Game.create({
      title: 'Test Game',
      maxPlayers: 4,
      status: 'In progress',
      creatorId: player.id,
    });

    gamePlayer = await GamePlayer.create({
      playerId: player.id,
      gameId: game.id,
      score: 100,
    });
  });

  afterAll(async () => {
    await gamePlayer.destroy();
    await game.destroy();
    await player.destroy();
  });

  it('should delete a score successfully', async () => {
    const response = await request(app).delete(`/api/score/${gamePlayer.id}`);

    expect(response.status).toBe(204);

    const updatedGamePlayer = await GamePlayer.findByPk(gamePlayer.id);
    expect(updatedGamePlayer.score).toBe(0);
  });

  it('should return an error if the score is not found', async () => {
    const response = await request(app).delete('/api/score/9999');

    expect(response.status).toBe(404);
    expect(response.body.message).toBe('Score not found');
  });
});
