import request from 'supertest';
import app from '../../../src/index.js';
import Player from '../../../src/models/player.js';
import Game from '../../../src/models/game.js';

describe('PUT /api/games/:id - Update Game', () => {
  let player;
  let anotherPlayer;
  let token;
  let anotherToken;
  let game;

  beforeAll(async () => {
    player = await Player.create({
      username: 'testUpdateGame',
      email: 'testUpdateGame@gmail.com',
      password: 'password123',
    });

    anotherPlayer = await Player.create({
      username: 'testAnotherUpdateGame',
      email: 'testAnotherUpdateGame@gmail.com',
      password: 'password123',
    });

    let response = await request(app).post('/api/login').send({
      username: player.username,
      password: player.password,
    });

    token = response.body.access_token;

    response = await request(app).post('/api/login').send({
      username: anotherPlayer.username,
      password: anotherPlayer.password,
    });

    anotherToken = response.body.access_token;

    game = await Game.create({
      title: 'Original Title',
      maxPlayers: 4,
      status: 'Pending',
      creatorId: player.id,
    });
  });

  afterAll(async () => {
    await Game.destroy({ where: { id: game.id } });
    await player.destroy();
    await anotherPlayer.destroy();
  });

  it('should update the game successfully', async () => {
    const updatedData = {
      title: 'Updated Title',
      status: 'In progress',
      maxPlayers: 6,
      access_token: token,
    };

    const response = await request(app)
      .put(`/api/games/${game.id}`)
      .send(updatedData);

    expect(response.status).toBe(200);
    expect(response.body.title).toBe(updatedData.title);
    expect(response.body.status).toBe(updatedData.status);
    expect(response.body.maxPlayers).toBe(updatedData.maxPlayers);

    const updatedGame = await Game.findByPk(game.id);
    expect(updatedGame.title).toBe(updatedData.title);
    expect(updatedGame.status).toBe(updatedData.status);
    expect(updatedGame.maxPlayers).toBe(updatedData.maxPlayers);
  });

  it('should return an error if required params are missing', async () => {
    const incompleteData = {
      title: 'New Title',
      access_token: token,
    };

    const response = await request(app)
      .put(`/api/games/${game.id}`)
      .send(incompleteData);

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('Invalid params');
  });

  it('should return an error if the game does not exist', async () => {
    const nonExistentGameId = 9999;

    const response = await request(app)
      .put(`/api/games/${nonExistentGameId}`)
      .send({
        title: 'New Title',
        status: 'Pending',
        maxPlayers: 4,
        access_token: token,
      });

    expect(response.status).toBe(404);
    expect(response.body.message).toBe('Game not found');
  });

  it('should return an error if another user tries to update the game', async () => {
    const updatedData = {
      title: 'Another Title',
      status: 'Pending',
      maxPlayers: 5,
      access_token: anotherToken,
    };

    const response = await request(app)
      .put(`/api/games/${game.id}`)
      .send(updatedData);

    expect(response.status).toBe(403);
    expect(response.body.error).toBe('Only the creator can edit the game');
  });

  it('should update the game title when name is provided instead of title', async () => {
    const updatedData = {
      name: 'Title with Name',
      status: 'Pending',
      maxPlayers: 4,
      access_token: token,
    };

    const response = await request(app)
      .put(`/api/games/${game.id}`)
      .send(updatedData);

    expect(response.status).toBe(200);
    expect(response.body.title).toBe(updatedData.name);

    const updatedGame = await Game.findByPk(game.id);
    expect(updatedGame.title).toBe(updatedData.name);
  });
});
