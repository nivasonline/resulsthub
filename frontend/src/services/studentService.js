import api from './api';

export const studentService = {
  list: async (params) => {
    const { data } = await api.get('/admin/students', { params });
    return data; // { data, pagination }
  },
  getById: async (id) => {
    const { data } = await api.get(`/admin/students/${id}`);
    return data.data;
  },
  create: async (payload) => {
    const { data } = await api.post('/admin/student', payload);
    return data.data;
  },
  update: async (id, payload) => {
    const { data } = await api.put(`/admin/student/${id}`, payload);
    return data.data;
  },
  remove: async (id) => {
    const { data } = await api.delete(`/admin/student/${id}`);
    return data;
  },
  togglePublish: async (id, published) => {
    const { data } = await api.patch(`/admin/student/${id}/publish`, { published });
    return data.data;
  },
  bulkPublish: async (ids, published) => {
    const { data } = await api.patch('/admin/students/publish-bulk', { ids, published });
    return data;
  },
  uploadExcel: async (file, onProgress) => {
    const formData = new FormData();
    formData.append('file', file);
    const { data } = await api.post('/admin/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress: (evt) => {
        if (onProgress) onProgress(Math.round((evt.loaded * 100) / evt.total));
      },
    });
    return data.data;
  },
};
