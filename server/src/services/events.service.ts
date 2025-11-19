import { db } from '../db';
import { events } from '../db/schema';
import { eq, and } from 'drizzle-orm';

export interface CreateEventData {
  title: string;
  startTime: string;
  endTime: string;
  date: string;
  resourceId: string;
  color: string;
  isCrossedOff?: boolean;
  isEditable?: boolean;
}

export interface UpdateEventData {
  title?: string;
  startTime?: string;
  endTime?: string;
  resourceId?: string;
  color?: string;
  isCrossedOff?: boolean;
  isEditable?: boolean;
}

/**
 * Get all events for a user on a specific date
 */
export const getEventsByDate = async (userId: string, date: string) => {
  return db
    .select()
    .from(events)
    .where(and(eq(events.userId, userId), eq(events.date, date)))
    .orderBy(events.startTime);
};

/**
 * Create a new event
 */
export const createEvent = async (userId: string, data: CreateEventData) => {
  const [newEvent] = await db
    .insert(events)
    .values({
      userId,
      title: data.title,
      startTime: data.startTime,
      endTime: data.endTime,
      date: data.date,
      resourceId: data.resourceId,
      color: data.color,
      isCrossedOff: data.isCrossedOff || false,
      isEditable: data.isEditable !== undefined ? data.isEditable : true,
    })
    .returning();

  return newEvent;
};

/**
 * Update an event
 */
export const updateEvent = async (userId: string, eventId: string, data: UpdateEventData) => {
  const [updatedEvent] = await db
    .update(events)
    .set({
      ...data,
      updatedAt: new Date(),
    })
    .where(and(eq(events.id, eventId), eq(events.userId, userId)))
    .returning();

  if (!updatedEvent) {
    throw new Error('Event not found');
  }

  return updatedEvent;
};

/**
 * Delete an event
 */
export const deleteEvent = async (userId: string, eventId: string) => {
  const [deletedEvent] = await db
    .delete(events)
    .where(and(eq(events.id, eventId), eq(events.userId, userId)))
    .returning();

  if (!deletedEvent) {
    throw new Error('Event not found');
  }

  return deletedEvent;
};

