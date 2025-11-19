import express, { Router } from 'express';
import {
  getMetricsController,
  upsertMetricsController,
} from '../controllers/metrics.controller';
import { authenticate } from '../middleware/auth.middleware';

const router: Router = express.Router();

// All routes require authentication
router.use(authenticate as express.RequestHandler);

router.get('/', getMetricsController);
router.post('/', upsertMetricsController);
router.put('/', upsertMetricsController);

export default router;

