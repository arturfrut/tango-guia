import { EventSchedule, EventWithDetails } from '@/app/types';

export function isEventOnDate(event: EventWithDetails, targetDate: Date): boolean {
  return (
    event.event_schedules?.some((schedule: EventSchedule) =>
      isScheduleOnDate(schedule, targetDate)
    ) || false
  );
}

/**
 * Verifica si un schedule específico ocurre en una fecha específica
 */
export function isScheduleOnDate(schedule: any, targetDate: Date): boolean {
  const scheduleDate = new Date(schedule.start_date);
  const target = new Date(targetDate);

  // Para eventos únicos (no recurrentes)
  if (schedule.recurrence_pattern === 'none' || !schedule.recurrence_pattern) {
    return format(scheduleDate, 'yyyy-MM-dd') === format(target, 'yyyy-MM-dd');
  }

  // Para eventos recurrentes semanales
  if (schedule.recurrence_pattern === 'weekly' && schedule.days_of_week) {
    // Verificar que la fecha objetivo sea posterior a la fecha de inicio
    if (target < scheduleDate) {
      return false;
    }

    // Obtener el nombre del día en inglés y minúsculas
    const dayName = target.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();

    return schedule.days_of_week.includes(dayName);
  }

  return false;
}

// utils/eventUtils.ts - Helper functions for tango events

import { CompleteEventData, EventType, ClassLevel } from '@/app/types';
import { format, isSameDay, addWeeks } from 'date-fns';

/**
 * Check if an event occurs on a specific date (considering recurrence)
 */
export function doesEventOccurOnDate(event: CompleteEventData, targetDate: Date): boolean {
  const eventDate = new Date(event.date);

  // Check if it's the original date
  if (isSameDay(eventDate, targetDate)) {
    return true;
  }

  // Check weekly recurrence
  if (event.has_weekly_recurrence && targetDate > eventDate) {
    const dayOfWeek = eventDate.getDay();
    const targetDayOfWeek = targetDate.getDay();
    return dayOfWeek === targetDayOfWeek;
  }

  return false;
}

/**
 * Filter events by a date range
 */
export function filterEventsByDateRange(
  events: CompleteEventData[],
  startDate: Date,
  endDate?: Date
): CompleteEventData[] {
  const end = endDate || startDate;

  return events.filter((event) => {
    // Check each date in the range
    const current = new Date(startDate);
    while (current <= end) {
      if (doesEventOccurOnDate(event, current)) {
        return true;
      }
      current.setDate(current.getDate() + 1);
    }
    return false;
  });
}

/**
 * Get the next occurrence date for a recurring event
 */
export function getNextEventOccurrence(
  event: CompleteEventData,
  fromDate: Date = new Date()
): Date {
  const eventDate = new Date(event.date);

  // If it's not recurring or the original date is in the future, return original date
  if (!event.has_weekly_recurrence || eventDate > fromDate) {
    return eventDate;
  }

  // Calculate next weekly occurrence
  const dayOfWeek = eventDate.getDay();
  const fromDayOfWeek = fromDate.getDay();

  let daysToAdd = dayOfWeek - fromDayOfWeek;
  if (daysToAdd <= 0) {
    daysToAdd += 7;
  }

  const nextDate = new Date(fromDate);
  nextDate.setDate(fromDate.getDate() + daysToAdd);

  return nextDate;
}

/**
 * Format event type for display
 */
export function formatEventType(type: EventType): string {
  const types = {
    special_event: 'Evento Especial',
    class: 'Clase',
    seminar: 'Seminario',
    milonga: 'Milonga',
  };
  return types[type] || type;
}

/**
 * Format class level for display
 */
export function formatClassLevel(level?: ClassLevel): string | null {
  if (!level) return null;

  const levels = {
    beginner: 'Principiante',
    intermediate: 'Intermedio',
    advanced: 'Avanzado',
    all_levels: 'Todos los niveles',
  };
  return levels[level] || level;
}

/**
 * Get event type color for UI components
 */
export function getEventTypeColor(type: EventType): string {
  const colorMap = {
    special_event: 'secondary',
    class: 'primary',
    seminar: 'success',
    milonga: 'warning',
  };
  return colorMap[type] || 'default';
}

/**
 * Get event type icon
 */
export function getEventTypeIcon(type: EventType): string {
  const iconMap = {
    special_event: '🎉',
    class: '📚',
    seminar: '🎓',
    milonga: '💃',
  };
  return iconMap[type] || '📅';
}

/**
 * Get primary organizer from event
 */
export function getPrimaryOrganizer(event: CompleteEventData) {
  const primaryOrganizer = event.organizers?.find((org) => org.is_primary);

  if (!primaryOrganizer) return null;

  return {
    name: primaryOrganizer.is_one_time_teacher
      ? primaryOrganizer.one_time_teacher_name
      : primaryOrganizer.users?.name,
    phone: primaryOrganizer.is_one_time_teacher ? null : primaryOrganizer.users?.phone_number,
    isOneTime: primaryOrganizer.is_one_time_teacher,
  };
}

/**
 * Get display time for an event (first class, practice, or pre-class)
 */
export function getEventDisplayTime(
  event: CompleteEventData
): { start: string; end?: string } | null {
  // Check first class
  const firstClass = event.classes?.[0];
  if (firstClass?.start_time) {
    return {
      start: firstClass?.start_time?.slice(0, 5),
      end: firstClass?.end_time?.slice(0, 5),
    };
  }

  // Check practice
  if (event.practice?.practice_time) {
    return {
      start: event.practice?.practice_time?.slice(0, 5),
      end: event.practice?.practice_end_time?.slice(0, 5),
    };
  }

  // Check milonga pre-class
  if (event.milonga_pre_class?.class_time) {
    return {
      start: event.milonga_pre_class?.class_time?.slice(0, 5),
      end: event.milonga_pre_class?.class_end_time?.slice(0, 5),
    };
  }

  return null;
}

/**
 * Get main price from event pricing
 */
export function getMainPrice(
  event: CompleteEventData
): { price: number; description?: string } | null {
  if (!event.pricing || event.pricing.length === 0) {
    return null;
  }

  return {
    price: event.pricing[0].price,
    description: event.pricing[0].description,
  };
}

/**
 * Get class level to display (from first class or milonga pre-class)
 */
export function getEventDisplayLevel(event: CompleteEventData): ClassLevel | null {
  return event.classes?.[0]?.class_level || event.milonga_pre_class?.class_level || null;
}

/**
 * Sort events by date and time
 */
export function sortEventsByDateTime(events: CompleteEventData[]): CompleteEventData[] {
  return [...events].sort((a, b) => {
    // First sort by date
    const dateComparison = new Date(a.date).getTime() - new Date(b.date).getTime();
    if (dateComparison !== 0) return dateComparison;

    // Then sort by time if same date
    const aTime = getEventDisplayTime(a);
    const bTime = getEventDisplayTime(b);

    if (aTime && bTime) {
      return aTime.start.localeCompare(bTime.start);
    }

    // If one has time and other doesn't, prioritize the one with time
    if (aTime && !bTime) return -1;
    if (!aTime && bTime) return 1;

    // Finally sort by creation time
    return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
  });
}

/**
 * Generate recurring event instances for a date range
 */
export function generateRecurringInstances(
  event: CompleteEventData,
  startDate: Date,
  endDate: Date
): CompleteEventData[] {
  if (!event.has_weekly_recurrence) {
    return [event];
  }

  const instances: CompleteEventData[] = [];
  const eventDate = new Date(event.date);
  const dayOfWeek = eventDate.getDay();

  // Start from the first occurrence of this day of week in the range
  const current = new Date(startDate);

  // Move to the first occurrence of the target day of week
  while (current.getDay() !== dayOfWeek) {
    current.setDate(current.getDate() + 1);
  }

  // Generate instances
  while (current <= endDate) {
    // Only include if it's after the original event date
    if (current >= eventDate) {
      const instance = {
        ...event,
        id: `${event.id}_${format(current, 'yyyy-MM-dd')}`,
        date: format(current, 'yyyy-MM-dd'),
      };
      instances.push(instance);
    }

    // Move to next week
    current.setDate(current.getDate() + 7);
  }

  return instances;
}
