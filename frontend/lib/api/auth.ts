import { api } from '../api';
import { LoginResponse, RegisterResponse } from '@/types/api';
import { toast } from 'react-hot-toast';

export const authApi = {
  login: async (email: string, password: string) => {
    try {
      const response = await api.post<LoginResponse>('/auth/login', {
        email,
        password,
      });
      return response.data;
    } catch (error) {
      const message = error.response?.data?.detail || 'Login failed';
      toast.error(message);
      throw error;
    }
  },

  register: async (email: string, password: string, role: string) => {
    try {
      const response = await api.post<RegisterResponse>('/auth/register', {
        email,
        password,
        role,
      });
      return response.data;
    } catch (error) {
      const message = error.response?.data?.detail || 'Registration failed';
      toast.error(message);
      throw error;
    }
  },

  refreshToken: async () => {
    try {
      const response = await api.post('/auth/refresh');
      return response.data;
    } catch (error) {
      toast.error('Failed to refresh token');
      throw error;
    }
  },

  requestPasswordReset: async (email: string) => {
    try {
      await api.post('/auth/reset-password/request', { email });
    } catch (error) {
      toast.error('Failed to request password reset');
      throw error;
    }
  },

  resetPassword: async (token: string, newPassword: string) => {
    try {
      await api.post('/auth/reset-password/confirm', { token, newPassword });
    } catch (error) {
      toast.error('Failed to reset password');
      throw error;
    }
  },

  verify2FA: async (code: string) => {
    try {
      const response = await api.post('/auth/2fa/verify', { code });
      return response.data;
    } catch (error) {
      toast.error('Failed to verify 2FA code');
      throw error;
    }
  },

  setup2FA: async () => {
    try {
      const response = await api.post('/auth/2fa/setup');
      return response.data;
    } catch (error) {
      toast.error('Failed to setup 2FA');
      throw error;
    }
  }
};
