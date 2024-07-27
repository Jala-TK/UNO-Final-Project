import GamePlayer from '../../models/gamePlayer.js';

export const deleteScore = async (req, res, next) => {
  try {
    const gamePlayer = await GamePlayer.findByPk(req.params.id);
    if (!gamePlayer || gamePlayer.auditExcluded) {
      return res.status(404).json({ message: "Score not found" });
    }
    await gamePlayer.update({ score: 0 });
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};
