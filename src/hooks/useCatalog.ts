import { useQuery } from '@tanstack/react-query';
import { catalogApi } from '@/lib/api/catalog';
import { queryKeys } from '@/lib/utils/queryKeys';

export function useDoctors(params?: Record<string, any>) {
  return useQuery({
    queryKey: queryKeys.catalog.doctors(params),
    queryFn: () => catalogApi.getDoctors(params),
  });
}

export function useDoctor(id: string) {
  return useQuery({
    queryKey: queryKeys.catalog.doctor(id),
    queryFn: () => catalogApi.getDoctor(id),
    enabled: !!id,
  });
}

export function useHospitals(params?: Record<string, any>) {
  return useQuery({
    queryKey: queryKeys.catalog.hospitals(params),
    queryFn: () => catalogApi.getHospitals(params),
  });
}

export function useHospital(id: string) {
  return useQuery({
    queryKey: queryKeys.catalog.hospital(id),
    queryFn: () => catalogApi.getHospital(id),
    enabled: !!id,
  });
}

export function useCities() {
  return useQuery({
    queryKey: queryKeys.catalog.cities,
    queryFn: () => catalogApi.getCities(),
  });
}

export function useSpecializations() {
  return useQuery({
    queryKey: queryKeys.catalog.specializations,
    queryFn: () => catalogApi.getSpecializations(),
  });
}
