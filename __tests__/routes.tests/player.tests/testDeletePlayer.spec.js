import request from 'supertest';
import app from '../../../src/index.js';
import Player from '../../../src/models/player.js';
import { Op } from 'sequelize';

describe('DELETE /api/player - Delete Player', () => {
  const userData = {
    username: 'testDeletePlayer',
    email: 'testDeletePlayer@gmail.com',
    password: 'knx',
  };

  const userExistsData = {
    username: 'testDeleteExistsPlayer',
    email: 'testDeleteExistsPlayer@gmail.com',
    password: 'knx',
  };

  let player;
  let playerExists;
  let token;

  beforeAll(async () => {
    playerExists = await Player.create(userExistsData);
    player = await Player.create(userData);

    const response = await request(app).post('/api/login').send({
      username: player.username,
      password: player.password,
    });

    token = response.body.access_token;
  });

  beforeEach(async () => {
    await Player.update(
      { auditExcluded: false },
      { where: { id: playerExists.id } },
    );
    await Player.update({ auditExcluded: false }, { where: { id: player.id } });
  });

  afterAll(async () => {
    await Player.destroy({
      where: {
        [Op.or]: [
          { username: userData.username },
          { username: userExistsData.username },
        ],
      },
    });
  });

  it('should delete a player with success', async () => {
    try {
      const response = await request(app)
        .delete(`/api/player/${player.id}`)
        .send({ access_token: token });

      expect(response.status).toBe(204);

      const user = await Player.findByPk(player.id);
      expect(user.auditExcluded).toBe(true);
    } catch (error) {
      console.error(error);
      throw error;
    }
  });

  it('should a error because the user to be delete does not have the same id', async () => {
    try {
      const response = await request(app)
        .delete(`/api/player/${playerExists.id}`)
        .send({
          access_token: token,
        });

      expect(response.status).toBe(401);
      expect(response.body.error).toBe('Unauthorized delete this user');
    } catch (error) {
      console.error(error);
      throw error;
    }
  });

  it('should return an error because not all the required arguments are present', async () => {
    try {
      const response = await request(app)
        .delete(`/api/player/${player.id}`)
        .send({});

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    } catch (error) {
      console.error(error);
      throw error;
    }
  });
});
