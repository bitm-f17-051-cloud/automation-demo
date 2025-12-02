import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../api-client';
import { ObjectField } from '@/app/api/objects/route';

export const useObjectFields = (objectType: 'CONTACT' | 'CALL' | 'EVENT' | 'DEAL' | 'USER' | null) => {
  return useQuery({
    queryKey: ['objects', objectType],
    queryFn: () => {
      if (!objectType) return Promise.resolve(undefined);
      return apiClient.get<ObjectField[]>(`/objects?objectType=${objectType}`);
    },
    enabled: !!objectType,
  });
};
