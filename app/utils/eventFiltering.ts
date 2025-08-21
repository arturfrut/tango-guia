import { format } from 'date-fns';

import { EventSchedule, EventWithDetails } from '@/app/types';

export function isEventOnDate(event: EventWithDetails, targetDate: Date): boolean {
  return event.event_schedules?.some((schedule: EventSchedule) => isScheduleOnDate(schedule, targetDate)) || false;
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

/**
 * Filtra eventos que ocurren en un rango de fechas
 */
export function filterEventsByDateRange(
  events: EventWithDetails[],
  startDate: Date,
  endDate?: Date
): EventWithDetails[] {
  const end = endDate || startDate;

  return events.filter((event) => {
    return event.event_schedules?.some((schedule: EventSchedule) => {
      const scheduleDate = new Date(schedule.start_date);

      // Para eventos únicos
      if (schedule.recurrence_pattern === 'none' || !schedule.recurrence_pattern) {
        return scheduleDate >= startDate && scheduleDate <= end;
      }

      // Para eventos recurrentes semanales
      if (schedule.recurrence_pattern === 'weekly' && schedule.days_of_week) {
        // Si el evento empezó después del rango, no aplica
        if (scheduleDate > end) {
          return false;
        }

        // Verificar cada día en el rango
        const current = new Date(startDate);
        while (current <= end) {
          if (isScheduleOnDate(schedule, current)) {
            return true;
          }
          current.setDate(current.getDate() + 1);
        }
      }

      return false;
    });
  });
}
