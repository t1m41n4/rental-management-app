import { useQuery, useMutation, QueryKey } from '@tanstack/react-query';
import { apiClient } from '@/lib/api/client';
import { AxiosError } from 'axios';
import { toast } from 'react-hot-toast';

export function useApiQuery<T>(
  queryKey: QueryKey,
  url: string,
  options?: {
    enabled?: boolean;
    onError?: (error: AxiosError) => void;
  }
) {
  return useQuery({
    queryKey,
    queryFn: async () => {
      const response = await apiClient.get<T>(url);
      return response.data;
    },
    onError: (error: AxiosError) => {
      toast.error(error.response?.data?.message || 'An error occurred');
      options?.onError?.(error);
    },
    ...options,
  });
}

export function useApiMutation<T, TVariables>(
  url: string,
  options?: {
    onSuccess?: (data: T) => void;
    onError?: (error: AxiosError) => void;
  }
) {
  return useMutation({
    mutationFn: async (variables: TVariables) => {
      const response = await apiClient.post<T>(url, variables);
      return response.data;
    },
    onError: (error: AxiosError) => {
      toast.error(error.response?.data?.message || 'An error occurred');
      options?.onError?.(error);
    },
    onSuccess: options?.onSuccess,
  });
}
