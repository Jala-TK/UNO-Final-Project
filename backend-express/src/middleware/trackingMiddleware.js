import Tracking from '../models/tracking.js';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const trackingMiddleware = async (req, res, next) => {
  const start = Date.now();

  res.on('finish', async () => {
    const duration = Date.now() - start;
    const { method, originalUrl } = req;

    if (!originalUrl.includes('/api')) {
      return
    }

    const statusCode = res.statusCode;
    const endpoint = originalUrl.split('?')[0];

    let userId = null;

    const token = req.headers['authorization']?.split(' ')[1];
    if (token) {
      try {
        const decodedToken = jwt.verify(token, process.env.JWT_SALT);
        userId = decodedToken.id;
      } catch (err) {
        console.error('Token inválido ou expirado', err);
      }
    }

    const existingTracking = await Tracking.findOne({
      where: { endpointAccess: endpoint, requestMethod: method },
    });

    if (existingTracking) {
      const newRequestCount = existingTracking.requestCount + 1;
      const newAvgResponseTime =
        (existingTracking.responseTimeAvg * existingTracking.requestCount + duration) / newRequestCount;

      await existingTracking.update({
        requestCount: newRequestCount,
        responseTimeAvg: newAvgResponseTime,
        responseTimeMin: Math.min(existingTracking.responseTimeMin, duration),
        responseTimeMax: Math.max(existingTracking.responseTimeMax, duration),
        statusCode: statusCode,
        userId: userId || existingTracking.userId,
      });
    } else {
      await Tracking.create({
        endpointAccess: endpoint,
        requestMethod: method,
        requestCount: 1,
        responseTimeAvg: duration,
        responseTimeMin: duration,
        responseTimeMax: duration,
        statusCode: statusCode,
        userId: userId,
      });
    }
  });

  next();
};

export default trackingMiddleware;
