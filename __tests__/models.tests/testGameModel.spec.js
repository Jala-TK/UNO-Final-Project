import Game from '../../src/models/game.js';
import Player from '../../src/models/player.js';
import { Op } from 'sequelize';

describe('Game Model', () => {
  const userData = {
    username: 'testGame',
    email: 'testGame@example.com',
    password: 'password123',
  };

  const gameData = {
    title: 'Testing Game',
    status: 'Waiting for players',
    maxPlayers: 4,
  };

  const getGame = async () => {
    return await Game.findOne({
      where: {
        [Op.or]: [{ title: 'Testing Game' }],
      },
    });
  };

  let player;

  beforeAll(async () => {
    player = await Player.create(userData);
  });

  afterEach(async () => {
    await Game.destroy({
      where: {
        [Op.or]: [{ title: gameData.title }, { title: 'Updated Game' }],
      },
    });
  });

  afterAll(async () => {
    await Player.destroy({
      where: {
        username: 'testGame',
      },
    });
  });

  it('should create a game instance', async () => {
    const game = await Game.create({ ...gameData, creatorId: player.id });

    expect(game.title).toBe('Testing Game');
    expect(game.status).toBe('Waiting for players');
    expect(game.maxPlayers).toBe(4);
    expect(game.creatorId).toBe(player.id);
  });

  it('should find a game instance', async () => {
    await Game.create({ ...gameData, creatorId: player.id });

    const game = await getGame();
    expect(game.title).toBe('Testing Game');
    expect(game.status).toBe('Waiting for players');
    expect(game.maxPlayers).toBe(4);
    expect(game.creatorId).toBe(player.id);
  });

  it('should update a player instance', async () => {
    await Game.create({ ...gameData, creatorId: player.id });
    let game = await getGame();

    game.title = 'Updated Game';
    game.status = 'Updatated Game';
    game.maxPlayers = 2;
    await game.save();

    game = await Game.findOne({
      where: {
        id: game.id,
      },
    });

    expect(game.title).toBe('Updated Game');
    expect(game.status).toBe('Updatated Game');
    expect(game.maxPlayers).toBe(2);

    await game.destroy();
  });

  it('should delete a game instance', async () => {
    await Game.create({ ...gameData, creatorId: player.id });
    let game = await getGame();
    await game.destroy();
    game = await getGame();

    expect(game).toBeNull();
  });

  it('should find all games', async () => {
    const games = await Game.findAll();

    expect(games).toBeInstanceOf(Array);
  });
});
