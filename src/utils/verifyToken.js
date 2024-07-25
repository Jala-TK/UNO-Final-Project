import jwt from "jsonwebtoken";
import blacklist from "../utils/blacklist.js";

export default async function VerifyToken(access_token) {
  return new Promise((resolve, reject) => {
    if (blacklist.has(access_token)) {
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
