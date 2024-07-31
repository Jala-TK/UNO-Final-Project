import request from 'supertest';
import app from '../../../src/index.js';
import Card from '../../../src/models/card.js';
import Game from '../../../src/models/game.js';
import Player from '../../../src/models/player.js';

describe('PUT /api/cards/:id - Update Card', () => {
  let card;
  let game;
  let player;

  beforeAll(async () => {
    player = await Player.create({
      username: 'testUpdateCard',
      email: 'testUpdateCard@gmail.com',
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

  it('should update a card successfully when valid parameters are provided', async () => {
    const updatedCardData = {
      color: 'red',
      value: '12',
      gameId: game.id,
    };

    const response = await request(app)
      .put(`/api/cards/${card.id}`)
      .send(updatedCardData);

    expect(response.status).toBe(200);
    expect(response.body.card_id).toBe(card.id);
    expect(response.body.game_id).toBe(game.id);
    expect(response.body.value).toBe(updatedCardData.value);
    expect(response.body.points).toBe(card.points);

    const updatedCard = await Card.findByPk(card.id);
    expect(updatedCard.color).toBe(updatedCardData.color);
    expect(updatedCard.value).toBe(updatedCardData.value);
    expect(updatedCard.gameId).toBe(updatedCardData.gameId);
  });

  it('should return an error if the card does not exist', async () => {
    const nonExistentCardId = 9999; // an ID that does not exist

    const response = await request(app)
      .put(`/api/cards/${nonExistentCardId}`)
      .send({ color: 'yellow', value: '15', gameId: game.id });

    expect(response.status).toBe(404);
    expect(response.body.message).toBe('Card not found');
  });

  it('should return an error if the card is excluded', async () => {
    // Mark the card as excluded
    await card.update({ auditExcluded: true });

    const response = await request(app)
      .put(`/api/cards/${card.id}`)
      .send({ color: 'yellow', value: '15', gameId: game.id });

    expect(response.status).toBe(404);
    expect(response.body.message).toBe('Card not found');
  });

  it('should return an error if required params are missing', async () => {
    await card.update({ auditExcluded: false });

    const response = await request(app)
      .put(`/api/cards/${card.id}`)
      .send({ color: 'green' }); // Missing 'value' and 'gameId'

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('Invalid params');
  });
});
