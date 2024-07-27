import VerifyToken from "../../utils/verifyToken.js";

export const getPerfil = async (req, res, next) => {
  const { access_token } = req.body;

  if (!access_token) {
    return res.status(404).json({ error: "Invalid credentials" });
  }

  try {
    const responsePerfil = await VerifyToken(access_token);

    if (responsePerfil?.username && responsePerfil?.email) {
      res.status(200).json({
        username: responsePerfil.username,
        email: responsePerfil.email,
      });
    } else {
      res.status(401).json({ error: "Invalid credentials" });
    }
  } catch (error) {
    next(error);
  }
};
