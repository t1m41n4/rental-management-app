import { authApi } from '../api/auth';
import { toast } from 'react-hot-toast';

export async function refreshAccessToken(token: any) {
  try {
    const response = await authApi.refreshToken();

    return {
      ...token,
      accessToken: response.accessToken,
      accessTokenExpires: Date.now() + response.expiresIn * 1000,
    };
  } catch (error) {
    toast.error('Session expired. Please login again.');
    return {
      ...token,
      error: "RefreshAccessTokenError",
    };
  }
}
