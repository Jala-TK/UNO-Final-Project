import request from 'supertest';
import app from '../../../src/index.js';
import Player from '../../../src/models/player.js';
import Game from '../../../src/models/game.js';
import GamePlayer from '../../../src/models/gamePlayer.js';

describe('POST /api/games/end - Finalize Game', () => {
  const gameData = {
    title: 'testEndGame',
    maxPlayers: 4,
  };

  let player;
  let playerExists;
  let token;
  let tokenOtherUser;
  let gameId;

  beforeAll(async () => {
    player = await Player.create({
      username: 'testEndGame',
      email: 'testEndGame@gmail.com',
      password: 'password123',
    });

    playerExists = await Player.create({
      username: 'testEndExistsGame',
      email: 'testEndExistsGame@gmail.com',
      password: 'password123',
    });

    const response = await request(app).post('/api/login').send({
      username: player.username,
      password: player.password,
    });

    const responseExists = await request(app).post('/api/login').send({
      username: playerExists.username,
      password: playerExists.password,
    });

    token = response.body.access_token;
    tokenOtherUser = responseExists.body.access_token;

    const responseGame = await request(app)
      .post('/api/games')
      .send({ ...gameData, access_token: token });

    gameId = responseGame.body.game_id;
  });

  beforeEach(async () => {
    await Game.update({ auditExcluded: false }, { where: { id: gameId } });
  });

  afterAll(async () => {
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
    await playerExists.destroy();
  });

  it('should end a game successfully', async () => {
    try {
      const response = await request(app)
        .post('/api/game/end')
        .send({ game_id: gameId, access_token: token });

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Game ended successfully');

      const game = await Game.findByPk(gameId);
      expect(game.status).toBe('Finished');
      expect(game.auditExcluded).toBe(true);
    } catch (error) {
      console.error(error);
      throw error;
    }
  });

  it('should return an error because the user did not create this game', async () => {
    try {
      const response = await request(app)
        .post('/api/game/end')
        .send({ game_id: gameId, access_token: tokenOtherUser });

      expect(response.status).toBe(403);
      expect(response.body.error).toBe('Only the creator can end the game');
    } catch (error) {
      console.error(error);
      throw error;
    }
  });

  it('should return an error because not all the required arguments are present', async () => {
    try {
      const response = await request(app)
        .post('/api/game/end')
        .send({ access_token: token });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Invalid params');
    } catch (error) {
      console.error(error);
      throw error;
    }
  });
});
