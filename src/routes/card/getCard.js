import Card from "../../models/card.js";

export const getCard = async (req, res, next) => {
  try {
    const card = await Card.findByPk(req.params.id);
    if (!card || card?.auditExcluded) {
      return res.status(404).json({ message: "Card not found" });
    }
    res.status(200).json(card);
  } catch (error) {
    next(error);
  }
};
