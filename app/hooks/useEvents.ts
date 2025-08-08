import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { EventsResponse } from '../types';

interface UseEventsOptions {
  startDate: Date;
  endDate?: Date;
  enabled?: boolean;
}

export function useEvents({ startDate, endDate, enabled = true }: UseEventsOptions) {
  return useQuery({
    queryKey: ['events', format(startDate, 'yyyy-MM-dd'), endDate ? format(endDate, 'yyyy-MM-dd') : null],
    queryFn: async (): Promise<EventsResponse> => {
      const params = new URLSearchParams({
        startDate: format(startDate, 'yyyy-MM-dd'),
      });
      
      if (endDate) {
        params.append('endDate', format(endDate, 'yyyy-MM-dd'));
      }

      const response = await fetch(`/api/events?${params.toString()}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch events');
      }
      
      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to fetch events');
      }
      
      return result.data;
    },
    enabled,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
  });
}