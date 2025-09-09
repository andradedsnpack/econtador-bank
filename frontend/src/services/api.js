import axios from 'axios';

const API_BASE_URL = 'http://localhost:3001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
};

export const accountAPI = {
  getAccounts: () => api.get('/accounts'),
  createAccount: (accountData) => api.post('/accounts', accountData),
  updateAccount: (id, accountData) => api.put(`/accounts/${id}`, accountData),
  deleteAccount: (id) => api.delete(`/accounts/${id}`),
  getBanks: () => api.get('/accounts/banks'),
};

export const transferAPI = {
  getTransfers: () => api.get('/transfers'),
  createTransfer: (transferData) => api.post('/transfers', transferData),
};

export const dashboardAPI = {
  getDashboard: () => api.get('/dashboard'),
};

export default api;