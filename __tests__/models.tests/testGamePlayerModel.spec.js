import Game from '../../src/models/game.js';
import GamePlayer from '../../src/models/gamePlayer.js';
import Player from '../../src/models/player.js';
import { Op } from 'sequelize';

describe('Game Player Model', () => {
  const userData = {
    username: 'testGamePlayer',
    email: 'testGamePlayer@example.com',
    password: 'password123',
  };

  const gameData = {
    title: 'Testing Game Player',
    status: 'Waiting for players',
    maxPlayers: 4,
  };

  const gamePlayerData = {
    status: true,
    score: 99999,
  };

  const getGamePlayer = async () => {
    return await GamePlayer.findOne({
      where: {
        [Op.or]: [{ score: 99999 }],
      },
    });
  };

  let player;
  let game;

  beforeAll(async () => {
    player = await Player.create(userData);
    game = await Game.create({ ...gameData, creatorId: player.id });
  });

  afterEach(async () => {
    await GamePlayer.destroy({
      where: {
        [Op.or]: [{ score: 99999 }, { score: 11111 }],
      },
    });
  });

  afterAll(async () => {
    await Game.destroy({
      where: {
        title: 'Testing Game Player',
      },
    });
    await Player.destroy({
      where: {
        username: 'testGamePlayer',
      },
    });
  });

  it('should create a gamePlayer instance', async () => {
    const gamePlayer = await GamePlayer.create({
      ...gamePlayerData,
      playerId: player.id,
      gameId: game.id,
    });

    expect(gamePlayer.status).toBe(true);
    expect(gamePlayer.score).toBe(99999);
    expect(gamePlayer.playerId).toBe(player.id);
    expect(gamePlayer.gameId).toBe(game.id);
  });

  it('should find a gamePlayer instance', async () => {
    await GamePlayer.create({
      ...gamePlayerData,
      playerId: player.id,
      gameId: game.id,
    });

    const gamePlayer = await getGamePlayer();
    expect(gamePlayer.status).toBe(true);
    expect(gamePlayer.score).toBe(99999);
    expect(gamePlayer.playerId).toBe(player.id);
    expect(gamePlayer.gameId).toBe(game.id);
  });

  it('should update a gamePlayer instance', async () => {
    await GamePlayer.create({
      ...gamePlayerData,
      playerId: player.id,
      gameId: game.id,
    });
    let gamePlayer = await getGamePlayer();

    gamePlayer.status = false;
    gamePlayer.score = 11111;
    await gamePlayer.save();

    gamePlayer = await GamePlayer.findOne({
      where: {
        id: gamePlayer.id,
      },
    });

    expect(gamePlayer.status).toBe(false);
    expect(gamePlayer.score).toBe(11111);
    expect(gamePlayer.playerId).toBe(player.id);
    expect(gamePlayer.gameId).toBe(game.id);

    await gamePlayer.destroy();
  });

  it('should delete a gamePlayer instance', async () => {
    await GamePlayer.create({
      ...gamePlayerData,
      playerId: player.id,
      gameId: game.id,
    });
    let gamePlayer = await getGamePlayer();
    await gamePlayer.destroy();
    gamePlayer = await getGamePlayer();

    expect(gamePlayer).toBeNull();
  });

  it('should find all gamePlayers', async () => {
    const gamePlayers = await GamePlayer.findAll();

    expect(gamePlayers).toBeInstanceOf(Array);
  });
});
