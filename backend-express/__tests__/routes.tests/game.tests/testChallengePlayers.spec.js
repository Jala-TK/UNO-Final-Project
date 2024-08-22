import request from 'supertest';
import app from '../../../src/index.js';
import Player from '../../../src/models/player.js';
import Game from '../../../src/models/game.js';
import GamePlayer from '../../../src/models/gamePlayer.js';
import Card from '../../../src/models/card.js';
import History from '../../../src/models/history.js';

describe('POST /api/game/challengeUno - Challenge Player', () => {
  const gameData = {
    title: 'testChallengePlayer',
    maxPlayers: 4,
  };

  let challenger, challenged;
  let tokenChallenger, tokenChallenged;
  let gameId;
  let unoCard;
  let card1, card2;

  beforeAll(async () => {
    challenger = await Player.create({
      username: 'challenger',
      email: 'challenger@gmail.com',
      password: 'password123',
    });

    challenged = await Player.create({
      username: 'challenged',
      email: 'challenged@gmail.com',
      password: 'password123',
    });

    const responseChallenger = await request(app).post('/api/login').send({
      username: challenger.username,
      password: challenger.password,
    });

    tokenChallenger = responseChallenger.body.access_token;

    const responseChallenged = await request(app).post('/api/login').send({
      username: challenged.username,
      password: challenged.password,
    });

    tokenChallenged = responseChallenged.body.access_token;

    const responseGame = await request(app)
      .post('/api/games')
      .send({ ...gameData, access_token: tokenChallenger });
    gameId = responseGame.body.game_id;

    await GamePlayer.create({
      gameId: gameId,
      playerId: challenger.id,
    });

    await GamePlayer.create({
      gameId: gameId,
      playerId: challenged.id,
    });

    unoCard = await Card.create({
      gameId: gameId,
      whoOwnerCard: challenged.id,
      points: 2,
      color: 'red',
      value: '2',
      image: 'link',
    });

    card1 = await Card.create({
      gameId: gameId,
      whoOwnerCard: null,
      points: 2,
      color: 'yellow',
      value: '2',
      image: 'link',
    });

    card2 = await Card.create({
      gameId: gameId,
      whoOwnerCard: null,
      points: 2,
      color: 'blue',
      value: '2',
      image: 'link',
    });

    await Game.update(
      { currentPlayer: challenged.id },
      { where: { id: gameId } },
    );
  });

  afterEach(async () => {
    await Card.update({ whoOwnerCard: null }, { where: { id: card1.id } });
    await Card.update({ whoOwnerCard: null }, { where: { id: card2.id } });
  });

  afterAll(async () => {
    await Card.destroy({
      where: {
        gameId: gameId,
      },
    });

    await GamePlayer.destroy({
      where: {
        gameId: gameId,
      },
    });

    await History.destroy({
      where: {
        gameId: gameId,
      },
    });

    await Game.destroy({
      where: {
        id: gameId,
      },
    });

    await challenger.destroy();
    await challenged.destroy();
  });

  it('should challenge the player successfully and draw 2 cards for the challenged player', async () => {
    const response = await request(app).post('/api/game/challengeUno').send({
      game_id: gameId,
      challengePlayer: challenged.username,
      access_token: tokenChallenger,
    });
    expect(response.status).toBe(200);
    expect(response.body.message).toBe(
      `Challenge successful. ${challenged.username} forgot to say UNO and draws 2 cards.`,
    );

    const playerHand = await Card.findAll({
      where: { whoOwnerCard: challenged.id },
    });

    expect(playerHand).toHaveLength(3); // Deve ter 3 cartas após o desafio
  });

  it('should return an error because game ID is not provided', async () => {
    const response = await request(app).post('/api/game/challengeUno').send({
      challengePlayer: challenged.username,
      access_token: tokenChallenger,
    });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('Invalid params');
  });

  it('should return an error because the player already said UNO', async () => {
    await GamePlayer.update(
      { uno: true },
      { where: { playerId: challenged.id, gameId: gameId } },
    );

    const responseHands = await request(app).get('/api/game/playerHands').send({
      game_id: gameId,
    });

    const response = await request(app).post('/api/game/challengeUno').send({
      game_id: gameId,
      challengePlayer: challenged.username,
      access_token: tokenChallenger,
    });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe(
      `Challenge failed. ${challenged.username} said UNO on time.`,
    );
  });

  it('should return an error because the game does not exist', async () => {
    const invalidGameId = 9999;

    const response = await request(app).post('/api/game/challengeUno').send({
      game_id: invalidGameId,
      challengePlayer: challenged.username,
      access_token: tokenChallenger,
    });

    expect(response.status).toBe(404);
    expect(response.body.message).toBe('Game not found');
  });
});
