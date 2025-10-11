import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { appointmentsApi, BookAppointmentPayload } from '@/lib/api/appointments';
import { queryKeys } from '@/lib/utils/queryKeys';
import { toast } from 'sonner';

export function useBookAppointment() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (payload: BookAppointmentPayload) => appointmentsApi.bookAppointment(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.appointments.my });
      toast.success('Appointment booked successfully!');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to book appointment');
    },
  });
}

export function useMyAppointments() {
  return useQuery({
    queryKey: queryKeys.appointments.my,
    queryFn: () => appointmentsApi.getMyAppointments(),
  });
}

export function useCancelAppointment() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => appointmentsApi.cancelAppointment(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.appointments.my });
      toast.success('Appointment cancelled');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to cancel appointment');
    },
  });
}
