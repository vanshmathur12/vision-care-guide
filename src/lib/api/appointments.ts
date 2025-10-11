import { http } from './http';
import { Appointment, AppointmentSchema } from './types';

export interface BookAppointmentPayload {
  doctorId: string;
  hospitalId: string;
  hospitalGroupId?: string;
  cityId: string;
  date: string;
  time: string;
  reason?: string;
}

export const appointmentsApi = {
  bookAppointment: async (payload: BookAppointmentPayload): Promise<{ message: string; appointment: Appointment }> => {
    const { data } = await http.post('/book-appointment', payload);
    return {
      message: data.message,
      appointment: AppointmentSchema.parse(data.appointment),
    };
  },

  getMyAppointments: async (): Promise<Appointment[]> => {
    const { data } = await http.get('/my-appointments');
    return data.map((apt: any) => AppointmentSchema.parse(apt));
  },

  cancelAppointment: async (id: string): Promise<{ message: string; appointment: Appointment }> => {
    const { data } = await http.patch(`/cancel-appointment/${id}`);
    return {
      message: data.message,
      appointment: AppointmentSchema.parse(data.appointment),
    };
  },
};
