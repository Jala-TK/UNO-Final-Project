import request from 'supertest';
import app from '../../../src/index.js';
import Card from '../../../src/models/card.js';
import Game from '../../../src/models/game.js';
import GamePlayer from '../../../src/models/gamePlayer.js';
import Player from '../../../src/models/player.js';

describe('POST /api/cards/play - Play Card', () => {
  let game;
  let player;
  let playerOther;
  let card;
  let token;
  let tokenOtherUser;

  beforeAll(async () => {
    player = await Player.create({
      username: 'testPlayerPlayCard',
      email: 'testPlayerPlayCard@gmail.com',
      password: 'password123',
    });

    playerOther = await Player.create({
      username: 'testPlayerPlayCardOther',
      email: 'testPlayerPlayCardOther@gmail.com',
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

    card = await Card.create({
      color: 'red',
      value: '5',
      gameId: game.id,
      points: 5,
      image: 'card.png',
      whoOwnerCard: player.id, // Card owned by the player
      orderDiscarded: null, // Card not discarded
    });
  });

  afterAll(async () => {
    await Card.destroy({ where: { gameId: game.id } });
    await GamePlayer.destroy({ where: { gameId: game.id } });
    await Game.destroy({ where: { id: game.id } });
    await Player.destroy({ where: { id: player.id } });
    await Player.destroy({ where: { id: playerOther.id } });
  });

  it('should play a card successfully', async () => {
    const response = await request(app)
      .post('/api/cards/play')
      .send({ game_id: game.id, card_id: card.id, access_token: token });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Card played successfully');
    expect(response.body.response).toBeDefined();

    const updatedCard = await Card.findByPk(card.id);
    expect(updatedCard.orderDiscarded).toBeDefined();
    expect(updatedCard.whoOwnerCard).toBe(player.id);
  });

  it("should return an error if it is not the player's turn", async () => {
    await game.update({ currentPlayer: playerOther.id }); // Simulating another player's turn

    const response = await request(app)
      .post('/api/cards/play')
      .send({ game_id: game.id, card_id: card.id, access_token: token });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('It is not the players turn yet');
  });

  it('should return an error if the card does not belong to the player', async () => {
    await game.update({ currentPlayer: player.id }); // Simulating another player's turn

    const cardForOtherPlayer = await Card.create({
      color: 'blue',
      value: '7',
      gameId: game.id,
      points: 7,
      image: 'other_card.png',
      whoOwnerCard: playerOther.id, // Different owner
    });

    const response = await request(app).post('/api/cards/play').send({
      game_id: game.id,
      card_id: cardForOtherPlayer.id,
      access_token: token,
    });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('Card does not belong to player');

    await cardForOtherPlayer.destroy();
  });

  it('should return an error if the card has already been discarded', async () => {
    await game.update({ currentPlayer: player.id }); // Simulating another player's turn

    await card.update({ orderDiscarded: 1 });

    const response = await request(app)
      .post('/api/cards/play')
      .send({ game_id: game.id, card_id: card.id, access_token: token });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('Card already discarded');
  });

  it('should return an error if the card is not found', async () => {
    await game.update({ currentPlayer: player.id });

    const response = await request(app)
      .post('/api/cards/play')
      .send({ game_id: game.id, card_id: 9999, access_token: token });

    expect(response.status).toBe(404);
    expect(response.body.message).toBe('Card not found');
  });

  it('should return an error if the game is not found', async () => {
    await game.update({ currentPlayer: player.id });

    const response = await request(app)
      .post('/api/cards/play')
      .send({ game_id: 9999, card_id: card.id, access_token: token });

    expect(response.status).toBe(404);
    expect(response.body.message).toBe('Game not found');
  });
});
