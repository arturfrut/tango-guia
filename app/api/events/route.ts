import { CompleteEventData } from '@/app/types';
import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

const SEMILLERO_ID = '990aa66a-d494-495d-8cb5-6785c84cb026';
const CALESITA_ID = '76071439-0832-4146-98df-79bcbd93674a';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// ─── Helpers ──────────────────────────────────────────────────────────────────

function parseDateStr(dateStr: string): Date {
  const [year, month, day] = dateStr.split('-').map(Number);
  return new Date(year, month - 1, day); // local time, evita bugs de UTC
}

function formatDateStr(date: Date): string {
  return [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, '0'),
    String(date.getDate()).padStart(2, '0'),
  ].join('-');
}

// ─── GET ──────────────────────────────────────────────────────────────────────

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
      .eq('is_active', true)
      .is('deleted_at', null);

    if (endDate) {
      query = query.gte('date', startDate).lte('date', endDate);
    } else {
      query = query.eq('date', startDate);
    }

    const startDateObj = parseDateStr(startDate);
    const endDateObj = endDate ? parseDateStr(endDate) : startDateObj;

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
      .eq('is_active', true)
      .eq('has_weekly_recurrence', true)
      .neq('date', startDate)
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
        const eventDate = parseDateStr(event.date); // ✅ fix
        const dayOfWeek = eventDate.getDay();

        const current = new Date(startDateObj);
        while (current <= endDateObj) {
          if (current.getDay() === dayOfWeek) return true;
          current.setDate(current.getDate() + 1);
        }
        return false;
      });

      for (const recurringEvent of recurringEventsForPeriod) {
        const originalDate = parseDateStr(recurringEvent.date); // ✅ fix
        const dayOfWeek = originalDate.getDay();

        const current = new Date(startDateObj);
        while (current <= endDateObj) {
          if (current.getDay() === dayOfWeek && current > originalDate) {
            const dateStr = formatDateStr(current); // ✅ fix
            const eventCopy = {
              ...recurringEvent,
              date: dateStr,
              id: `${recurringEvent.id}_${dateStr}`,
            };
            allEvents.push(eventCopy);
          }
          current.setDate(current.getDate() + 1);
        }
      }
    }

    const sortedEvents = allEvents.sort((a, b) => {
      const aIsSemillero = a.id === SEMILLERO_ID || a.id.startsWith(SEMILLERO_ID);
      const bIsSemillero = b.id === SEMILLERO_ID || b.id.startsWith(SEMILLERO_ID);
      if (aIsSemillero) return -1;
      if (bIsSemillero) return 1;

      const aDate = parseDateStr(a.date);
      const isFriday = aDate.getDay() === 5;
      if (isFriday) {
        const aIsCalesita = a.id === CALESITA_ID || a.id.startsWith(CALESITA_ID);
        const bIsCalesita = b.id === CALESITA_ID || b.id.startsWith(CALESITA_ID);
        if (aIsCalesita) return -1;
        if (bIsCalesita) return 1;
      }

      return parseDateStr(a.date).getTime() - parseDateStr(b.date).getTime();
    });

    const transformedEvents = sortedEvents.map((event) => ({
      ...event,
      seminar_days: event.seminar_days?.map((day: any) => ({
        ...day,
        classes: day.seminar_day_classes || [],
      })),
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
