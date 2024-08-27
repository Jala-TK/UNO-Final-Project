import express from 'express';
import { requests } from '../routes/stats/requests.js';
import { responseTimes } from '../routes/stats/responseTimes.js'
import { statusCodes } from '../routes/stats/statusCodes.js'
import { popularEndpoints } from '../routes/stats/popularEndpoints.js'

const router = express.Router();

router.get('/stats/requests', requests);
router.get('/stats/response-times', responseTimes);
router.get('/stats/status-codes', statusCodes);
router.get('/stats/popular-endpoints', popularEndpoints);

export default router;
