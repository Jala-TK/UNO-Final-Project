import Card from "../../models/card.js";

export const updateCard = async (req, res, next) => {
  try {
    const card = await Card.findByPk(req.params.id);
    if (!card || card?.auditExcluded) {
      return res.status(404).json({ message: "Card not found" });
    }
    const { color, value, gameId } = req.body;
    await card.update({ color, value, gameId });
    res.status(200).json(card);
  } catch (error) {
    next(error);
  }
};