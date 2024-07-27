import Card from "../../models/card.js";

export const deleteCard = async (req, res, next) => {
  try {
    const card = await Card.findByPk(req.params.id);
    if (!card || card?.auditExcluded) {
      return res.status(404).json({ message: "Card not found" });
    }
    await card.update({ auditExcluded: true });
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};