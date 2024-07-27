import Game from "../../models/game.js";

export const getStatusGame = async (req, res, next) => {
  try {
    const { game_id } = req.body;
    if (!game_id) return res.status(400).json({ message: "Invalid params" });

    const game = await Game.findByPk(game_id);
    if (!game || game?.auditExcluded) {
      return res.status(404).json({ message: "Game not found" });
    }

    res.status(200).json({ status: game.status });
  } catch (err) {
    next(err);
  }
};
