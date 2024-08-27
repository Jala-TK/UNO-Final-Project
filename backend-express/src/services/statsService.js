import Tracking from '../models/tracking.js';

export const findAllTrackings = async () => {
  return await Tracking.findAll();
}