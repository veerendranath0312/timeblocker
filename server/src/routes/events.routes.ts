import express, { Router } from 'express';
import {
  getEventsController,
  createEventController,
  updateEventController,
  deleteEventController,
} from '../controllers/events.controller';
import { authenticate } from '../middleware/auth.middleware';

const router: Router = express.Router();

// All routes require authentication
router.use(authenticate as express.RequestHandler);

router.get('/', getEventsController);
router.post('/', createEventController);
router.put('/:id', updateEventController);
router.delete('/:id', deleteEventController);

export default router;

