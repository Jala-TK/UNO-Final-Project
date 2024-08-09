export const validateParams = (params, res) => {
  for (const key in params) {
    if (!params[key]) {
      return res.status(400).json({ message: `Invalid params` });
    }
  }
};
