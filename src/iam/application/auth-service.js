import { apiClient } from '../infrastructure/api-client';

export const authService = {
  async login(email, password) {
    const data = await apiClient.login(email, password);
    if (data.token) {
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
    }
    return data;
  },

  async register(email, password, full_name) {
    const data = await apiClient.register(email, password, full_name);
    return data;
  },

  async updateProfile(email, password) {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('No token found');

    const data = await apiClient.updateProfile(token, email, password);
    localStorage.setItem('user', JSON.stringify(data));
    return data;
  },

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  getToken() {
    return localStorage.getItem('token');
  },

  getUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  isAuthenticated() {
    return !!this.getToken();
  },
};
