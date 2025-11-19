import { Request, Response } from 'express';
import * as eventsService from '../services/events.service';
import { z } from 'zod';

const createEventSchema = z.object({
  title: z.string().min(1, { message: 'Title is required' }),
  startTime: z.string().regex(/^\d{2}:\d{2}$/, { message: 'Start time must be in HH:MM format' }),
  endTime: z.string().regex(/^\d{2}:\d{2}$/, { message: 'End time must be in HH:MM format' }),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, { message: 'Date must be in YYYY-MM-DD format' }),
  resourceId: z.enum(['plan-a', 'plan-b', 'plan-c', 'plan-d']),
  color: z.string().min(1, { message: 'Color is required' }),
  isCrossedOff: z.boolean().optional(),
  isEditable: z.boolean().optional(),
});

const updateEventSchema = z.object({
  title: z.string().min(1).optional(),
  startTime: z.string().regex(/^\d{2}:\d{2}$/).optional(),
  endTime: z.string().regex(/^\d{2}:\d{2}$/).optional(),
  resourceId: z.enum(['plan-a', 'plan-b', 'plan-c', 'plan-d']).optional(),
  color: z.string().optional(),
  isCrossedOff: z.boolean().optional(),
  isEditable: z.boolean().optional(),
});

export const getEventsController = async (req: Request, res: Response): Promise<void> => {
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

    const events = await eventsService.getEventsByDate(req.user.id, date);
    res.json({ events });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to fetch events' });
  }
};

export const createEventController = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Not authenticated' });
      return;
    }

    const validatedData = createEventSchema.parse(req.body);
    const event = await eventsService.createEvent(req.user.id, validatedData);
    res.status(201).json({ event });
  } catch (error: any) {
    if (error.name === 'ZodError' && error.errors && error.errors.length > 0) {
      res.status(400).json({ error: error.errors[0].message });
      return;
    }
    if (error.name === 'ZodError') {
      res.status(400).json({ error: 'Invalid request data' });
      return;
    }
    console.error('Error creating event:', error);
    res.status(500).json({ error: error.message || 'Failed to create event' });
  }
};

export const updateEventController = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Not authenticated' });
      return;
    }

    const { id } = req.params;
    const validatedData = updateEventSchema.parse(req.body);
    const event = await eventsService.updateEvent(req.user.id, id, validatedData);
    res.json({ event });
  } catch (error: any) {
    if (error.name === 'ZodError' && error.errors && error.errors.length > 0) {
      res.status(400).json({ error: error.errors[0].message });
      return;
    }
    if (error.name === 'ZodError') {
      res.status(400).json({ error: 'Invalid request data' });
      return;
    }
    console.error('Error updating event:', error);
    res.status(500).json({ error: error.message || 'Failed to update event' });
  }
};

export const deleteEventController = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Not authenticated' });
      return;
    }

    const { id } = req.params;
    await eventsService.deleteEvent(req.user.id, id);
    res.json({ message: 'Event deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to delete event' });
  }
};


