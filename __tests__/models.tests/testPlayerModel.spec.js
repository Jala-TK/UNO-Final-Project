import Player from '../../src/models/player.js';
import { Op } from 'sequelize';

describe('Player Model', () => {
  const playerData = [
    {
      username: 'testPlayer',
      email: 'testPlayer@example.com',
      password: 'password123',
    },
    {
      username: 'testPlayerUpdate',
      email: 'updatedPlayer@example.com',
      password: 'password123',
    },
  ];

  const getUser = async () => {
    return await Player.findOne({
      where: {
        [Op.or]: [
          { username: playerData[0].username },
          { email: playerData[0].email },
        ],
      },
    });
  };

  afterEach(async () => {
    await Player.destroy({
      where: {
        [Op.or]: [
          { username: playerData[0].username },
          { email: playerData[0].email },
          { username: playerData[1].username },
          { email: playerData[1].email },
        ],
      },
    });
  });

  it('should create a player instance', async () => {
    const player = await Player.create(playerData[0]);

    expect(player.username).toBe('testPlayer');
    expect(player.password).toBe('password123');
    expect(player.email).toBe('testPlayer@example.com');
  });

  it('should find a player instance', async () => {
    await Player.create(playerData[0]);

    const user = await getUser();
    expect(user.username).toBe('testPlayer');
    expect(user.password).toBe('password123');
    expect(user.email).toBe('testPlayer@example.com');
  });

  it('should update a player instance', async () => {
    await Player.create(playerData[0]);
    let user = await getUser();

    user.username = playerData[1].username;
    user.email = playerData[1].email;
    await user.save();

    user = await Player.findOne({
      where: {
        id: user.id,
      },
    });

    expect(user.username).toBe('testPlayerUpdate');
    expect(user.password).toBe('password123');
    expect(user.email).toBe('updatedPlayer@example.com');

    await user.destroy();
  });

  it('should delete a player instance', async () => {
    await Player.create(playerData[0]);
    let user = await getUser();
    await user.destroy();
    user = await getUser();

    expect(user).toBeNull();
  });

  it('should find all players', async () => {
    await Player.create(playerData[0]);

    const players = await Player.findAll();
    expect(players).toBeInstanceOf(Array);
  });
});
