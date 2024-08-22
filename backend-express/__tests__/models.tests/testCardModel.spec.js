import Card from '../../src/models/card.js';
import Player from '../../src/models/player.js';
import Game from '../../src/models/game.js';
import { Op } from 'sequelize';

describe('Card Model', () => {
  const userData = {
    username: 'testCard',
    email: 'testCard@example.com',
    password: 'password123',
  };

  const gameData = {
    title: 'Testing Player Model',
    status: 'Waiting for players',
    maxPlayers: 4,
  };

  const cardData = {
    color: 'red',
    value: 'test',
    points: 1,
    image: 'images',
  };

  const getCard = async () => {
    return await Card.findOne({
      where: {
        [Op.or]: [{ value: cardData.value }],
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
    await Card.destroy({
      where: {
        [Op.or]: [{ value: cardData.value }, { value: 'updated' }],
      },
    });
  });

  afterAll(async () => {
    await Game.destroy({
      where: {
        title: gameData.title,
      },
    });

    await Player.destroy({
      where: {
        username: 'testCard',
      },
    });
  });

  it('should create a card instance', async () => {
    const card = await Card.create({ ...cardData, gameId: game.id });

    expect(card.color).toBe('red');
    expect(card.value).toBe('test');
    expect(card.points).toBe(1);
  });

  it('should find a card instance', async () => {
    await Card.create({ ...cardData, gameId: game.id });

    const card = await getCard();
    expect(card.color).toBe('red');
    expect(card.value).toBe('test');
    expect(card.points).toBe(1);
  });

  it('should update a card instance', async () => {
    await Card.create({ ...cardData, gameId: game.id });
    let card = await getCard();

    card.color = 'blue';
    card.value = 'updated';
    await card.save();
    card = await Card.findOne({
      where: {
        id: card.id,
      },
    });

    expect(card.color).toBe('blue');
    expect(card.value).toBe('updated');
    expect(card.points).toBe(1);

    await card.destroy();
  });

  it('should delete a card instance', async () => {
    await Card.create({ ...cardData, gameId: game.id });
    let card = await getCard();
    await card.destroy();
    card = await getCard();

    expect(card).toBeNull();
  });

  it('should find all cards', async () => {
    await Card.create({ ...cardData, gameId: game.id });

    const cards = await Card.findAll();
    expect(cards).toBeInstanceOf(Array);
  });
});
