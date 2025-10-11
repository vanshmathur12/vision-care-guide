import { http } from './http';
import { Doctor, Hospital, City, Specialization } from './types';

export const catalogApi = {
  getDoctors: async (params?: Record<string, any>): Promise<Doctor[]> => {
    const { data } = await http.get('/doctors', { params });
    return data;
  },

  getDoctor: async (id: string): Promise<Doctor> => {
    const { data } = await http.get(`/doctors/${id}`);
    return data;
  },

  getHospitals: async (params?: Record<string, any>): Promise<Hospital[]> => {
    const { data } = await http.get('/hospitals', { params });
    return data;
  },

  getHospital: async (id: string): Promise<Hospital> => {
    const { data } = await http.get(`/hospitals/${id}`);
    return data;
  },

  getCities: async (): Promise<City[]> => {
    const { data } = await http.get('/cities');
    return data;
  },

  getSpecializations: async (): Promise<Specialization[]> => {
    const { data } = await http.get('/specializations');
    return data;
  },
};
