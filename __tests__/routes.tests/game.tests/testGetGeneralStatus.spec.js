import request from 'supertest';
import app from '../../../src/index.js';
import Player from '../../../src/models/player.js';
import Game from '../../../src/models/game.js';
import GamePlayer from '../../../src/models/gamePlayer.js';
import Card from '../../../src/models/card.js';
import History from '../../../src/models/history.js';

describe('POST /api/game/statusGeral - Get General Game Status', () => {
  let player1;
  let player2;
  let game;
  let topCard;
  let token;

  beforeAll(async () => {
    player1 = await Player.create({
      username: 'testPlayerGeneralStatus1',
      email: 'testPlayerGeneralStatus1@gmail.com',
      password: 'password123',
    });

    player2 = await Player.create({
      username: 'testPlayerGeneralStatus2',
      email: 'testPlayerGeneralStatus2@gmail.com',
      password: 'password123',
    });

    const response = await request(app).post('/api/login').send({
      username: player1.username,
      password: player1.password,
    });

    token = response.body.access_token;

    game = await Game.create({
      title: 'Test Game',
      maxPlayers: 4,
      status: 'In progress',
      creatorId: player1.id,
      currentPlayer: player1.id,
      clockwise: true,
    });

    await GamePlayer.create({
      gameId: game.id,
      playerId: player1.id,
      score: 0,
    });
    await GamePlayer.create({
      gameId: game.id,
      playerId: player2.id,
      score: 0,
    });

    topCard = await Card.create({
      color: 'red',
      value: '5',
      gameId: game.id,
      points: 5,
      image: 'card2.png',
      whoOwnerCard: null,
      orderDiscarded: 1,
    });

    await History.create({
      gameId: game.id,
      player: player1.username,
      action: 'played red 5',
    });
  });

  afterAll(async () => {
    await History.destroy({ where: { gameId: game.id } });
    await Card.destroy({ where: { gameId: game.id } });
    await GamePlayer.destroy({ where: { gameId: game.id } });
    await Game.destroy({ where: { id: game.id } });
    await Player.destroy({ where: { id: player1.id } });
    await Player.destroy({ where: { id: player2.id } });
  });

  it('should return the general status of the game', async () => {
    const response = await request(app)
      .get('/api/game/statusGeral')
      .send({ game_id: game.id });

    console.log(response.body);

    expect(response.status).toBe(200);
    expect(response.body.game_id).toBe(game.id);
    expect(response.body.current_player).toBe(player1.username);
    expect(response.body.direction).toBe('clockwise');
    expect(response.body.top_card).toBe('red 5');
    expect(response.body.hands).toHaveProperty(player1.username);
    expect(response.body.hands).toHaveProperty(player2.username);
    expect(response.body.turnHistory).toEqual([
      {
        player: player1.username,
        action: 'played red 5',
      },
    ]);
  });

  it('should return an error if the game is not found', async () => {
    const response = await request(app)
      .get('/api/game/statusGeral')
      .send({ game_id: 9999 });

    expect(response.status).toBe(404);
    expect(response.body.message).toBe('Game not found');
  });

  it('should return an error if the game has not started', async () => {
    const newGame = await Game.create({
      title: 'Not Started Game',
      maxPlayers: 4,
      status: 'Not started',
      creatorId: player1.id,
      currentPlayer: null,
      clockwise: true,
    });

    const response = await request(app)
      .get('/api/game/statusGeral')
      .send({ game_id: newGame.id });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('Start the game first');

    await newGame.destroy();
  });

  it('should return an error if the top card is not found', async () => {
    await Card.destroy({ where: { gameId: game.id } });

    const response = await request(app)
      .get('/api/game/statusGeral')
      .send({ game_id: game.id });

    expect(response.status).toBe(404);
    expect(response.body.message).toBe('Card not found');
  });
});
