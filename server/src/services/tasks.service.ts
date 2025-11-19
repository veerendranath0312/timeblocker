import { db } from '../db';
import { tasks } from '../db/schema';
import { eq, and } from 'drizzle-orm';

export interface CreateTaskData {
  title: string;
  description?: string;
  date: string;
  completed?: boolean;
}

export interface UpdateTaskData {
  title?: string;
  description?: string;
  completed?: boolean;
}

/**
 * Get all tasks for a user on a specific date
 */
export const getTasksByDate = async (userId: string, date: string) => {
  return db
    .select()
    .from(tasks)
    .where(and(eq(tasks.userId, userId), eq(tasks.date, date)))
    .orderBy(tasks.createdAt);
};

/**
 * Create a new task
 */
export const createTask = async (userId: string, data: CreateTaskData) => {
  const [newTask] = await db
    .insert(tasks)
    .values({
      userId,
      title: data.title,
      description: data.description || null,
      date: data.date,
      completed: data.completed || false,
    })
    .returning();

  return newTask;
};

/**
 * Update a task
 */
export const updateTask = async (userId: string, taskId: string, data: UpdateTaskData) => {
  const [updatedTask] = await db
    .update(tasks)
    .set({
      ...data,
      updatedAt: new Date(),
    })
    .where(and(eq(tasks.id, taskId), eq(tasks.userId, userId)))
    .returning();

  if (!updatedTask) {
    throw new Error('Task not found');
  }

  return updatedTask;
};

/**
 * Delete a task
 */
export const deleteTask = async (userId: string, taskId: string) => {
  const [deletedTask] = await db
    .delete(tasks)
    .where(and(eq(tasks.id, taskId), eq(tasks.userId, userId)))
    .returning();

  if (!deletedTask) {
    throw new Error('Task not found');
  }

  return deletedTask;
};

