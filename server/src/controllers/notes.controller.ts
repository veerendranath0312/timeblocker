import { Request, Response } from 'express';
import * as notesService from '../services/notes.service';
import { z } from 'zod';

const upsertNoteSchema = z.object({
  content: z.string(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, { message: 'Date must be in YYYY-MM-DD format' }),
});

export const getNoteController = async (req: Request, res: Response): Promise<void> => {
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

    const note = await notesService.getNoteByDate(req.user.id, date);
    res.json({ note: note || { content: '', date } });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to fetch note' });
  }
};

export const upsertNoteController = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Not authenticated' });
      return;
    }

    const validatedData = upsertNoteSchema.parse(req.body);
    const note = await notesService.upsertNote(req.user.id, validatedData.date, validatedData.content);
    res.json({ note });
  } catch (error: any) {
    if (error.name === 'ZodError') {
      res.status(400).json({ error: error.errors[0].message });
      return;
    }
    res.status(500).json({ error: error.message || 'Failed to save note' });
  }
};

