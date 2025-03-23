import axios, { AxiosError, AxiosInstance } from 'axios';
import { signOut } from 'next-auth/react';
import { toast } from 'react-hot-toast';

export class ApiClient {
  private static instance: ApiClient;
  private api: AxiosInstance;
  private rateLimitRequests: { [key: string]: number[] } = {};

  private constructor() {
    this.api = axios.create({
      baseURL: process.env.NEXT_PUBLIC_API_URL,
      timeout: 10000,
      withCredentials: true, // Enable CSRF cookie handling
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    this.api.interceptors.request.use(
      async (config) => {
        // Rate limiting
        const endpoint = config.url || '';
        if (this.isRateLimited(endpoint)) {
          throw new Error('Too many requests. Please try again later.');
        }
        this.trackRequest(endpoint);

        // Get CSRF token from cookie if available
        const csrfToken = document.cookie.match('(^|;)\\s*XSRF-TOKEN\\s*=\\s*([^;]+)')?.pop() || '';
        if (csrfToken) {
          config.headers['X-XSRF-TOKEN'] = csrfToken;
        }

        return config;
      },
      (error) => Promise.reject(error)
    );

    this.api.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        if (error.response?.status === 401) {
          toast.error('Session expired. Please login again.');
          await signOut({ callbackUrl: '/login' });
        }
        return Promise.reject(error);
      }
    );
  }

  private isRateLimited(endpoint: string): boolean {
    const now = Date.now();
    const requests = this.rateLimitRequests[endpoint] || [];
    const recentRequests = requests.filter(time => now - time < 60000);
    return recentRequests.length >= 60; // 60 requests per minute
  }

  private trackRequest(endpoint: string): void {
    if (!this.rateLimitRequests[endpoint]) {
      this.rateLimitRequests[endpoint] = [];
    }
    this.rateLimitRequests[endpoint].push(Date.now());
  }

  public static getInstance(): ApiClient {
    if (!ApiClient.instance) {
      ApiClient.instance = new ApiClient();
    }
    return ApiClient.instance;
  }

  public setToken(token: string) {
    this.api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }

  public async get<T>(url: string) {
    return this.api.get<T>(url);
  }

  public async post<T>(url: string, data: any) {
    return this.api.post<T>(url, data);
  }
}

export const apiClient = ApiClient.getInstance();
