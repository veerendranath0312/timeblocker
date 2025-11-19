import express, { Router } from 'express';
import {
  getNoteController,
  upsertNoteController,
} from '../controllers/notes.controller';
import { authenticate } from '../middleware/auth.middleware';

const router: Router = express.Router();

// All routes require authentication
router.use(authenticate as express.RequestHandler);

router.get('/', getNoteController);
router.post('/', upsertNoteController);
router.put('/', upsertNoteController);

export default router;

