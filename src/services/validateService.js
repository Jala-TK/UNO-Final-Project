import { findGameById, isCurrentPlayer } from '../services/gameService.js';
import { findCardById, isCardPlayable } from '../services/cardService.js';

export const validateGameExists = async (game_id, res) => {
  const game = await findGameById(game_id);
  if (!game || game?.auditExcluded) {
    res.status(404).json({ message: 'Game not found' });
    return null;
  }
  return game;
};

export const validatePlayerTurn = async (game, user, res) => {
  if (!isCurrentPlayer(game, user.id)) {
    res.status(400).json({ message: "It is not the player's turn yet" });
    return false;
  }
  return true;
};

export const validateCardExists = async (card_id, game, res) => {
  const card = await findCardById(card_id);
  if (!card || card?.auditExcluded) {
    res.status(404).json({ message: 'Card not found' });
    return null;
  }

  if (card.gameId !== game.id) {
    res.status(404).json({ message: 'Card is not from this game' });
    return null;
  }

  return card;
};

export const validateCardOwnership = async (card, user, res) => {
  if (card.whoOwnerCard !== user.id) {
    res.status(400).json({ message: 'Card does not belong to player' });
    return false;
  }

  if (card.orderDiscarded !== null) {
    res.status(400).json({ message: 'Card already discarded' });
    return false;
  }

  return true;
};

export const validateCardPlayable = async (card, topDiscardCard, res) => {
  const isPlayable = isCardPlayable(card, topDiscardCard);
  if (!isPlayable && card.value !== 'wild_draw4') {
    res.status(400).json({
      message:
        'Invalid card. Please play a card that matches the top card on the discard pile.',
    });
    return false;
  }
  return true;
};
