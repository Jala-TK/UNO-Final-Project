import jwt from 'jsonwebtoken';

export default function VerifyToken(access_token) {
  return jwt.verify(access_token, process.env.JWT_SALT, (err, user) => {
    if (err) {
      err.statusCode = 401
      throw new Error(err)
    }
    return user
  })
}