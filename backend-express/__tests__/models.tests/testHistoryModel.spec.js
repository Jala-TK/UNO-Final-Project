import History from '../../src/models/history.js';
import Game from '../../src/models/game.js';
import Player from '../../src/models/player.js';
import { Op } from 'sequelize';

describe('History Model', () => {
  const userData = {
    username: 'testHistoryUser',
    email: 'testHistoryUser@example.com',
    password: 'password123',
  };

  const gameData = {
    title: 'History Test Game',
    status: 'Finished',
    maxPlayers: 4,
  };

  const historyData = {
    player: 'testHistoryUser',
    action: 'Joined the game',
  };

  let player, game;

  beforeAll(async () => {
    player = await Player.create(userData);
    game = await Game.create({ ...gameData, creatorId: player.id });
  });

  afterEach(async () => {
    await History.destroy({
      where: {
        gameId: game.id,
      },
    });
  });

  afterAll(async () => {
    await Game.destroy({
      where: {
        id: game.id,
      },
    });
    await Player.destroy({
      where: {
        id: player.id,
      },
    });
  });

  it('should create a history instance', async () => {
    const history = await History.create({ ...historyData, gameId: game.id });

    expect(history.player).toBe('testHistoryUser');
    expect(history.action).toBe('Joined the game');
    expect(history.gameId).toBe(game.id);
  });

  it('should find a history instance', async () => {
    await History.create({ ...historyData, gameId: game.id });

    const history = await History.findOne({
      where: {
        gameId: game.id,
        player: historyData.player,
      },
    });

    expect(history.player).toBe('testHistoryUser');
    expect(history.action).toBe('Joined the game');
    expect(history.gameId).toBe(game.id);
  });

  it('should update a history instance', async () => {
    await History.create({ ...historyData, gameId: game.id });
    let history = await History.findOne({
      where: {
        gameId: game.id,
        player: historyData.player,
      },
    });

    history.action = 'Left the game';
    await history.save();

    history = await History.findOne({
      where: {
        id: history.id,
      },
    });

    expect(history.action).toBe('Left the game');
  });

  it('should delete a history instance', async () => {
    await History.create({ ...historyData, gameId: game.id });
    let history = await History.findOne({
      where: {
        gameId: game.id,
        player: historyData.player,
      },
    });

    await history.destroy();
    history = await History.findOne({
      where: {
        gameId: game.id,
        player: historyData.player,
      },
    });

    expect(history).toBeNull();
  });

  it('should find all history records', async () => {
    await History.create({ ...historyData, gameId: game.id });

    const histories = await History.findAll({
      where: {
        gameId: game.id,
      },
    });

    expect(histories).toBeInstanceOf(Array);
  });
});
