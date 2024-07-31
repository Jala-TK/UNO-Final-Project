import request from 'supertest';
import app from '../../../src/index.js';
import Card from '../../../src/models/card.js';
import Game from '../../../src/models/game.js';
import GamePlayer from '../../../src/models/gamePlayer.js';
import Player from '../../../src/models/player.js';

describe('POST /api/cards/draw - Draw Card', () => {
  let game;
  let player;
  let playerOther;
  let token;
  let tokenOtherUser;

  beforeAll(async () => {
    player = await Player.create({
      username: 'testPlayerDrawCard',
      email: 'testPlayerDrawCard@gmail.com',
      password: 'password123',
    });

    playerOther = await Player.create({
      username: 'testPlayerDrawCardOther',
      email: 'testPlayerDrawCardOther@gmail.com',
      password: 'password123',
    });

    const response = await request(app).post('/api/login').send({
      username: player.username,
      password: player.password,
    });

    const responseOther = await request(app).post('/api/login').send({
      username: playerOther.username,
      password: playerOther.password,
    });

    token = response.body.access_token;
    tokenOtherUser = responseOther.body.access_token;

    game = await Game.create({
      title: 'Test Game',
      maxPlayers: 4,
      status: 'In progress',
      creatorId: player.id,
      currentPlayer: player.id,
    });

    await GamePlayer.create({ gameId: game.id, playerId: player.id, score: 0 });
    await GamePlayer.create({
      gameId: game.id,
      playerId: playerOther.id,
      score: 0,
    });

    // Add a card to the deck
    await Card.create({
      color: 'red',
      value: '5',
      gameId: game.id,
      points: 5,
      image: 'card.png',
      whoOwnerCard: null,
    });
  });

  afterAll(async () => {
    await Card.destroy({ where: { gameId: game.id } });
    await GamePlayer.destroy({ where: { gameId: game.id } });
    await game.destroy();
    await player.destroy();
    await playerOther.destroy();
  });

  it('should draw a card successfully', async () => {
    const response = await request(app)
      .post('/api/cards/draw')
      .send({ game_id: game.id, access_token: token });

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.card).toBeDefined();

    const card = await Card.findByPk(response.body.card.id);
    expect(card.whoOwnerCard).toBe(player.id);

    const gamePlayer = await GamePlayer.findOne({
      where: { gameId: game.id, playerId: player.id },
    });
    expect(gamePlayer.score).toBe(5);
  });

  it("should return an error if it is not the player's turn", async () => {
    const response = await request(app)
      .post('/api/cards/draw')
      .send({ game_id: game.id, access_token: token });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('It is not the players turn yet');
  });

  it('should return an error if no cards are available in the deck', async () => {
    await Card.destroy({ where: { gameId: game.id } }); // Ensure no cards are left

    const response = await request(app)
      .post('/api/cards/draw')
      .send({ game_id: game.id, access_token: tokenOtherUser });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('No more cards available in the deck');
  });
});
