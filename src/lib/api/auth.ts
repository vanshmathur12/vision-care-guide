import { http } from './http';
import { SigninResponse, SigninResponseSchema, SignupResponse, SignupResponseSchema, User } from './types';

export const authApi = {
  signup: async (payload: { username: string; email: string; password: string; phone?: string }): Promise<SignupResponse> => {
    const { data } = await http.post('/signup', payload);
    return SignupResponseSchema.parse(data);
  },

  signin: async (payload: { email: string; password: string }): Promise<SigninResponse> => {
    const { data } = await http.post('/signin', payload);
    const validated = SigninResponseSchema.parse(data);
    
    // Save token and user to localStorage
    localStorage.setItem('auth_token', validated.token);
    localStorage.setItem('auth_user', JSON.stringify(validated.user));
    
    return validated;
  },

  getToken: (): string | null => {
    return localStorage.getItem('auth_token');
  },

  setToken: (token: string): void => {
    localStorage.setItem('auth_token', token);
  },

  clearToken: (): void => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
  },

  getUser: (): User | null => {
    const userStr = localStorage.getItem('auth_user');
    if (!userStr) return null;
    try {
      return JSON.parse(userStr);
    } catch {
      return null;
    }
  },

  logout: (): void => {
    authApi.clearToken();
  },
};
