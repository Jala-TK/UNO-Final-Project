import { findAllTrackings } from '../../services/statsService.js';

export const responseTimes = async (req, res, next) => {
  try {
    const trackings = await findAllTrackings();

    const responseTimes = trackings.reduce((acc, tracking) => {
      if (!acc[tracking.endpointAccess]) {
        acc[tracking.endpointAccess] = {
          avg: 0,
          min: tracking.responseTimeMin,
          max: tracking.responseTimeMax,
        };
      }

      acc[tracking.endpointAccess].avg =
        (acc[tracking.endpointAccess].avg * (tracking.requestCount - 1) + tracking.responseTimeAvg) /
        tracking.requestCount;
      acc[tracking.endpointAccess].min = Math.min(acc[tracking.endpointAccess].min, tracking.responseTimeMin);
      acc[tracking.endpointAccess].max = Math.max(acc[tracking.endpointAccess].max, tracking.responseTimeMax);

      return acc;
    }, {});

    res.json(responseTimes);
  } catch (error) {
    next()
  }
};
