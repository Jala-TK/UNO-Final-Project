import request from 'supertest';
import app from '../../../src/index.js';
import Player from '../../../src/models/player.js';
import Game from '../../../src/models/game.js';
import GamePlayer from '../../../src/models/gamePlayer.js';

describe('DELETE /api/games - Delete Game', () => {
  const gameData = {
    title: 'testDeleteGame',
    maxPlayers: 4,
  };

  let player;
  let playerExists;
  let token;
  let tokenOtherUser;
  let gameId;

  beforeAll(async () => {
    player = await Player.create({
      username: 'testDeleteGame',
      email: 'testDeleteGame@gmail.com',
      password: 'password123',
    });

    playerExists = await Player.create({
      username: 'testDeleteExistsGame',
      email: 'testDeleteExistsGame@gmail.com',
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
        title: 'testDeleteGame',
      },
    });

    await player.destroy();
    await playerExists.destroy();
  });

  it('should delete a game with success', async () => {
    try {
      const response = await request(app)
        .delete(`/api/games/${gameId}`)
        .send({ access_token: token });

      expect(response.status).toBe(204);

      const game = await Game.findByPk(gameId);
      expect(game.auditExcluded).toBe(true);
    } catch (error) {
      console.error(error);
      throw error;
    }
  });

  it('should return an error because the user did not create this game', async () => {
    try {
      const response = await request(app).delete(`/api/games/${gameId}`).send({
        access_token: tokenOtherUser,
      });

      expect(response.status).toBe(401);
      expect(response.body.error).toBe('Only the creator can delete the game');
    } catch (error) {
      console.error(error);
      throw error;
    }
  });

  it('should return an error because not all the required arguments are present', async () => {
    try {
      const response = await request(app)
        .delete(`/api/games/${gameId}`)
        .send({});

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Invalid credentials');
    } catch (error) {
      console.error(error);
      throw error;
    }
  });
});
