export const getPerfil = (req, res, next) => {
  try {
    const { username, email } = req.user;

    res.status(200).json({
      username,
      email,
    });
  } catch (error) {
    next(error);
  }
};
