import request from 'supertest';
import app from '../../../src/index.js';
import Player from '../../../src/models/player.js';
import Game from '../../../src/models/game.js';
import GamePlayer from '../../../src/models/gamePlayer.js';
import Card from '../../../src/models/card.js';

describe('GET /api/game/playerHands - Get Player Hands', () => {
  const gameData = {
    title: 'testGetPlayerHands',
    maxPlayers: 4,
  };

  let player;
  let token;
  let gameId;
  let card1, card2;

  beforeAll(async () => {
    player = await Player.create({
      username: 'testGetPlayerHands',
      email: 'testGetPlayerHands@gmail.com',
      password: 'password123',
    });

    const response = await request(app).post('/api/login').send({
      username: player.username,
      password: player.password,
    });

    token = response.body.access_token;

    const responseGame = await request(app)
      .post('/api/games')
      .send({ ...gameData, access_token: token });

    gameId = responseGame.body.game_id;

    await GamePlayer.create({
      gameId: gameId,
      playerId: player.id,
    });

    card1 = await Card.create({
      gameId: gameId,
      whoOwnerCard: player.id,
      points: 10,
      color: 'red',
      value: 'Card 1',
      image: 'link',
    });

    card2 = await Card.create({
      gameId: gameId,
      whoOwnerCard: player.id,
      points: 20,
      color: 'red',
      value: 'Card 2',
      image: 'link',
    });
  });

  afterAll(async () => {
    await Card.destroy({
      where: {
        gameId: gameId,
      },
    });

    await GamePlayer.destroy({
      where: {
        gameId: gameId,
      },
    });

    await Game.destroy({
      where: {
        id: gameId,
      },
    });

    await player.destroy();
  });

  it('should return the player hands successfully', async () => {
    const response = await request(app)
      .get('/api/game/playerHands')
      .send({ game_id: gameId });

    expect(response.status).toBe(200);
    expect(response.body.game_id).toBe(gameId);
    expect(response.body.hands[player.username]).toHaveLength(2);
    expect(response.body.hands[player.username]).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: card1.id,
          points: card1.points,
          description: card1.value,
        }),
        expect.objectContaining({
          id: card2.id,
          points: card2.points,
          description: card2.value,
        }),
      ]),
    );
  });

  it('should return an error because game ID is not provided', async () => {
    const response = await request(app).get('/api/game/playerHands').send({});

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('Game ID is required');
  });

  it('should return an error because the game does not exist', async () => {
    const invalidGameId = 9999;

    const response = await request(app)
      .get('/api/game/playerHands')
      .send({ game_id: invalidGameId });

    expect(response.status).toBe(404);
    expect(response.body.message).toBe('Game not found');
  });
});
