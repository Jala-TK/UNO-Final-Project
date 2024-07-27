import express from "express";
import sequelize from "./config/database.js";
import gameRoutes from "./controllers/gameController.js";
import playerRoutes from "./controllers/playerController.js";
import scoreRoutes from "./controllers/scoreController.js";
import cardRoutes from "./controllers/cardController.js";
import errorHandler from "./middleware/errorHandler.js";
import authRoutes from "./controllers/authController.js";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use("/api", gameRoutes);
app.use("/api", playerRoutes);
app.use("/api", scoreRoutes);
app.use("/api", cardRoutes);
app.use("/api", authRoutes);
app.use(errorHandler);

const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log("\x1b[32m%s\x1b[0m", "Conectado ao banco com sucesso.");

    await sequelize.sync();
    console.log("\x1b[32m%s\x1b[0m", "Database sincronizado");

    app.listen(PORT, () => {
      console.log("\x1b[32m%s\x1b[0m", `Server rodando em localhost:${PORT}`);
    });
  } catch (error) {
    console.error(
      "\x1b[31m%s\x1b[0m",
      "Não é possível conectar ao banco dados:",
      error
    );
  }
};

startServer();
