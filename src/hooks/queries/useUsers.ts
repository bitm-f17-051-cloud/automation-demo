/* eslint-disable @typescript-eslint/no-explicit-any */

import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../api-client';

export interface User {
  id: number;
  firstName: string;
  lastName: string;
  isCompleted: boolean;
  email: string;
  lastLoggedIn: string;
  previewId: string;
  UserRoles: Array<{
    deletedAt: string | null;
    role: {
      accountId: number;
      name: string;
      deletedAt: string | null;
    };
  }>;
  calendarConnected: boolean;
  zoomConnected: boolean;
  availabilitySet: boolean;
  inviteNotAccepted: boolean;
  activeAvailability: {
    id: number;
    name: string;
    timeZone: string;
    availabilityDays: Array<{
      id: number;
      name: string;
      timings: Array<{
        startTime: string;
        endTime: string;
      }>;
      active: boolean;
    }>;
  } | null;
  userAccounts: Array<{
    accountId: number;
    trackedUser: boolean;
    inviteNotAccepted: boolean;
  }>;
  signedUrl: string | null;
  Team: any[] | null;
  contactsCount: number;
  userCalls: number;
  strategyCalls: number;
  salesCount: number;
  salesRevenue: number;
  depositsCount: number;
  trackedUser: boolean;
  showUpRate: string;
  noShowRate: string;
  closingRate: string;
  totalCashCollected: number;
  totalCashCollectedPerCall: number;
  recurringCashCollected: number;
  engagementRate: string;
  userNoShows: number;
  liveClosingRate: string;
  liveEngagementRate: string;
}

export const useUsers = () => {
  return useQuery({
    queryKey: ['users'],
    queryFn: () => apiClient.get<User[]>('/users'),
  });
};

export const useUser = (id: string) => {
  return useQuery({
    queryKey: ['users', id],
    queryFn: () => apiClient.get<User>(`/users/${id}`),
    enabled: !!id,
  });
};
