import request from 'supertest';
import app from '../../../src/index.js';
import Player from '../../../src/models/player.js';
import Game from '../../../src/models/game.js';
import Card from '../../../src/models/card.js';
import GamePlayer from '../../../src/models/gamePlayer.js';

describe('GET /api/game/hand - Get Player Hand', () => {
  let player, player2;
  let game;
  let token;

  beforeAll(async () => {
    player = await Player.create({
      username: 'testGetPlayerHand',
      email: 'testGetPlayerHand@gmail.com',
      password: 'password123',
    });

    player2 = await Player.create({
      username: 'testGetPlayerHand2',
      email: 'testGetPlayerHand2@gmail.com',
      password: 'password123',
    });

    const response = await request(app).post('/api/login').send({
      username: player.username,
      password: player.password,
    });

    token = response.body.access_token;

    game = await Game.create({
      title: 'Test Game',
      maxPlayers: 4,
      status: 'In progress',
      creatorId: player.id,
    });

    await GamePlayer.create({
      gameId: game.id,
      playerId: player.id,
    });

    await Card.create({
      gameId: game.id,
      whoOwnerCard: player.id,
      points: 10,
      color: 'red',
      value: '10',
      image: 'link',
    });

    await Card.create({
      gameId: game.id,
      whoOwnerCard: player.id,
      points: 2,
      color: 'blue',
      value: '2',
      image: 'link',
    });
  });

  afterAll(async () => {
    await Card.destroy({ where: { gameId: game.id } });
    await GamePlayer.destroy({
      where: { gameId: game.id, playerId: player.id },
    });
    await Game.destroy({ where: { id: game.id } });
    await Player.destroy({ where: { id: player.id } });
    await Player.destroy({ where: { id: player2.id } });
  });

  it('should return the hand of the player', async () => {
    const response = await request(app)
      .get('/api/game/hand')
      .send({ game_id: game.id, access_token: token });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      player: player.username,
      hand: ['red 10', 'blue 2'],
    });
  });

  it('should return an error if the player is not in the game', async () => {
    const newGame = await Game.create({
      title: 'Another Test Game',
      maxPlayers: 4,
      status: 'In progress',
      creatorId: player2.id,
    });

    const response = await request(app)
      .get('/api/game/hand')
      .send({ game_id: newGame.id, access_token: token });

    expect(response.status).toBe(404);
    expect(response.body.message).toBe('Player not found in this game');

    await newGame.destroy();
  });
});
