import Card from '../models/card.js';

export const createCard = async (req, res, next) => {
  try {
    const { color, value, gameId } = req.body;
    const newCard = await Card.create({ color, value, gameId });
    res.status(201).json(newCard);
  } catch (error) {
    next(error);
  }
};

export const getCard = async (req, res, next) => {
  try {
    const card = await Card.findByPk(req.params.id);
    if (!card || card?.auditExcluded) {
      return res.status(404).json({ message: 'Card not found' });
    }
    res.status(200).json(card);
  } catch (error) {
    next(error);
  }
};

export const updateCard = async (req, res, next) => {
  try {
    const card = await Card.findByPk(req.params.id);
    if (!card || card?.auditExcluded) {
      return res.status(404).json({ message: 'Card not found' });
    }
    const { color, value, gameId } = req.body;
    await card.update({ color, value, gameId });
    res.status(200).json(card);
  } catch (error) {
    next(error);
  }
};

export const deleteCard = async (req, res, next) => {
  try {
    const card = await Card.findByPk(req.params.id);
    if (!card || card?.auditExcluded) {
      return res.status(404).json({ message: 'Card not found' });
    }
    await card.update({ auditExcluded: true });
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

