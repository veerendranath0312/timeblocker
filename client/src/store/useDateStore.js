import { create } from 'zustand';
import { api } from '../lib/api';

// Helper to get date string in YYYY-MM-DD format
const getDateString = (date) => {
  return date.toISOString().split('T')[0];
};

// Helper to initialize date
const getToday = () => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return today;
};

export const useDateStore = create((set, get) => ({
  // Current selected date
  currentDate: getToday(),

  // Data organized by date (YYYY-MM-DD)
  tasksByDate: {}, // { '2025-01-15': [{ id, title, description, completed, date }] }
  notesByDate: {}, // { '2025-01-15': 'markdown content' }
  dailyMetricsByDate: {}, // { '2025-01-15': { shutdownComplete: false, deepHours: 0 } }
  eventsByDate: {}, // { '2025-01-15': [{ id, title, startTime, endTime, resourceId, color, ... }] }

  // Loading states
  isLoading: {
    tasks: {},
    notes: {},
    metrics: {},
    events: {},
  },

  // Actions
  setCurrentDate: async (date) => {
    set({ currentDate: date });
    const dateString = getDateString(date);

    // Load data for the new date
    await Promise.all([
      get().loadTasks(dateString),
      get().loadNote(dateString),
      get().loadMetrics(dateString),
      get().loadEvents(dateString),
    ]);
  },

  // Load data from API
  loadTasks: async (dateString) => {
    try {
      set((state) => ({
        isLoading: {
          ...state.isLoading,
          tasks: { ...state.isLoading.tasks, [dateString]: true },
        },
      }));

      const tasks = await api.getTasks(dateString);
      set((state) => ({
        tasksByDate: {
          ...state.tasksByDate,
          [dateString]: tasks,
        },
        isLoading: {
          ...state.isLoading,
          tasks: { ...state.isLoading.tasks, [dateString]: false },
        },
      }));
    } catch (error) {
      console.error('Failed to load tasks:', error);
      set((state) => ({
        isLoading: {
          ...state.isLoading,
          tasks: { ...state.isLoading.tasks, [dateString]: false },
        },
      }));
    }
  },

  loadNote: async (dateString) => {
    try {
      set((state) => ({
        isLoading: {
          ...state.isLoading,
          notes: { ...state.isLoading.notes, [dateString]: true },
        },
      }));

      const content = await api.getNote(dateString);
      set((state) => ({
        notesByDate: {
          ...state.notesByDate,
          [dateString]: content,
        },
        isLoading: {
          ...state.isLoading,
          notes: { ...state.isLoading.notes, [dateString]: false },
        },
      }));
    } catch (error) {
      console.error('Failed to load note:', error);
      set((state) => ({
        isLoading: {
          ...state.isLoading,
          notes: { ...state.isLoading.notes, [dateString]: false },
        },
      }));
    }
  },

  loadMetrics: async (dateString) => {
    try {
      set((state) => ({
        isLoading: {
          ...state.isLoading,
          metrics: { ...state.isLoading.metrics, [dateString]: true },
        },
      }));

      const metrics = await api.getMetrics(dateString);
      set((state) => ({
        dailyMetricsByDate: {
          ...state.dailyMetricsByDate,
          [dateString]: metrics,
        },
        isLoading: {
          ...state.isLoading,
          metrics: { ...state.isLoading.metrics, [dateString]: false },
        },
      }));
    } catch (error) {
      console.error('Failed to load metrics:', error);
      set((state) => ({
        isLoading: {
          ...state.isLoading,
          metrics: { ...state.isLoading.metrics, [dateString]: false },
        },
      }));
    }
  },

  loadEvents: async (dateString) => {
    try {
      set((state) => ({
        isLoading: {
          ...state.isLoading,
          events: { ...state.isLoading.events, [dateString]: true },
        },
      }));

      const events = await api.getEvents(dateString);
      set((state) => ({
        eventsByDate: {
          ...state.eventsByDate,
          [dateString]: events,
        },
        isLoading: {
          ...state.isLoading,
          events: { ...state.isLoading.events, [dateString]: false },
        },
      }));
    } catch (error) {
      console.error('Failed to load events:', error);
      set((state) => ({
        isLoading: {
          ...state.isLoading,
          events: { ...state.isLoading.events, [dateString]: false },
        },
      }));
    }
  },

  // Tasks
  getTasksForDate: (date) => {
    const dateString = getDateString(date);
    const state = get();
    return state.tasksByDate[dateString] || [];
  },

  setTasksForDate: (date, tasks) => {
    const dateString = getDateString(date);
    set((state) => ({
      tasksByDate: {
        ...state.tasksByDate,
        [dateString]: tasks,
      },
    }));
  },

  addTask: async (date, task) => {
    const dateString = getDateString(date);
    try {
      const newTask = await api.createTask({
        ...task,
        date: dateString,
      });
      set((state) => {
        const existingTasks = state.tasksByDate[dateString] || [];
        return {
          tasksByDate: {
            ...state.tasksByDate,
            [dateString]: [...existingTasks, newTask],
          },
        };
      });
    } catch (error) {
      console.error('Failed to create task:', error);
      throw error;
    }
  },

  updateTask: async (date, taskId, updates) => {
    const dateString = getDateString(date);
    try {
      const updatedTask = await api.updateTask(taskId, updates);
      set((state) => {
        const existingTasks = state.tasksByDate[dateString] || [];
        return {
          tasksByDate: {
            ...state.tasksByDate,
            [dateString]: existingTasks.map((task) =>
              task.id === taskId ? updatedTask : task
            ),
          },
        };
      });
    } catch (error) {
      console.error('Failed to update task:', error);
      throw error;
    }
  },

  deleteTask: async (date, taskId) => {
    const dateString = getDateString(date);
    try {
      await api.deleteTask(taskId);
      set((state) => {
        const existingTasks = state.tasksByDate[dateString] || [];
        return {
          tasksByDate: {
            ...state.tasksByDate,
            [dateString]: existingTasks.filter((task) => task.id !== taskId),
          },
        };
      });
    } catch (error) {
      console.error('Failed to delete task:', error);
      throw error;
    }
  },

  // Notes
  getNoteForDate: (date) => {
    const dateString = getDateString(date);
    const state = get();
    return state.notesByDate[dateString] || '';
  },

  setNoteForDate: async (date, content) => {
    const dateString = getDateString(date);
    try {
      await api.saveNote(dateString, content);
      set((state) => ({
        notesByDate: {
          ...state.notesByDate,
          [dateString]: content,
        },
      }));
    } catch (error) {
      console.error('Failed to save note:', error);
      throw error;
    }
  },

  // Daily Metrics
  getDailyMetricsForDate: (date) => {
    const dateString = getDateString(date);
    const state = get();
    return (
      state.dailyMetricsByDate[dateString] || {
        shutdownComplete: false,
        deepHours: 0,
      }
    );
  },

  setDailyMetricsForDate: (date, metrics) => {
    const dateString = getDateString(date);
    set((state) => ({
      dailyMetricsByDate: {
        ...state.dailyMetricsByDate,
        [dateString]: metrics,
      },
    }));
  },

  updateDailyMetricsForDate: async (date, updates) => {
    const dateString = getDateString(date);
    try {
      const updatedMetrics = await api.updateMetrics(dateString, updates);
      set((state) => ({
        dailyMetricsByDate: {
          ...state.dailyMetricsByDate,
          [dateString]: updatedMetrics,
        },
      }));
    } catch (error) {
      console.error('Failed to update metrics:', error);
      throw error;
    }
  },

  // Events
  getEventsForDate: (date) => {
    const dateString = getDateString(date);
    const state = get();
    return state.eventsByDate[dateString] || [];
  },

  setEventsForDate: (date, events) => {
    const dateString = getDateString(date);
    set((state) => ({
      eventsByDate: {
        ...state.eventsByDate,
        [dateString]: events,
      },
    }));
  },

  addEvent: async (date, event) => {
    const dateString = getDateString(date);
    try {
      const newEvent = await api.createEvent({
        ...event,
        date: dateString,
      });
      set((state) => {
        const existingEvents = state.eventsByDate[dateString] || [];
        return {
          eventsByDate: {
            ...state.eventsByDate,
            [dateString]: [...existingEvents, newEvent],
          },
        };
      });
    } catch (error) {
      console.error('Failed to create event:', error);
      throw error;
    }
  },

  updateEvent: async (date, eventId, updates) => {
    const dateString = getDateString(date);
    try {
      const updatedEvent = await api.updateEvent(eventId, updates);
      set((state) => {
        const existingEvents = state.eventsByDate[dateString] || [];
        return {
          eventsByDate: {
            ...state.eventsByDate,
            [dateString]: existingEvents.map((event) =>
              event.id === eventId ? updatedEvent : event
            ),
          },
        };
      });
    } catch (error) {
      console.error('Failed to update event:', error);
      throw error;
    }
  },

  deleteEvent: async (date, eventId) => {
    const dateString = getDateString(date);
    try {
      await api.deleteEvent(eventId);
      set((state) => {
        const existingEvents = state.eventsByDate[dateString] || [];
        return {
          eventsByDate: {
            ...state.eventsByDate,
            [dateString]: existingEvents.filter(
              (event) => event.id !== eventId
            ),
          },
        };
      });
    } catch (error) {
      console.error('Failed to delete event:', error);
      throw error;
    }
  },
}));
