import request from 'supertest';
import app from '../../../src/index.js';
import Player from '../../../src/models/player.js';
import Game from '../../../src/models/game.js';
import GamePlayer from '../../../src/models/gamePlayer.js';
import Card from '../../../src/models/card.js';
import { initializeDeck } from '../../../src/services/dealerService.js';

describe('POST /api/game/dealCards/:id - Deal Cards', () => {
  let player1;
  let player2;
  let game;
  let token;

  beforeAll(async () => {
    player1 = await Player.create({
      username: 'player1',
      email: 'player1@example.com',
      password: 'password123',
    });

    player2 = await Player.create({
      username: 'player2',
      email: 'player2@example.com',
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

    await initializeDeck(game.id);
  });

  afterAll(async () => {
    await Card.destroy({ where: { gameId: game.id } });
    await GamePlayer.destroy({ where: { gameId: game.id } });
    await Game.destroy({ where: { id: game.id } });
    await Player.destroy({ where: { id: player1.id } });
    await Player.destroy({ where: { id: player2.id } });
  });

  it('should deal cards to players successfully', async () => {
    const response = await request(app)
      .post(`/api/game/dealCards/${game.id}`)
      .send({
        players: [player1.username, player2.username],
        cardsPerPlayer: 7,
        access_token: token,
      });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Cards dealt successfully.');
    expect(Object.keys(response.body.players)).toEqual(
      expect.arrayContaining([
        player1.username.toString(),
        player2.username.toString(),
      ]),
    );
    console.log(response.body.players);
    for (const cards of Object.values(response.body.players)) {
      expect(cards.length).toBe(7);
    }
  });

  it('should return an error if the game is not found', async () => {
    const response = await request(app)
      .post('/api/game/dealCards/9999')
      .send({
        players: [player1.username, player2.username],
        cardsPerPlayer: 7,
        access_token: token,
      });

    expect(response.status).toBe(404);
    expect(response.body.message).toBe('Game not found');
  });

  it('should return an error if cardsPerPlayer is less than 1', async () => {
    const response = await request(app)
      .post(`/api/game/dealCards/${game.id}`)
      .send({
        players: [player1.username, player2.username],
        cardsPerPlayer: 0,
        access_token: token,
      });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe(
      'Cards per player must be greater than 0',
    );
  });

  it('should return an error if no players are found', async () => {
    const response = await request(app)
      .post(`/api/game/dealCards/${game.id}`)
      .send({
        players: [],
        cardsPerPlayer: 7,
        access_token: token,
      });

    expect(response.status).toBe(404);
    expect(response.body.message).toBe('No players found');
  });

  it('should return an error if a player is not in the game', async () => {
    const nonExistentPlayer = await Player.create({
      username: 'nonExistentPlayer',
      email: 'nonExistentPlayer@example.com',
      password: 'password123',
    });

    const response = await request(app)
      .post(`/api/game/dealCards/${game.id}`)
      .send({
        players: [nonExistentPlayer.username],
        cardsPerPlayer: 7,
        access_token: token,
      });

    expect(response.status).toBe(404);
    expect(response.body.error).toBe(
      `Player not found in this game: ${nonExistentPlayer.username}`,
    );

    await nonExistentPlayer.destroy();
  });
});
