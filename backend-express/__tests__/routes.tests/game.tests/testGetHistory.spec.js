import request from 'supertest';
import app from '../../../src/index.js';
import Player from '../../../src/models/player.js';
import Game from '../../../src/models/game.js';
import History from '../../../src/models/history.js';

describe('GET /api/game/history - Get Game History', () => {
  let player1;
  let player2;
  let game;
  let token;

  beforeAll(async () => {
    player1 = await Player.create({
      username: 'testGetHistory1',
      email: 'testGetHistory1@gmail.com',
      password: 'password123',
    });

    player2 = await Player.create({
      username: 'testGetHistory2',
      email: 'testGetHistory2@gmail.com',
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
    });

    await History.create({
      gameId: game.id,
      player: player1.username,
      action: 'played red 5',
    });

    await History.create({
      gameId: game.id,
      player: player2.username,
      action: 'played blue 3',
    });
  });

  afterAll(async () => {
    await History.destroy({ where: { gameId: game.id } });
    await Game.destroy({ where: { id: game.id } });
    await Player.destroy({ where: { id: player1.id } });
    await Player.destroy({ where: { id: player2.id } });
  });

  it('should return the history of the game', async () => {
    const response = await request(app)
      .get('/api/game/history')
      .send({ game_id: game.id, access_token: token });

    expect(response.status).toBe(200);
    expect(response.body).toEqual([
      {
        player: player1.username,
        action: 'played red 5',
      },
      {
        player: player2.username,
        action: 'played blue 3',
      },
    ]);
  });

  it('should return an error if the game is not found', async () => {
    const response = await request(app)
      .get('/api/game/history')
      .send({ game_id: 9999, access_token: token });

    expect(response.status).toBe(404);
    expect(response.body.message).toBe('Game not found');
  });

  it('should return an empty history if no history exists for the game', async () => {
    const newGame = await Game.create({
      title: 'No History Game',
      maxPlayers: 4,
      status: 'In progress',
      creatorId: player1.id,
    });

    const response = await request(app)
      .get('/api/game/history')
      .send({ game_id: newGame.id, access_token: token });

    expect(response.status).toBe(200);
    expect(response.body).toEqual([]);

    await newGame.destroy();
  });
});
