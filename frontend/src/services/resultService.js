import api from './api';

export const resultService = {
  getByHallTicket: async (hallTicket) => {
    const { data } = await api.get(`/results/${encodeURIComponent(hallTicket)}`);
    return data.data;
  },
  getByRegNumber: async (regNumber) => {
    const { data } = await api.get(`/results/reg/${encodeURIComponent(regNumber)}`);
    return data.data;
  },
};
