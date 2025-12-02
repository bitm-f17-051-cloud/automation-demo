import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../api-client';

export interface Contact {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  status: 'lead' | 'prospect' | 'customer' | 'closed';
  source: string;
  createdAt: string;
  assignedTo: string;
}

export const useContacts = () => {
  return useQuery({
    queryKey: ['contacts'],
    queryFn: () => apiClient.get<Contact[]>('/contacts'),
  });
};

export const useContact = (id: string) => {
  return useQuery({
    queryKey: ['contacts', id],
    queryFn: () => apiClient.get<Contact>(`/contacts/${id}`),
    enabled: !!id,
  });
};
