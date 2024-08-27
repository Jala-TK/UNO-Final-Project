import { findAllTrackings } from '../../services/statsService.js';

export const statusCodes = async (req, res, next) => {
  try {
    const trackings = await findAllTrackings();

    const statusCodes = trackings.reduce((acc, tracking) => {
      if (!acc[tracking.statusCode]) {
        acc[tracking.statusCode] = 0;
      }
      acc[tracking.statusCode] += tracking.requestCount;
      return acc;
    }, {});

    res.json(statusCodes);
  } catch (error) {
    next()
  }
};
