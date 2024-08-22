import {
  findScoreById,
  deleteScore as deleteScoreService,
} from '../../services/scoreService.js';
export const deleteScore = async (req, res, next) => {
  try {
    const gamePlayer = await findScoreById(req.params.id);
    if (!gamePlayer || gamePlayer.auditExcluded) {
      return res.status(404).json({ message: 'Score not found' });
    }
    await deleteScoreService(gamePlayer);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};
