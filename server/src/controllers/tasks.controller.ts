import { Request, Response } from 'express';
import * as tasksService from '../services/tasks.service';
import { z } from 'zod';

const createTaskSchema = z.object({
  title: z.string().min(1, { message: 'Title is required' }),
  description: z.string().optional(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, { message: 'Date must be in YYYY-MM-DD format' }),
  completed: z.boolean().optional(),
});

const updateTaskSchema = z.object({
  title: z.string().min(1).optional(),
  description: z.string().optional(),
  completed: z.boolean().optional(),
});

export const getTasksController = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Not authenticated' });
      return;
    }

    const { date } = req.query;
    if (!date || typeof date !== 'string') {
      res.status(400).json({ error: 'Date query parameter is required' });
      return;
    }

    const tasks = await tasksService.getTasksByDate(req.user.id, date);
    res.json({ tasks });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to fetch tasks' });
  }
};

export const createTaskController = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Not authenticated' });
      return;
    }

    const validatedData = createTaskSchema.parse(req.body);
    const task = await tasksService.createTask(req.user.id, validatedData);
    res.status(201).json({ task });
  } catch (error: any) {
    if (error.name === 'ZodError') {
      res.status(400).json({ error: error.errors[0].message });
      return;
    }
    res.status(500).json({ error: error.message || 'Failed to create task' });
  }
};

export const updateTaskController = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Not authenticated' });
      return;
    }

    const { id } = req.params;
    const validatedData = updateTaskSchema.parse(req.body);
    const task = await tasksService.updateTask(req.user.id, id, validatedData);
    res.json({ task });
  } catch (error: any) {
    if (error.name === 'ZodError') {
      res.status(400).json({ error: error.errors[0].message });
      return;
    }
    res.status(500).json({ error: error.message || 'Failed to update task' });
  }
};

export const deleteTaskController = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Not authenticated' });
      return;
    }

    const { id } = req.params;
    await tasksService.deleteTask(req.user.id, id);
    res.json({ message: 'Task deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to delete task' });
  }
};

