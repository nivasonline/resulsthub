import api from './api';

export const authService = {
  login: async (username, password) => {
    const { data } = await api.post('/admin/login', { username, password });
    return data.data; // { token, admin }
  },
  getMe: async () => {
    const { data } = await api.get('/admin/me');
    return data.data;
  },
};
