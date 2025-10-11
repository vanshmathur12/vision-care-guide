export const queryKeys = {
  auth: {
    user: ['auth', 'user'] as const,
  },
  catalog: {
    doctors: (params?: Record<string, any>) => ['catalog', 'doctors', params] as const,
    doctor: (id: string) => ['catalog', 'doctor', id] as const,
    hospitals: (params?: Record<string, any>) => ['catalog', 'hospitals', params] as const,
    hospital: (id: string) => ['catalog', 'hospital', id] as const,
    cities: ['catalog', 'cities'] as const,
    specializations: ['catalog', 'specializations'] as const,
  },
  appointments: {
    my: ['appointments', 'my'] as const,
  },
  documents: {
    my: ['documents', 'my'] as const,
  },
};
