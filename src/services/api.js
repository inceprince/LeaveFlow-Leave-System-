import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

/* ========================
   REQUEST INTERCEPTOR
======================== */
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

/* ========================
   RESPONSE INTERCEPTOR
======================== */
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

/* ========================
   AUTH SERVICE
======================== */
export const authService = {
  login: (email, password) =>
    api.post('/auth/login', { email, password }),

  register: (name, email, password, department) =>
    api.post('/auth/register', { name, email, password, department }),
};

/* ========================
   USER SERVICE
======================== */
export const userService = {
  applyLeave: (leaveData) =>
    api.post('/v1/user/leaves', leaveData),

  getMyLeaves: () =>
    api.get('/v1/user/leaves/my'),

  updateProfile: (profileData) =>
    api.put('/v1/user/profile', profileData),

  changePassword: (passwordData) =>
    api.patch('/v1/user/change-password', passwordData),
};

/* ========================
   MANAGER SERVICE
======================== */
export const managerService = {
  // Leaves
  getPendingLeaves: () =>
    api.get('/manager/leaves'),

  getAllLeaves: () =>
    api.get('/manager/leaves/all'),

  filterLeavesEnhanced: (params) =>
    api.get('/manager/leaves/enhanced-filter', { params }),

  approveLeave: (id, comment = '') =>
    api.put(`/manager/leaves/${id}/approve`, { comment }),

  rejectLeave: (id, comment = '') =>
    api.put(`/manager/leaves/${id}/reject`, { comment }),

  // Users
  getAllUsers: () =>
    api.get('/manager/users'),

  filterUsers: (params) =>
    api.get('/manager/users/filter', { params }),

  filterUsersEnhanced: (params) =>
    api.get('/manager/users/enhanced-filter', { params }),

  getUserStats: () =>
    api.get('/manager/users/stats'),

  // User Leaves
  getUserLeaves: (userId) =>
    api.get(`/manager/users/${userId}/leaves`),

  getUserLeavesByFilter: (userId, params) =>
    api.get(`/manager/users/${userId}/leaves/filter`, { params }),

  getUserLeavesByStatus: (userId, status) =>
    api.get(`/manager/users/${userId}/leaves/status`, { params: { status } }),
};

export default api;
