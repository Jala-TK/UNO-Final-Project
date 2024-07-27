import Game from "../../models/game.js";

export const getGame = async (req, res, next) => {
  try {
    const game_id = req.params.id;
    if (!game_id) return res.status(400).json({ message: "Invalid params" });

    const game = await Game.findByPk(game_id);
    if (!game || game?.auditExcluded) {
      return res.status(404).json({ message: "Game not found" });
    }
    res.status(200).json(game);
  } catch (error) {
    next(error);
  }
};
