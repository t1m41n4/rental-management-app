import { Session } from 'next-auth';
import { apiClient } from '../api/client';

export async function setupSession(session: Session | null) {
  if (session?.accessToken) {
    apiClient.setToken(session.accessToken);
  }
}

export async function refreshSession() {
  try {
    const response = await apiClient.post('/auth/refresh', {});
    return response.data;
  } catch (error) {
    console.error('Failed to refresh session:', error);
    return null;
  }
}
