import { create } from 'zustand';
import { persist } from 'zustand/middleware';

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

export const useDateStore = create(
  persist(
    (set, get) => ({
      // Current selected date
      currentDate: getToday(),

      // Data organized by date (YYYY-MM-DD)
      tasksByDate: {}, // { '2025-01-15': [{ id, title, description, completed, date }] }
      notesByDate: {}, // { '2025-01-15': 'markdown content' }
      dailyMetricsByDate: {}, // { '2025-01-15': { shutdownComplete: false, deepHours: 0 } }
      eventsByDate: {}, // { '2025-01-15': [{ id, title, startTime, endTime, resourceId, color, ... }] }

      // Loading states (mocked for compatibility)
      isLoading: {
        tasks: {},
        notes: {},
        metrics: {},
        events: {},
      },

      // Actions
      setCurrentDate: async (date) => {
        set({ currentDate: date });
        // No API calls needed, data is loaded from local state/storage
      },

      // Load data (Mocked - No API calls)
      loadTasks: async (dateString) => {
        // No-op
      },

      loadNote: async (dateString) => {
        // No-op
      },

      loadMetrics: async (dateString) => {
        // No-op
      },

      loadEvents: async (dateString) => {
        // No-op
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
        const newTask = {
          ...task,
          id: crypto.randomUUID(), // Local ID generation
          date: dateString,
        };

        set((state) => {
          const existingTasks = state.tasksByDate[dateString] || [];
          return {
            tasksByDate: {
              ...state.tasksByDate,
              [dateString]: [...existingTasks, newTask],
            },
          };
        });
      },

      updateTask: async (date, taskId, updates) => {
        const dateString = getDateString(date);
        set((state) => {
          const existingTasks = state.tasksByDate[dateString] || [];
          const updatedTasks = existingTasks.map((task) =>
            task.id === taskId ? { ...task, ...updates } : task
          );
          return {
            tasksByDate: {
              ...state.tasksByDate,
              [dateString]: updatedTasks,
            },
          };
        });
      },

      deleteTask: async (date, taskId) => {
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

      setNoteForDate: async (date, content) => {
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

      updateDailyMetricsForDate: async (date, updates) => {
        const dateString = getDateString(date);
        set((state) => {
          const currentMetrics =
            state.dailyMetricsByDate[dateString] || {
              shutdownComplete: false,
              deepHours: 0,
            };
          return {
            dailyMetricsByDate: {
              ...state.dailyMetricsByDate,
              [dateString]: { ...currentMetrics, ...updates },
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

      addEvent: async (date, event) => {
        const dateString = getDateString(date);
        const newEvent = {
          ...event,
          id: crypto.randomUUID(), // Local ID generation
          date: dateString,
        };

        set((state) => {
          const existingEvents = state.eventsByDate[dateString] || [];
          return {
            eventsByDate: {
              ...state.eventsByDate,
              [dateString]: [...existingEvents, newEvent],
            },
          };
        });
      },

      updateEvent: async (date, eventId, updates) => {
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

      deleteEvent: async (date, eventId) => {
        const dateString = getDateString(date);
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
      },
    }),
    {
      name: 'timeblocker-storage', // unique name
      partialize: (state) => ({
        tasksByDate: state.tasksByDate,
        notesByDate: state.notesByDate,
        dailyMetricsByDate: state.dailyMetricsByDate,
        eventsByDate: state.eventsByDate,
      }),
    }
  )
);
