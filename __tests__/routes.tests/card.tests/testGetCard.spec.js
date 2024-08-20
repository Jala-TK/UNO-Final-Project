import request from 'supertest';
import app from '../../../src/index.js';
import Card from '../../../src/models/card.js';
import Player from '../../../src/models/player.js';
import Game from '../../../src/models/game.js';

describe('GET /api/cards/:id - Get Card', () => {
  let player;
  let game;
  let card;

  beforeAll(async () => {
    player = await Player.create({
      username: 'testPlayerGetCard',
      email: 'testPlayerGetCard@gmail.com',
      password: 'password123',
    });

    game = await Game.create({
      title: 'Test Game Get Card',
      maxPlayers: 4,
      status: 'In progress',
      creatorId: player.id,
    });

    card = await Card.create({
      color: 'red',
      value: '5',
      gameId: game.id,
      points: 5,
      image: 'card.png',
      whoOwnerCard: player.id,
      orderDiscarded: null,
    });
  });

  afterAll(async () => {
    await Card.destroy({ where: { gameId: game.id } });
    await Game.destroy({ where: { id: game.id } });
    await Player.destroy({ where: { id: player.id } });
  });

  it('should return card details successfully', async () => {
    const response = await request(app).get(`/api/cards/${card.id}`);

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      id: card.id,
      color: card.color,
      value: card.value,
      game_id: card.gameId,
    });
  });

  it('should return 404 if the card is not found', async () => {
    const response = await request(app).get('/api/cards/9999');

    expect(response.status).toBe(404);
    expect(response.body.message).toBe('Card not found');
  });

  it('should return 404 if the card is audit excluded', async () => {
    await card.update({ auditExcluded: true });

    const response = await request(app).get(`/api/cards/${card.id}`);

    expect(response.status).toBe(404);
    expect(response.body.message).toBe('Card not found');
  });
});
