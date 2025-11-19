const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

/**
 * API utility functions
 */
class ApiClient {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  /**
   * Get auth token from localStorage or cookie
   */
  getToken() {
    return localStorage.getItem('token') || null;
  }

  /**
   * Set auth token
   */
  setToken(token) {
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }
  }

  /**
   * Make API request
   */
  async request(endpoint, options = {}) {
    const token = this.getToken();
    const url = `${this.baseURL}${endpoint}`;

    const config = {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      credentials: 'include', // Include cookies
    };

    try {
      const response = await fetch(url, config);
      
      // Check if response has content before parsing JSON
      const contentType = response.headers.get('content-type');
      let data;
      
      if (contentType && contentType.includes('application/json')) {
        const text = await response.text();
        try {
          data = text ? JSON.parse(text) : {};
        } catch (parseError) {
          throw new Error(`Invalid JSON response: ${text.substring(0, 100)}`);
        }
      } else {
        data = {};
      }

      if (!response.ok) {
        const errorMessage = data?.error || data?.message || `Request failed with status ${response.status}`;
        throw new Error(errorMessage);
      }

      return data;
    } catch (error) {
      // Re-throw with more context if it's not already an Error
      if (error instanceof Error) {
        throw error;
      }
      throw new Error(String(error));
    }
  }

  // Auth endpoints
  async signup(name, email, password) {
    const data = await this.request('/auth/signup', {
      method: 'POST',
      body: JSON.stringify({ name, email, password }),
    });
    if (data.token) {
      this.setToken(data.token);
    }
    return data;
  }

  async login(email, password) {
    const data = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    if (data.token) {
      this.setToken(data.token);
    }
    return data;
  }

  async logout() {
    await this.request('/auth/logout', {
      method: 'POST',
    });
    this.setToken(null);
  }

  async getCurrentUser() {
    return this.request('/auth/me');
  }

  // Tasks endpoints
  async getTasks(date) {
    const data = await this.request(`/tasks?date=${date}`);
    return data.tasks || [];
  }

  async createTask(task) {
    const data = await this.request('/tasks', {
      method: 'POST',
      body: JSON.stringify(task),
    });
    return data.task;
  }

  async updateTask(id, updates) {
    const data = await this.request(`/tasks/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
    return data.task;
  }

  async deleteTask(id) {
    await this.request(`/tasks/${id}`, {
      method: 'DELETE',
    });
  }

  // Notes endpoints
  async getNote(date) {
    const data = await this.request(`/notes?date=${date}`);
    return data.note?.content || '';
  }

  async saveNote(date, content) {
    const data = await this.request('/notes', {
      method: 'POST',
      body: JSON.stringify({ date, content }),
    });
    return data.note;
  }

  // Metrics endpoints
  async getMetrics(date) {
    const data = await this.request(`/metrics?date=${date}`);
    return data.metrics || { shutdownComplete: false, deepHours: 0 };
  }

  async updateMetrics(date, updates) {
    const data = await this.request('/metrics', {
      method: 'POST',
      body: JSON.stringify({ date, ...updates }),
    });
    return data.metrics;
  }

  // Events endpoints
  async getEvents(date) {
    const data = await this.request(`/events?date=${date}`);
    return data.events || [];
  }

  async createEvent(event) {
    const data = await this.request('/events', {
      method: 'POST',
      body: JSON.stringify(event),
    });
    return data.event;
  }

  async updateEvent(id, updates) {
    const data = await this.request(`/events/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
    return data.event;
  }

  async deleteEvent(id) {
    await this.request(`/events/${id}`, {
      method: 'DELETE',
    });
  }
}

export const api = new ApiClient();

