import request from 'supertest';
import app from '../../../src/index.js';
import Card from '../../../src/models/card.js';
import Game from '../../../src/models/game.js';
import GamePlayer from '../../../src/models/gamePlayer.js';
import Player from '../../../src/models/player.js';
import History from '../../../src/models/history.js';

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
    await History.destroy({ where: { gameId: game.id } });
    await Game.destroy({ where: { id: game.id } });
    await player.destroy();
    await playerOther.destroy();
  });

  it('should draw a card successfully', async () => {
    const response = await request(app)
      .post('/api/cards/draw')
      .send({ game_id: game.id, access_token: token });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe(
      `${player.username} drew a card from the deck`,
    );
    expect(response.body.cardDrawn).toBe('red 5');

    const gamePlayer = await GamePlayer.findOne({
      where: { gameId: game.id, playerId: player.id },
    });
    expect(gamePlayer.score).toBe(5);

    const history = await History.findOne({
      where: { gameId: game.id, player: player.username },
    });
    expect(history.action).toBe('Drew a card red 5');
  });

  it("should return an error if it is not the player's turn", async () => {
    const response = await request(app)
      .post('/api/cards/draw')
      .send({ game_id: game.id, access_token: token });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('It is not the players turn yet');
  });

  it('should log the action to the history when a card is drawn', async () => {
    await request(app)
      .post('/api/cards/draw')
      .send({ game_id: game.id, access_token: token });

    const history = await History.findOne({
      where: { gameId: game.id, player: player.username },
    });
    expect(history).not.toBeNull();
    expect(history.action).toBe('Drew a card red 5');
  });
});
