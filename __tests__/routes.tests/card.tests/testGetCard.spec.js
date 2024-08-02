import request from 'supertest';
import app from '../../../src/index.js';
import Card from '../../../src/models/card.js';
import Game from '../../../src/models/game.js';
import Player from '../../../src/models/player.js';

describe('GET /api/cards/:id - Get Card', () => {
  let card;
  let game;
  let player;

  beforeAll(async () => {
    player = await Player.create({
      username: 'testCardUser',
      email: 'testCardUser@gmail.com',
      password: 'password123',
    });

    game = await Game.create({
      title: 'Test Game',
      maxPlayers: 4,
      status: 'Pending',
      creatorId: player.id,
    });

    card = await Card.create({
      color: 'blue',
      value: '10',
      gameId: game.id,
      points: 10,
      image: 'test-card.png',
    });
  });

  afterAll(async () => {
    await Card.destroy({ where: { id: card.id } });
    await Game.destroy({ where: { id: game.id } });
    await Player.destroy({ where: { id: player.id } });
  });

  it('should return the card successfully when the card exists', async () => {
    const response = await request(app).get(`/api/cards/${card.id}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('id', card.id);
    expect(response.body).toHaveProperty('color', card.color);
    expect(response.body).toHaveProperty('value', card.value);
    expect(response.body).toHaveProperty('game_id', card.gameId);
  });

  it('should return an error if the card does not exist', async () => {
    const nonExistentCardId = 9999; // Use an ID that does not exist

    const response = await request(app).get(`/api/cards/${nonExistentCardId}`);

    expect(response.status).toBe(404);
    expect(response.body.message).toBe('Card not found');
  });

  it('should return an error if the card is excluded', async () => {
    // Mark the card as excluded
    await card.update({ auditExcluded: true });

    const response = await request(app).get(`/api/cards/${card.id}`);

    expect(response.status).toBe(404);
    expect(response.body.message).toBe('Card not found');
  });
});
