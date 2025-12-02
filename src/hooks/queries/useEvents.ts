import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../api-client';

export interface Event {
  id: string;
  name: string;
  eventType: 'DISCOVERY_EVENT' | 'STRATEGY_EVENT';
  duration: number;
  durationUnit: 'MINUTES' | 'HOURS';
}

export const useEvents = () => {
  return useQuery({
    queryKey: ['events'],
    queryFn: () => apiClient.get<Event[]>('/events'),
  });
};

export const useEvent = (id: string) => {
  return useQuery({
    queryKey: ['events', id],
    queryFn: () => apiClient.get<Event>(`/events/${id}`),
    enabled: !!id,
  });
};
