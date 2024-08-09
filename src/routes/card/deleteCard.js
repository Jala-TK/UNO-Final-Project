import { findCardById, excludeCard } from '../../services/cardService.js';

export const deleteCard = async (req, res, next) => {
  try {
    const card = await findCardById(req.params.id);
    if (!card || card.auditExcluded) {
      return res.status(404).json({ message: 'Card not found' });
    }
    await excludeCard(card);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};
