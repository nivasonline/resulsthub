import api from './api';

export const analyticsService = {
  getOverview: async () => {
    const { data } = await api.get('/admin/analytics/overview');
    return data.data;
  },
  getDepartmentStats: async () => {
    const { data } = await api.get('/admin/analytics/department-stats');
    return data.data;
  },
  getSemesterStats: async () => {
    const { data } = await api.get('/admin/analytics/semester-stats');
    return data.data;
  },
  getToppers: async (params) => {
    const { data } = await api.get('/admin/analytics/toppers', { params });
    return data.data;
  },
};
