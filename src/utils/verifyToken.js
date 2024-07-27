import jwt from "jsonwebtoken";
import BlacklistToken from "../models/blacklistToken.js";

export default async function VerifyToken(access_token) {
  return new Promise(async (resolve, reject) => {
    const blacklist = await BlacklistToken.findOne({ where: { token: access_token } })

    if (blacklist) {
      const error = new Error("Token is blacklisted");
      error.code = 403;
      return reject(error);
    }

    jwt.verify(access_token, process.env.JWT_SALT, (err, user) => {
      if (err) {
        const error = new Error("Token is not valid");
        error.code = 401;
        return reject(error);
      }
      resolve(user);
    });
  });
}
