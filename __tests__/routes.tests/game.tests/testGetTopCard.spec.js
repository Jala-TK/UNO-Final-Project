import request from 'supertest';
import app from '../../../src/index.js';
import Player from '../../../src/models/player.js';
import Game from '../../../src/models/game.js';
import Card from '../../../src/models/card.js';
import GamePlayer from '../../../src/models/gamePlayer.js';

describe('GET /api/game/topCard - Get Top Card', () => {
  const gameData = {
    title: 'testGetTopCard',
    maxPlayers: 4,
    status: 'Active',
  };

  let player;
  let token;
  let gameId;
  let card;

  beforeAll(async () => {
    player = await Player.create({
      username: 'testGetTopCard',
      email: 'testGetTopCard@gmail.com',
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

    card = await Card.create({
      gameId: gameId,
      whoOwnerCard: player.id,
      points: 10,
      color: 'red',
      value: 'Ace of Spades',
      image: 'link',
      orderDiscarded: 1,
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

  it('should return the top card successfully', async () => {
    const response = await request(app)
      .get('/api/game/topCard')
      .send({ game_id: gameId });

    expect(response.status).toBe(200);
    expect(response.body.top_card).toBe(card.value);
  });

  it('should return an error because game_id is missing', async () => {
    const response = await request(app).get('/api/game/topCard').send({});

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('Invalid Params');
  });

  it('should return an error because the game does not exist', async () => {
    const invalidGameId = 9999;

    const response = await request(app)
      .get('/api/game/topCard')
      .send({ game_id: invalidGameId });

    expect(response.status).toBe(404);
    expect(response.body.message).toBe('Game not found');
  });

  it('should return an error because no top card is found', async () => {
    const newGame = await Game.create({
      title: 'testGetTopCardNoCard',
      maxPlayers: 4,
      status: 'Active',
      creatorId: player.id,
    });

    const response = await request(app)
      .get('/api/game/topCard')
      .send({ game_id: newGame.id });

    expect(response.status).toBe(404);
    expect(response.body.message).toBe('Card not found');

    await newGame.destroy();
  });
});
