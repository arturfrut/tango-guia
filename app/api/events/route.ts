import { EventWithDetails } from '@/app/types';
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
      return NextResponse.json(
        { error: 'startDate is required' },
        { status: 400 }
      );
    }

    // Build the query
    let query = supabase
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

    // Execute the query
    const { data: events, error } = await query;

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch events' },
        { status: 500 }
      );
    }

    // Filter events by date range based on their schedules
    const filteredEvents = events?.filter(event => {
      return event.event_schedules?.some((schedule: { start_date: string | number | Date; recurrence_pattern: string; days_of_week: string | any[]; }) => {
        const scheduleDate = new Date(schedule.start_date);
        const start = new Date(startDate);
        const end = endDate ? new Date(endDate) : start;
        
        // For single day events
        if (schedule.recurrence_pattern === 'none') {
          return scheduleDate >= start && scheduleDate <= end;
        }
        
        // For recurring events, check if they occur within the date range
        // This is a simplified check - you might want to implement more sophisticated recurrence logic
        if (schedule.recurrence_pattern === 'weekly' && schedule.days_of_week) {
          const dayMapping = {
            'sunday': 0, 'monday': 1, 'tuesday': 2, 'wednesday': 3,
            'thursday': 4, 'friday': 5, 'saturday': 6
          };
          
          const current = new Date(start);
          while (current <= end) {
            const dayName = current.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
            if (schedule.days_of_week.includes(dayName as any)) {
              return true;
            }
            current.setDate(current.getDate() + 1);
          }
        }
        
        return scheduleDate >= start && scheduleDate <= end;
      });
    }) || [];

    // Sort events by earliest schedule date
    const sortedEvents = filteredEvents.sort((a, b) => {
      const aEarliestDate = Math.min(...a.event_schedules.map((s: { start_date: string | number | Date; }) => new Date(s.start_date).getTime()));
      const bEarliestDate = Math.min(...b.event_schedules.map((s: { start_date: string | number | Date; }) => new Date(s.start_date).getTime()));
      return aEarliestDate - bEarliestDate;
    });

    return NextResponse.json({
      success: true,
      data: {
        events: sortedEvents as EventWithDetails[],
        total: sortedEvents.length,
        has_more: false
      }
    });

  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}