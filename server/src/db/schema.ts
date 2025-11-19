import {
  pgTable,
  uuid,
  varchar,
  boolean,
  timestamp,
  integer,
  text,
  date,
  time,
  check,
  uniqueIndex,
  index,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// ============================================
// USERS TABLE
// ============================================
export const users = pgTable(
  'users',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    name: varchar('name', { length: 255 }),
    email: varchar('email', { length: 255 }).notNull().unique(),
    passwordHash: varchar('password_hash', { length: 255 }),
    emailVerified: boolean('email_verified').default(false).notNull(),
    googleId: varchar('google_id', { length: 255 }).unique(),
    githubId: varchar('github_id', { length: 255 }).unique(),
    isActive: boolean('is_active').default(true).notNull(),
    lastLoginAt: timestamp('last_login_at', { withTimezone: true }),
    createdAt: timestamp('created_at', { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => ({
    emailIdx: index('idx_users_email').on(table.email),
    googleIdIdx: index('idx_users_google_id').on(table.googleId),
    githubIdIdx: index('idx_users_github_id').on(table.githubId),
  })
);

// ============================================
// TASKS TABLE
// ============================================
export const tasks = pgTable(
  'tasks',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    title: varchar('title', { length: 255 }).notNull(),
    description: text('description'),
    completed: boolean('completed').default(false).notNull(),
    date: date('date', { mode: 'string' }).notNull(),
    createdAt: timestamp('created_at', { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => ({
    userDateIdx: index('idx_tasks_user_date').on(table.userId, table.date),
    userIdIdx: index('idx_tasks_user_id').on(table.userId),
    dateIdx: index('idx_tasks_date').on(table.date),
  })
);

// ============================================
// NOTES TABLE
// ============================================
export const notes = pgTable(
  'notes',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    content: text('content').notNull(),
    date: date('date', { mode: 'string' }).notNull(),
    createdAt: timestamp('created_at', { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => ({
    userDateIdx: uniqueIndex('idx_notes_user_date_unique').on(
      table.userId,
      table.date
    ),
    userIdIdx: index('idx_notes_user_id').on(table.userId),
    dateIdx: index('idx_notes_date').on(table.date),
  })
);

// ============================================
// DAILY METRICS TABLE
// ============================================
export const dailyMetrics = pgTable(
  'daily_metrics',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    date: date('date', { mode: 'string' }).notNull(),
    shutdownComplete: boolean('shutdown_complete').default(false).notNull(),
    deepHours: integer('deep_hours').default(0).notNull(),
    createdAt: timestamp('created_at', { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => ({
    userDateIdx: uniqueIndex('idx_daily_metrics_user_date_unique').on(
      table.userId,
      table.date
    ),
    userIdIdx: index('idx_daily_metrics_user_id').on(table.userId),
    dateIdx: index('idx_daily_metrics_date').on(table.date),
  })
);

// ============================================
// EVENTS TABLE
// ============================================
export const events = pgTable(
  'events',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    title: varchar('title', { length: 255 }).notNull(),
    startTime: time('start_time').notNull(),
    endTime: time('end_time').notNull(),
    date: date('date', { mode: 'string' }).notNull(),
    resourceId: varchar('resource_id', { length: 50 }).notNull(),
    color: varchar('color', { length: 100 }).notNull(),
    isCrossedOff: boolean('is_crossed_off').default(false).notNull(),
    isEditable: boolean('is_editable').default(true).notNull(),
    createdAt: timestamp('created_at', { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => ({
    userDateIdx: index('idx_events_user_date').on(table.userId, table.date),
    userResourceIdx: index('idx_events_user_resource').on(
      table.userId,
      table.resourceId
    ),
    dateIdx: index('idx_events_date').on(table.date),
  })
);

// ============================================
// REPLAN HISTORY TABLE
// ============================================
export const replanHistory = pgTable(
  'replan_history',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    date: date('date', { mode: 'string' }).notNull(),
    resourceId: varchar('resource_id', { length: 50 }).notNull(),
    replanTime: time('replan_time').notNull(),
    previousResourceId: varchar('previous_resource_id', {
      length: 50,
    }).notNull(),
    createdAt: timestamp('created_at', { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => ({
    userDateIdx: index('idx_replan_user_date').on(table.userId, table.date),
    dateIdx: index('idx_replan_date').on(table.date),
  })
);

// ============================================
// RELATIONS
// ============================================
export const usersRelations = relations(users, ({ many }) => ({
  tasks: many(tasks),
  notes: many(notes),
  dailyMetrics: many(dailyMetrics),
  events: many(events),
  replanHistory: many(replanHistory),
}));

export const tasksRelations = relations(tasks, ({ one }) => ({
  user: one(users, {
    fields: [tasks.userId],
    references: [users.id],
  }),
}));

export const notesRelations = relations(notes, ({ one }) => ({
  user: one(users, {
    fields: [notes.userId],
    references: [users.id],
  }),
}));

export const dailyMetricsRelations = relations(dailyMetrics, ({ one }) => ({
  user: one(users, {
    fields: [dailyMetrics.userId],
    references: [users.id],
  }),
}));

export const eventsRelations = relations(events, ({ one }) => ({
  user: one(users, {
    fields: [events.userId],
    references: [users.id],
  }),
}));

export const replanHistoryRelations = relations(replanHistory, ({ one }) => ({
  user: one(users, {
    fields: [replanHistory.userId],
    references: [users.id],
  }),
}));
