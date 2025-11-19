import { Request, Response } from 'express';
import * as metricsService from '../services/metrics.service';
import { z } from 'zod';

const updateMetricsSchema = z.object({
  shutdownComplete: z.boolean().optional(),
  deepHours: z.number().int().min(0).max(24).optional(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, { message: 'Date must be in YYYY-MM-DD format' }),
});

export const getMetricsController = async (req: Request, res: Response): Promise<void> => {
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

    const metrics = await metricsService.getMetricsByDate(req.user.id, date);
    res.json({
      metrics: metrics || {
        shutdownComplete: false,
        deepHours: 0,
        date,
      },
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to fetch metrics' });
  }
};

export const upsertMetricsController = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Not authenticated' });
      return;
    }

    const validatedData = updateMetricsSchema.parse(req.body);
    const { date, ...updates } = validatedData;
    const metrics = await metricsService.upsertMetrics(req.user.id, date, updates);
    res.json({ metrics });
  } catch (error: any) {
    if (error.name === 'ZodError') {
      res.status(400).json({ error: error.errors[0].message });
      return;
    }
    res.status(500).json({ error: error.message || 'Failed to save metrics' });
  }
};

