import Card from '../models/card.js';
import { Op } from 'sequelize';

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
  return await Card.max('orderDiscarded', {
    where: { gameId, orderDiscarded: { [Op.ne]: null } },
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
  await Card.update({ whoOwnerCard: playerId }, { where: { id: cardId } });
};
