import { Suspense } from 'react';
import { EventsClient } from './EventsClient';
import { createClient } from '@supabase/supabase-js';
import { format } from 'date-fns';
import { EventsResponse } from '../types';

// Server-side function to fetch initial events
async function getInitialEvents(date: Date): Promise<EventsResponse> {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY! 
  );

  try {
    const formattedDate = format(date, 'yyyy-MM-dd');
    
    const { data: events, error } = await supabase
      .from('events')
      .select(`
        *,
        event_schedules (
          id,
          start_date,
          end_date,
          start_time,
          end_time,
          timezone,
          recurrence_pattern,
          recurrence_rule,
          days_of_week,
          ends_at
        ),
        event_images (
          id,
          image_url,
          meta_media_id,
          caption,
          display_order
        ),
        event_teachers (
          id,
          is_primary_teacher,
          teacher:users!event_teachers_teacher_id_fkey (
            id,
            name,
            phone_number
          )
        )
      `)
      .eq('is_active', true)
      .is('deleted_at', null);

    if (error) {
      console.error('Server-side fetch error:', error);
      return { events: [], total: 0, has_more: false };
    }

    // Filter events for today
    const filteredEvents = events?.filter(event => {
      return event.event_schedules?.some((schedule: { start_date: string | number | Date; }) => {
        const scheduleDate = new Date(schedule.start_date);
        return format(scheduleDate, 'yyyy-MM-dd') === formattedDate;
      });
    }) || [];

    return {
      events: filteredEvents,
      total: filteredEvents.length,
      has_more: false
    };
  } catch (error) {
    console.error('Server-side error:', error);
    return { events: [], total: 0, has_more: false };
  }
}

// Loading component for Suspense
function EventsLoading() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 002 2z" />
            </svg>
            <h1 className="text-4xl font-bold text-foreground">
              Eventos y Clases
            </h1>
          </div>
        </div>
        
        <div className="bg-white rounded-large shadow-medium">
          <div className="flex justify-center items-center h-64 p-6">
            <div className="flex items-center gap-3">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              <span className="text-default-500 text-lg">Cargando eventos...</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default async function EventsPage() {
  const today = new Date();
  const initialEvents = await getInitialEvents(today);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 002 2z" />
            </svg>
            <h1 className="text-4xl font-bold text-foreground">
              Eventos y Clases
            </h1>
          </div>
          <p className="text-default-500 text-lg">
            Descubre las próximas clases, milongas y eventos especiales
          </p>
        </div>
        
        <Suspense fallback={<EventsLoading />}>
          <EventsClient initialEvents={initialEvents} initialDate={today} />
        </Suspense>
      </div>
    </div>
  );
}