import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { authApi } from '@/lib/api/auth';
import { queryKeys } from '@/lib/utils/queryKeys';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

export function useSignup() {
  const navigate = useNavigate();
  
  return useMutation({
    mutationFn: authApi.signup,
    onSuccess: () => {
      toast.success('Account created successfully! Please sign in.');
      navigate('/auth');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Signup failed');
    },
  });
}

export function useSignin() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: authApi.signin,
    onSuccess: (data) => {
      queryClient.setQueryData(queryKeys.auth.user, data.user);
      toast.success('Signed in successfully');
      navigate('/book');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Sign in failed');
    },
  });
}

export function useLogout() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  
  return () => {
    authApi.logout();
    queryClient.clear();
    navigate('/auth');
    toast.success('Logged out successfully');
  };
}

export function useAuthUser() {
  return useQuery({
    queryKey: queryKeys.auth.user,
    queryFn: () => authApi.getUser(),
    staleTime: Infinity,
    initialData: authApi.getUser(),
  });
}
