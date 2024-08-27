import { findAllTrackings } from '../../services/statsService.js';

export const popularEndpoints = async (req, res, next) => {
  try {
    const trackings = await findAllTrackings.findAll();

    let mostPopular = { endpointAccess: '', requestCount: 0 };

    trackings.forEach((tracking) => {
      if (tracking.requestCount > mostPopular.requestCount) {
        mostPopular = {
          endpointAccess: tracking.endpointAccess,
          requestCount: tracking.requestCount,
        };
      }
    });

    res.json(mostPopular);
  } catch (error) {
    next()
  }
};
