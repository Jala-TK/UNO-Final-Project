import Card from "../../models/card.js";

export const createCard = async (req, res, next) => {
  try {
    const { color, value, gameId, point } = req.body;
    const newCard = await Card.create({ color, value, gameId, point });
    res.status(201).json(newCard);
  } catch (error) {
    next(error);
  }
};