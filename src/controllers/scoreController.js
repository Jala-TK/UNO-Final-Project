import Score from '../models/score.js';

export const createScore = async (req, res, next) => {
  try {
    const { playerId, gameId, score } = req.body;
    const newScore = await Score.create({ playerId, gameId, score });
    res.status(201).json(newScore);
  } catch (error) {
    next(error);
  }
};

export const getScore = async (req, res, next) => {
  try {
    const score = await Score.findByPk(req.params.id);
    if (!score || score?.auditExcluded) {
      return res.status(404).json({ message: 'Score not found' });
    }
    res.status(200).json(score);
  } catch (error) {
    next(error);
  }
};

export const updateScore = async (req, res, next) => {
  try {
    const scoreT = await Score.findByPk(req.params.id);
    if (!scoreT || scoreT?.auditExcluded) {
      return res.status(404).json({ message: 'Score not found' });
    }
    const { playerId, gameId, score } = req.body;
    await scoreT.update({ playerId, gameId, score });
    res.status(200).json(scoreT);
  } catch (error) {
    next(error);
  }
};

export const deleteScore = async (req, res, next) => {
  try {
    const score = await Score.findByPk(req.params.id);
    if (!score || score?.auditExcluded) {
      return res.status(404).json({ message: 'Score not found' });
    }
    await score.update({ auditExcluded: true });
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};