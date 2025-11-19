import { db } from '../db';
import { dailyMetrics } from '../db/schema';
import { eq, and } from 'drizzle-orm';

export interface UpdateMetricsData {
  shutdownComplete?: boolean;
  deepHours?: number;
}

/**
 * Get daily metrics for a user on a specific date
 */
export const getMetricsByDate = async (userId: string, date: string) => {
  const [metrics] = await db
    .select()
    .from(dailyMetrics)
    .where(and(eq(dailyMetrics.userId, userId), eq(dailyMetrics.date, date)))
    .limit(1);

  return metrics || null;
};

/**
 * Create or update daily metrics
 */
export const upsertMetrics = async (userId: string, date: string, data: UpdateMetricsData) => {
  const existing = await getMetricsByDate(userId, date);

  if (existing) {
    const [updatedMetrics] = await db
      .update(dailyMetrics)
      .set({
        ...data,
        updatedAt: new Date(),
      })
      .where(eq(dailyMetrics.id, existing.id))
      .returning();

    return updatedMetrics;
  } else {
    const [newMetrics] = await db
      .insert(dailyMetrics)
      .values({
        userId,
        date,
        shutdownComplete: data.shutdownComplete || false,
        deepHours: data.deepHours || 0,
      })
      .returning();

    return newMetrics;
  }
};

