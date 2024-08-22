import Player from '../../src/models/player.js';
import BlacklistToken from '../../src/models/blacklistToken.js';
import jwt from 'jsonwebtoken';
const { sign } = jwt;
import 'dotenv/config';

describe('Blacklist Token Model', () => {
  const userData = {
    username: 'testBlacklistedToken',
    email: 'testBlacklistedToken@example.com',
    password: 'password123',
  };

  let player;
  let access_token;

  beforeAll(async () => {
    player = await Player.create(userData);
    access_token = sign(
      {
        id: player.id,
        username: player.username,
        email: player.email,
      },
      process.env.JWT_SALT,
      {
        expiresIn: '7d',
      },
    );
  });

  afterEach(async () => {
    await BlacklistToken.destroy({
      where: {
        token: access_token,
      },
    });
  });

  afterAll(async () => {
    await Player.destroy({
      where: {
        username: 'testBlacklistedToken',
      },
    });
  });

  it('should create a blacklistToken instance', async () => {
    const blacklistToken = await BlacklistToken.create({ token: access_token });

    expect(blacklistToken.token).toBe(access_token);
  });

  it('should delete a blacklistToken instance', async () => {
    await BlacklistToken.create({ token: access_token });
    let blacklistToken = await BlacklistToken.findOne({
      where: {
        token: access_token,
      },
    });
    await blacklistToken.destroy();
    blacklistToken = await BlacklistToken.findOne({
      where: {
        token: access_token,
      },
    });

    expect(blacklistToken).toBeNull();
  });

  it('should find a gamePlayer instance', async () => {
    await BlacklistToken.create({ token: access_token });

    const blacklistToken = await BlacklistToken.findOne({
      where: {
        token: access_token,
      },
    });

    expect(blacklistToken.token).toBe(access_token);
  });

  it('should find all blacklistTokens', async () => {
    await BlacklistToken.create({ token: access_token });

    const blacklistTokens = await BlacklistToken.findAll();
    expect(blacklistTokens).toBeInstanceOf(Array);
  });
});
