import request from 'supertest';
import app from '../../../src/index.js';
import Card from '../../../src/models/card.js';
import Game from '../../../src/models/game.js';
import Player from '../../../src/models/player.js';

describe('POST /api/cards - Create Card', () => {
  let game;
  let player;

  beforeAll(async () => {
    player = await Player.create({
      username: 'testCreateCard',
      email: 'testCreateCard@gmail.com',
      password: 'password123',
    });

    game = await Game.create({
      title: 'Test Game',
      maxPlayers: 4,
      status: 'Pending',
      creatorId: player.id,
    });
  });

  afterAll(async () => {
    await Card.destroy({ where: { gameId: game.id } });
    await game.destroy();
    await player.destroy();
  });

  it('should create a card successfully', async () => {
    const cardData = {
      color: 'red',
      value: '5',
      gameId: game.id,
      points: 5,
      image: 'test.png',
    };

    const response = await request(app).post('/api/cards').send(cardData);

    expect(response.status).toBe(201);
    expect(response.body.card_id).toBeDefined();
    expect(response.body.game_id).toBe(cardData.gameId);
    expect(response.body.points).toBe(cardData.points);
    expect(response.body.value).toBe(cardData.value);

    const createdCard = await Card.findByPk(response.body.card_id);
    expect(createdCard).not.toBeNull();
    expect(createdCard.color).toBe(cardData.color);
    expect(createdCard.value).toBe(cardData.value);
    expect(createdCard.gameId).toBe(cardData.gameId);
    expect(createdCard.points).toBe(cardData.points);
    expect(createdCard.image).toBe(cardData.image);
  });

  it('should return an error if required params are missing', async () => {
    const incompleteCardData = {
      color: 'blue',
      value: '7',
      gameId: game.id,
      points: 7,
      // Missing 'image'
    };

    const response = await request(app)
      .post('/api/cards')
      .send(incompleteCardData);

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('Invalid params');
  });

  it('should return an error if the game does not exist', async () => {
    const cardData = {
      color: 'green',
      value: '7',
      gameId: 9999, // Non-existent game ID
      points: 7,
      image: 'http://example.com/image.png',
    };

    const response = await request(app).post('/api/cards').send(cardData);

    expect(response.status).toBe(404);
    expect(response.body.message).toBe('Game not found');
  });
});
