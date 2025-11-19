import { create } from 'zustand';

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

  // Actions
  setCurrentDate: (date) => {
    set({ currentDate: date });
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

  addTask: (date, task) => {
    const dateString = getDateString(date);
    set((state) => {
      const existingTasks = state.tasksByDate[dateString] || [];
      const newTask = {
        ...task,
        id: task.id || crypto.randomUUID(),
        date: dateString,
      };
      return {
        tasksByDate: {
          ...state.tasksByDate,
          [dateString]: [...existingTasks, newTask],
        },
      };
    });
  },

  updateTask: (date, taskId, updates) => {
    const dateString = getDateString(date);
    set((state) => {
      const existingTasks = state.tasksByDate[dateString] || [];
      return {
        tasksByDate: {
          ...state.tasksByDate,
          [dateString]: existingTasks.map((task) =>
            task.id === taskId ? { ...task, ...updates } : task
          ),
        },
      };
    });
  },

  deleteTask: (date, taskId) => {
    const dateString = getDateString(date);
    set((state) => {
      const existingTasks = state.tasksByDate[dateString] || [];
      return {
        tasksByDate: {
          ...state.tasksByDate,
          [dateString]: existingTasks.filter((task) => task.id !== taskId),
        },
      };
    });
  },

  // Notes
  getNoteForDate: (date) => {
    const dateString = getDateString(date);
    const state = get();
    return state.notesByDate[dateString] || '';
  },

  setNoteForDate: (date, content) => {
    const dateString = getDateString(date);
    set((state) => ({
      notesByDate: {
        ...state.notesByDate,
        [dateString]: content,
      },
    }));
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

  updateDailyMetricsForDate: (date, updates) => {
    const dateString = getDateString(date);
    set((state) => {
      const current = state.dailyMetricsByDate[dateString] || {
        shutdownComplete: false,
        deepHours: 0,
      };
      return {
        dailyMetricsByDate: {
          ...state.dailyMetricsByDate,
          [dateString]: { ...current, ...updates },
        },
      };
    });
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

  addEvent: (date, event) => {
    const dateString = getDateString(date);
    set((state) => {
      const existingEvents = state.eventsByDate[dateString] || [];
      const newEvent = {
        ...event,
        id: event.id || crypto.randomUUID(),
        date: dateString,
      };
      return {
        eventsByDate: {
          ...state.eventsByDate,
          [dateString]: [...existingEvents, newEvent],
        },
      };
    });
  },

  updateEvent: (date, eventId, updates) => {
    const dateString = getDateString(date);
    set((state) => {
      const existingEvents = state.eventsByDate[dateString] || [];
      return {
        eventsByDate: {
          ...state.eventsByDate,
          [dateString]: existingEvents.map((event) =>
            event.id === eventId ? { ...event, ...updates } : event
          ),
        },
      };
    });
  },

  deleteEvent: (date, eventId) => {
    const dateString = getDateString(date);
    set((state) => {
      const existingEvents = state.eventsByDate[dateString] || [];
      return {
        eventsByDate: {
          ...state.eventsByDate,
          [dateString]: existingEvents.filter((event) => event.id !== eventId),
        },
      };
    });
  },
}));
