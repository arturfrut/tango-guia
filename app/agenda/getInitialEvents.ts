import { createClient } from '@supabase/supabase-js';
import { filterEventsByDateRange } from '../utils/eventFiltering';

export async function getInitialEvents(date: Date) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  try {
    const { data: events, error } = await supabase
      .from('events')
      .select(
        `
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
      `
      )
      .eq('is_active', true)
      .is('deleted_at', null);

    if (error) {
      console.error('Server-side fetch error:', error);
      return { events: [], total: 0, has_more: false };
    }

    const filteredEvents = events ? filterEventsByDateRange(events, date) : [];

    return {
      events: filteredEvents,
      total: filteredEvents.length,
      has_more: false,
    };
  } catch (error) {
    console.error('Server-side error:', error);
    return { events: [], total: 0, has_more: false };
  }
}
