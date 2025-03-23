import { useQuery, useMutation } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { MaintenanceRequest } from '@/types/api';
import { logger } from '@/lib/logger';

export function useMaintenanceRequests() {
  const { data: requests, isLoading, error } = useQuery<MaintenanceRequest[]>({
    queryKey: ['maintenanceRequests'],
    queryFn: async () => {
      try {
        const response = await api.get('/tenant/maintenance');
        return response.data;
      } catch (error) {
        logger.error('Failed to fetch maintenance requests', error);
        throw error;
      }
    },
  });

  const mutation = useMutation({
    mutationFn: (description: string) =>
      api.post('/tenant/maintenance', { description }),
    onSuccess: () => {
      logger.info('Maintenance request created successfully');
    },
    onError: (error) => {
      logger.error('Failed to create maintenance request', error);
    },
  });

  return {
    requests,
    isLoading,
    error,
    createRequest: mutation.mutate,
    isSubmitting: mutation.isPending,
  };
}
