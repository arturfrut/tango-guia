import { CompleteEventData } from '@/app/types';
import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    if (!startDate) {
      return NextResponse.json({ error: 'startDate is required' }, { status: 400 });
    }

    let query = supabase
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
          users:user_id (
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
      .eq('is_active', true)
      .is('deleted_at', null);

    if (endDate) {
      query = query.gte('date', startDate).lte('date', endDate);
    } else {
      query = query.eq('date', startDate);
    }

    const startDateObj = new Date(startDate);
    const endDateObj = endDate ? new Date(endDate) : startDateObj;
    
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
          users:user_id (
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
      .eq('is_active', true)
      .eq('has_weekly_recurrence', true)
      .lt('date', startDate)
      .is('deleted_at', null);

    const { data: events, error } = await query.order('date', { ascending: true });

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json({ error: 'Failed to fetch events' }, { status: 500 });
    }

    if (recurringError) {
      console.error('Recurring events error:', recurringError);
    }

    let allEvents = events || [];

    if (recurringEvents && !recurringError) {
      const recurringEventsForPeriod = recurringEvents.filter((event) => {
        const eventDate = new Date(event.date);
        const dayOfWeek = eventDate.getDay();
        
        const current = new Date(startDateObj);
        while (current <= endDateObj) {
          if (current.getDay() === dayOfWeek && current > eventDate) {
            return true;
          }
          current.setDate(current.getDate() + 1);
        }
        return false;
      });

      for (const recurringEvent of recurringEventsForPeriod) {
        const originalDate = new Date(recurringEvent.date);
        const dayOfWeek = originalDate.getDay();
        
        const current = new Date(startDateObj);
        while (current <= endDateObj) {
          if (current.getDay() === dayOfWeek && current > originalDate) {
            const eventCopy = {
              ...recurringEvent,
              date: current.toISOString().split('T')[0], // Format as YYYY-MM-DD
              id: `${recurringEvent.id}_${current.toISOString().split('T')[0]}` // Unique ID for recurring instance
            };
            allEvents.push(eventCopy);
          }
          current.setDate(current.getDate() + 1);
        }
      }
    }

    const sortedEvents = allEvents.sort((a, b) => {
      return new Date(a.date).getTime() - new Date(b.date).getTime();
    });

    const transformedEvents = sortedEvents.map((event) => ({
      ...event,
      seminar_days: event.seminar_days?.map((day: any) => ({
        ...day,
        classes: day.seminar_day_classes || []
      }))
    }));

    return NextResponse.json({
      success: true,
      data: {
        events: transformedEvents as CompleteEventData[],
        total: transformedEvents.length,
        has_more: false,
      },
    });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}