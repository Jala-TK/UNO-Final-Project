import { findAllTrackings } from '../../services/statsService.js';

export const requests = async (req, res, next) => {
  try {
    const trackings = await findAllTrackings()

    const breakdown = trackings.reduce((acc, tracking) => {
      if (!acc[tracking.endpointAccess]) {
        acc[tracking.endpointAccess] = {};
      }
      if (!acc[tracking.endpointAccess][tracking.requestMethod]) {
        acc[tracking.endpointAccess][tracking.requestMethod] = 0;
      }
      acc[tracking.endpointAccess][tracking.requestMethod] += tracking.requestCount;
      return acc;
    }, {});

    const total_requests = trackings.reduce((acc, tracking) => acc + tracking.requestCount, 0);

    res.json({ total_requests, breakdown });
  } catch (error) {
    next(error);
  }
};
