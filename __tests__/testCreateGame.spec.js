import Game from '../src/models/game.js';
import Player from '../src/models/player.js';

describe('Game Model', () => {
  it('should create a game instance', async () => {
    const player = await Player.create({
      username: 'username',
      password: 'password',
      email: 'email',
      title: 'Test Player',
      status: 'active',
      maxPlayers: 1,
      creatorId: 1,
    });

    const gameData = {
      title: 'Test Game',
      status: 'active',
      maxPlayers: 4,
      creatorId: player.id,
    };

    const game = await Game.create(gameData);
    expect(game.title).toBe('Test Game');
    expect(game.status).toBe('active');
    expect(game.maxPlayers).toBe(4);
    expect(game.creatorId).toBe(player.id);
  });

  it('should find all games', async () => {
    const games = await Game.findAll();

    expect(games).toBeInstanceOf(Array);
  });
});
