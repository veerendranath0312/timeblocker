import { db } from '../db';
import { notes } from '../db/schema';
import { eq, and } from 'drizzle-orm';

/**
 * Get note for a user on a specific date
 */
export const getNoteByDate = async (userId: string, date: string) => {
  const [note] = await db
    .select()
    .from(notes)
    .where(and(eq(notes.userId, userId), eq(notes.date, date)))
    .limit(1);

  return note || null;
};

/**
 * Create or update a note
 */
export const upsertNote = async (userId: string, date: string, content: string) => {
  const existing = await getNoteByDate(userId, date);

  if (existing) {
    const [updatedNote] = await db
      .update(notes)
      .set({
        content,
        updatedAt: new Date(),
      })
      .where(eq(notes.id, existing.id))
      .returning();

    return updatedNote;
  } else {
    const [newNote] = await db
      .insert(notes)
      .values({
        userId,
        date,
        content,
      })
      .returning();

    return newNote;
  }
};

