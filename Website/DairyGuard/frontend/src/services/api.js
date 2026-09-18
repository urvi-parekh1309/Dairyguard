/**
 * Centralized API Service for DairyGuard
 * Manages all backend HTTP requests, Bearer token injection, and response parsing.
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

/**
 * Core fetch wrapper with automatic JWT token attachment and error extraction
 */
async function request(endpoint, options = {}) {
  const token = localStorage.getItem('dairyguard_token');
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {})
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const config = {
    ...options,
    headers
  };

  if (options.body && typeof options.body === 'object' && !(options.body instanceof FormData)) {
    config.body = JSON.stringify(options.body);
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

    // Handle PDF or blob downloads
    if (response.headers.get('content-type')?.includes('application/pdf')) {
      if (!response.ok) {
        throw new Error('Failed to generate PDF document');
      }
      return response.blob();
    }

    const json = await response.json().catch(() => ({}));

    if (!response.ok) {
      const message = json.message || `Request failed with status ${response.status}`;
      const error = new Error(message);
      error.status = response.status;
      error.errors = json.errors || null;
      throw error;
    }

    return json.data;
  } catch (err) {
    console.error(`[API Error] ${endpoint}:`, err);
    throw err;
  }
}

// Domain API client modules
export const api = {
  // --- Authentication ---
  auth: {
    signup: (data) => request('/auth/signup', { method: 'POST', body: data }),
    login: (credentials) => request('/auth/login', { method: 'POST', body: credentials }),
    logout: () => {
      localStorage.removeItem('dairyguard_token');
      localStorage.removeItem('dairyguard_user');
      return request('/auth/logout', { method: 'POST' }).catch(() => {});
    },
    forgotPassword: (email) => request('/auth/forgot-password', { method: 'POST', body: { email } }),
    resetPassword: (payload) => request('/auth/reset-password', { method: 'POST', body: payload })
  },

  // --- User Profile & Dairy Cooperative ---
  user: {
    getProfile: () => request('/user/profile'),
    updateProfile: (data) => request('/user/profile', { method: 'PUT', body: data }),
    getDairyProfile: () => request('/user/dairy'),
    updateDairyProfile: (data) => request('/user/dairy', { method: 'PUT', body: data })
  },

  // --- Subscriptions ---
  subscriptions: {
    getPlans: () => request('/subscriptions/plans'),
    getCurrent: () => request('/subscriptions/current'),
    selectPlan: (planId) => request('/subscriptions/select', { method: 'POST', body: { planId } })
  },

  // --- Transport Vehicles ---
  vehicles: {
    getAll: () => request('/vehicles'),
    getById: (id) => request(`/vehicles/${id}`),
    create: (vehicleData) => request('/vehicles', { method: 'POST', body: vehicleData }),
    update: (id, updateData) => request(`/vehicles/${id}`, { method: 'PUT', body: updateData }),
    delete: (id) => request(`/vehicles/${id}`, { method: 'DELETE' }),
    assignBatch: (vehicleId, batchId) => request(`/vehicles/${vehicleId}/assign-batch`, { method: 'POST', body: { batchId } })
  },

  // --- Milk Batches ---
  batches: {
    getAll: () => request('/batches'),
    getById: (id) => request(`/batches/${id}`),
    create: (batchData) => request('/batches', { method: 'POST', body: batchData }),
    update: (id, updateData) => request(`/batches/${id}`, { method: 'PUT', body: updateData }),
    delete: (id) => request(`/batches/${id}`, { method: 'DELETE' })
  },

  // --- Sensor Telemetry (IoT / ESP32) ---
  sensors: {
    ingestReading: (reading) => request('/sensors/reading', { method: 'POST', body: reading }),
    getLatest: (filter = {}) => {
      const params = new URLSearchParams(filter).toString();
      return request(`/sensors/latest${params ? `?${params}` : ''}`);
    },
    getHistory: (filter = {}) => {
      const params = new URLSearchParams(filter).toString();
      return request(`/sensors/history${params ? `?${params}` : ''}`);
    }
  },

  // --- Spoilage Prediction ---
  prediction: {
    evaluate: (parameters) => request('/prediction/evaluate', { method: 'POST', body: parameters })
  },

  // --- Analytics ---
  analytics: {
    getMetrics: (filter = {}) => {
      const params = new URLSearchParams(filter).toString();
      return request(`/analytics${params ? `?${params}` : ''}`);
    },
    getBatchAnalytics: (batchId) => request(`/analytics/batch/${batchId}`),
    getVehicleAnalytics: (vehicleId) => request(`/analytics/vehicle/${vehicleId}`)
  },

  // --- Reports & PDF Streaming ---
  reports: {
    generate: (reportParams) => request('/reports/generate', { method: 'POST', body: reportParams }),
    getAll: () => request('/reports'),
    getById: (id) => request(`/reports/${id}`),
    downloadPDF: async (reportId, filename = 'DairyGuard_Report.pdf') => {
      const blob = await request(`/reports/${reportId}/pdf`);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    }
  }
};

export default api;
