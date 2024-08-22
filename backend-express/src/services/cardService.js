import Card from '../models/card.js';
import { Op } from 'sequelize';

const VALID_COLORS = ['yellow', 'green', 'red', 'blue'];

export const createNewCard = async ({
  color,
  value,
  game_id,
  point,
  image,
}) => {
  const newCard = await Card.create({ color, value, game_id, point, image });
  return newCard;
};

export const findCardById = async (id) => {
  const card = await Card.findByPk(id);
  return card;
};

export const getHighestDiscardOrder = async (gameId) => {
  return await Card.findOne({
    where: { gameId: gameId, orderDiscarded: { [Op.ne]: null }, auditExcluded: false },
    order: [['orderDiscarded', 'DESC']],
  });
};

export const updateCardDetails = async (card, updates) => {
  await card.update(updates);
  return card;
};

export const updateCardOrder = async (card, newOrder) => {
  card.orderDiscarded = newOrder;
  await card.save();
};

export const excludeCard = async (card) => {
  await card.update({ auditExcluded: true });
};

export const findAvailableCard = async (gameId) => {
  const card = await Card.findOne({
    where: { gameId, whoOwnerCard: null },
  });
  return card;
};

export const assignCardToPlayer = async (cardId, playerId) => {
  await Card.update({ whoOwnerCard: playerId, auditExcluded: false }, { where: { id: cardId, auditExcluded: false } });
};

export const isCardPlayable = (drawnCard, currentCard) => {
  return (
    drawnCard.color === currentCard.color ||
    drawnCard.value === currentCard.value ||
    drawnCard.value === 'wild' ||
    drawnCard.value === 'wild_draw4'
  );
};

export const discardCard = async (gameId, card) => {
  if (!VALID_COLORS.includes(card.color)) {
    return res.status(400).json({
      message: `Invalid card color: ${card.color}`,
    });
  }

  const highestOrder = await getHighestDiscardOrder(gameId);

  await updateCardOrder(card, (highestOrder.orderDiscarded || 0) + 1);
};
