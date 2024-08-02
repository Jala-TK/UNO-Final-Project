import GamePlayer from '../models/gamePlayer.js';
import Card from '../models/card.js';
import Player from '../models/player.js';
import Game from '../models/game.js';

class Monad {
  constructor(promise) {
    this.promise = promise;
  }

  static of(value) {
    return new Monad(Promise.resolve(value));
  }

  static reject(error) {
    return new Monad(Promise.reject(error));
  }

  map(fn) {
    return new Monad(this.promise.then(fn));
  }

  flatMap(fn) {
    return new Monad(this.promise.then((value) => fn(value).promise));
  }

  catch(fn) {
    return new Monad(this.promise.catch(fn));
  }

  run() {
    return this.promise;
  }
}

export const getPlayerHandsService = (game_id) => {
  const validateGameId = (game_id) =>
    game_id
      ? Monad.of(game_id)
      : Monad.reject({ status: 400, message: 'Game ID is required' });

  const fetchGame = (game_id) =>
    new Monad(
      Game.findByPk(game_id).then((game) => {
        if (!game || game.auditExcluded) {
          return Promise.reject({ status: 404, message: 'Game not found' });
        }
        return game;
      }),
    );

  const fetchPlayersInGame = (game_id) =>
    new Monad(
      GamePlayer.findAll({
        where: { gameId: game_id, auditExcluded: false },
      }).then((players) => players.map((player) => player.playerId)),
    );

  const fetchPlayerHands = (game_id, playerIds) =>
    new Monad(
      Promise.all(
        playerIds.map((playerId) =>
          Card.findAll({
            where: {
              gameId: game_id,
              whoOwnerCard: playerId,
              orderDiscarded: null,
            },
          }).then((cards) => ({
            [playerId]: cards.map((card) => ({
              id: card.id,
              points: card.points,
              description: card.value,
            })),
          })),
        ),
      ).then((playerHands) =>
        playerHands.reduce((acc, hand) => ({ ...acc, ...hand }), {}),
      ),
    );

  const fetchPlayerNames = (playerIds) =>
    new Monad(
      Player.findAll({ where: { id: playerIds } }).then((players) =>
        players.reduce((acc, player) => {
          acc[player.id] = player.username;
          return acc;
        }, {}),
      ),
    );

  const buildResponse = (game, playerHands, playerNames) => ({
    game_id: game.id,
    hands: Object.keys(playerHands).reduce(
      (acc, playerId) => ({
        ...acc,
        [playerNames[playerId]]: playerHands[playerId],
      }),
      {},
    ),
  });

  return validateGameId(game_id)
    .flatMap(fetchGame)
    .flatMap((game) =>
      fetchPlayersInGame(game.id).flatMap((playerIds) =>
        fetchPlayerHands(game.id, playerIds).flatMap((playerHands) =>
          fetchPlayerNames(playerIds).map((playerNames) =>
            buildResponse(game, playerHands, playerNames),
          ),
        ),
      ),
    )
    .run();
};
