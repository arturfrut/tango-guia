import { createClient } from '@supabase/supabase-js';
import { EventsResponse } from '../types';


const SEMILLERO_ID = '990aa66a-d494-495d-8cb5-6785c84cb026';

export async function getInitialEvents(date: Date): Promise<EventsResponse> {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  try {
    const dateString = date.toISOString().split('T')[0];
    const dayOfWeek = date.getDay();
    const { data: events, error } = await supabase
      .from('tango_events')
      .select(
        `
        *,
        classes:event_classes (
          id,
          class_name,
          start_time,
          end_time,
          class_level,
          class_order
        ),
        practice:event_practices (
          id,
          practice_time,
          practice_end_time
        ),
        organizers:event_organizers (
          id,
          organizer_type,
          is_primary,
          is_one_time_teacher,
          one_time_teacher_name,
          teachers:teacher_id (
            id,
            name,
            phone_number
          )
        ),
        pricing:event_pricing (
          id,
          price_type,
          price,
          description
        ),
        seminar_days (
          id,
          day_number,
          date,
          theme,
          seminar_day_classes (
            id,
            class_name,
            start_time,
            end_time,
            class_level,
            class_order
          )
        ),
        milonga_pre_class:milonga_pre_classes (
          id,
          class_time,
          class_end_time,
          class_level,
          milonga_start_time
        )
      `
      )
      .eq('date', dateString)
      .eq('is_active', true)
      .is('deleted_at', null)
      .order('created_at');

    if (error) {
      console.error('Server-side fetch error:', error);
      return { events: [], total: 0, has_more: false };
    }

    const { data: recurringEvents, error: recurringError } = await supabase
      .from('tango_events')
      .select(
        `
        *,
        classes:event_classes (
          id,
          class_name,
          start_time,
          end_time,
          class_level,
          class_order
        ),
        practice:event_practices (
          id,
          practice_time,
          practice_end_time
        ),
        organizers:event_organizers (
          id,
          organizer_type,
          is_primary,
          is_one_time_teacher,
          one_time_teacher_name,
          teachers:teacher_id (
            id,
            name,
            phone_number
          )
        ),
        pricing:event_pricing (
          id,
          price_type,
          price,
          description
        ),
        seminar_days (
          id,
          day_number,
          date,
          theme,
          seminar_day_classes (
            id,
            class_name,
            start_time,
            end_time,
            class_level,
            class_order
          )
        ),
        milonga_pre_class:milonga_pre_classes (
          id,
          class_time,
          class_end_time,
          class_level,
          milonga_start_time
        )
      `
      )
      .eq('has_weekly_recurrence', true)
      .eq('is_active', true)
      .is('deleted_at', null)
      .neq('date', dateString);

    let allEvents = events || [];

    if (recurringEvents && !recurringError) {
      const recurringEventsForToday = recurringEvents.filter((event) => {
        const [year, month, day] = event.date.split('-').map(Number);
        const eventDate = new Date(year, month - 1, day);
        const eventDayOfWeek = eventDate.getDay();
        return eventDayOfWeek === dayOfWeek;
      });

      for (const recurringEvent of recurringEventsForToday) {
        const eventCopy = {
          ...recurringEvent,
          date: dateString,
          id: `${recurringEvent.id}_${dateString}`,
        };
        allEvents.push(eventCopy);
      }
    }

    const sortedEvents = allEvents.sort((a, b) => {
      const aIsSemillero = a.id === SEMILLERO_ID || a.id.startsWith(SEMILLERO_ID);
      const bIsSemillero = b.id === SEMILLERO_ID || b.id.startsWith(SEMILLERO_ID);
      if (aIsSemillero) return -1;
      if (bIsSemillero) return 1;
      return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
    });

    const transformedEvents = sortedEvents.map((event) => ({
      ...event,
      seminar_days: event.seminar_days?.map((day: any) => ({
        ...day,
        classes: day.seminar_day_classes || [],
      })),
    }));

    return {
      events: transformedEvents,
      total: transformedEvents.length,
      has_more: false,
    };
  } catch (error) {
    console.error('Server-side error:', error);
    return { events: [], total: 0, has_more: false };
  }
}
