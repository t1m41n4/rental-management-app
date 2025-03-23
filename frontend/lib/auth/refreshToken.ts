import { api } from '../api';

export async function refreshAccessToken(token: any) {
  try {
    // Implementation needed for token refresh
  } catch (error) {
    return {
      ...token,
      error: "RefreshAccessTokenError",
    }
  }
}
