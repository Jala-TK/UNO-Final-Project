import request from 'supertest';
import app from '../../../src/index.js';
import Card from '../../../src/models/card.js';
import Game from '../../../src/models/game.js';
import GamePlayer from '../../../src/models/gamePlayer.js';
import Player from '../../../src/models/player.js';
import { isCardPlayable } from '../../../src/services/cardService.js';

describe('GET /api/game/checkHand - Check Player Hand', () => {
  let player;
  let playerOther;
  let game;
  let card1;
  let card2;
  let topCard;
  let token;
  let tokenOtherUser;

  beforeAll(async () => {
    player = await Player.create({
      username: 'testPlayerCheckHand',
      email: 'testPlayerCheckHand@gmail.com',
      password: 'password123',
    });

    playerOther = await Player.create({
      username: 'testPlayerCheckHandOther',
      email: 'testPlayerCheckHandOther@gmail.com',
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
      title: 'Test Game Check Hand',
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

    card1 = await Card.create({
      color: 'red',
      value: '5',
      gameId: game.id,
      points: 5,
      image: 'card1.png',
      whoOwnerCard: player.id,
      orderDiscarded: null,
    });

    card2 = await Card.create({
      color: 'blue',
      value: '3',
      gameId: game.id,
      points: 3,
      image: 'card2.png',
      whoOwnerCard: player.id,
      orderDiscarded: null,
    });

    topCard = await Card.create({
      color: 'red',
      value: '7',
      gameId: game.id,
      points: 7,
      image: 'topCard.png',
      whoOwnerCard: null,
      orderDiscarded: 1,
    });

    await game.update({ topDiscardedCardId: topCard.id });
  });

  afterAll(async () => {
    await Card.destroy({ where: { gameId: game.id } });
    await GamePlayer.destroy({ where: { gameId: game.id } });
    await Game.destroy({ where: { id: game.id } });
    await Player.destroy({ where: { id: player.id } });
    await Player.destroy({ where: { id: playerOther.id } });
  });

  it('should return valid cards and top card details', async () => {
    const response = await request(app)
      .get('/api/game/checkHand')
      .send({ game_id: game.id, access_token: token });

    expect(response.status).toBe(200);

    const validCards = [card1, card2].filter((card) =>
      isCardPlayable(card, topCard),
    );

    expect(response.body.validCards).toEqual(
      validCards.map((card) => ({
        id: card.id,
        color: card.color,
        value: card.value,
      })),
    );

    expect(response.body.topCard).toEqual({
      id: topCard.id,
      color: topCard.color,
      value: topCard.value,
    });
  });

  it('should return an error if the game is not found', async () => {
    const response = await request(app)
      .get('/api/game/checkHand')
      .send({ game_id: 9999, access_token: token });

    expect(response.status).toBe(404);
    expect(response.body.message).toBe('Game not found');
  });

  it('should return an empty validCards array if no cards are playable', async () => {
    await topCard.update({ color: 'green', value: '2' });

    const response = await request(app)
      .get('/api/game/checkHand')
      .send({ game_id: game.id, access_token: token });

    expect(response.status).toBe(200);
    expect(response.body.validCards).toEqual([]);
  });
});
