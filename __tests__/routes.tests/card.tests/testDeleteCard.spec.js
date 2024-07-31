import request from 'supertest';
import app from '../../../src/index.js';
import Card from '../../../src/models/card.js';
import Game from '../../../src/models/game.js';
import Player from '../../../src/models/player.js';

describe('DELETE /api/cards/:id - Delete Card', () => {
  let card;
  let game;
  let player;

  beforeAll(async () => {
    player = await Player.create({
      username: 'testDeleteCard',
      email: 'testDeleteCard@gmail.com',
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
      value: '3',
      gameId: game.id,
      points: 3,
      image: 'test.png',
    });
  });

  afterAll(async () => {
    await Card.destroy({ where: { gameId: game.id } });
    await game.destroy();
    await player.destroy();
  });

  it('should delete a card successfully', async () => {
    const response = await request(app).delete(`/api/cards/${card.id}`);

    expect(response.status).toBe(204);

    const deletedCard = await Card.findByPk(card.id);
    expect(deletedCard).not.toBeNull();
    expect(deletedCard.auditExcluded).toBe(true);
  });

  it('should return an error if the card does not exist', async () => {
    const response = await request(app).delete('/api/cards/9999'); // Non-existent card ID

    expect(response.status).toBe(404);
    expect(response.body.message).toBe('Card not found');
  });
});
