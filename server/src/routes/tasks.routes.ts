import express, { Router } from 'express';
import {
  getTasksController,
  createTaskController,
  updateTaskController,
  deleteTaskController,
} from '../controllers/tasks.controller';
import { authenticate } from '../middleware/auth.middleware';

const router: Router = express.Router();

// All routes require authentication
router.use(authenticate as express.RequestHandler);

router.get('/', getTasksController);
router.post('/', createTaskController);
router.put('/:id', updateTaskController);
router.delete('/:id', deleteTaskController);

export default router;

