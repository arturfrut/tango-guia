'use client';

import { Button } from '@heroui/button';
import { Card, CardBody } from '@heroui/card';
import { addDays, format, startOfDay } from 'date-fns';
import { es } from 'date-fns/locale';
import { useMemo } from 'react';

interface DateSelectorProps {
  selectedDate: Date;
  onDateSelect: (date: Date) => void;
  initialDate: Date;
}

export function DateSelector({ selectedDate, onDateSelect, initialDate }: DateSelectorProps) {
  const days = useMemo(() => {
    const today = startOfDay(new Date());
    const yesterday = addDays(today, -1);
    return Array.from({ length: 7 }, (_, i) => addDays(yesterday, i));
  }, []);

  const formatDayButton = (date: Date) => {
    const dayName = format(date, 'EEE', { locale: es }).toUpperCase();
    const dayNumber = format(date, 'd/M');
    return { dayName, dayNumber };
  };

  const isToday = (date: Date) => {
    return format(date, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd');
  };

  const isSelected = (date: Date) => {
    return format(date, 'yyyy-MM-dd') === format(selectedDate, 'yyyy-MM-dd');
  };

  const getButtonVariant = (date: Date) => {
    if (isSelected(date)) return 'solid';
    if (isToday(date)) return 'bordered';
    return 'light';
  };

  const getButtonColor = (date: Date) => {
    if (isSelected(date)) return 'primary';
    if (isToday(date)) return 'success';
    return 'default';
  };

  return (
    <Card className="w-full shadow-md">
      <CardBody className="p-5">
        <div className="flex flex-wrap gap-3 justify-center">
          {days.map((day) => {
            const { dayName, dayNumber } = formatDayButton(day);
            return (
              <Button
                key={day.toISOString()}
                onClick={() => onDateSelect(startOfDay(day))}
                variant={getButtonVariant(day)}
                color={getButtonColor(day)}
                className="flex-col h-16 min-w-20 relative"
                size="sm"
              >
                <span className="text-xs font-bold">{dayName}</span>
                <span className="text-sm font-bold">{dayNumber}</span>
                {isToday(day) && !isSelected(day) && (
                  <div className="absolute -top-1 -right-1 w-2 h-2 bg-success rounded-full" />
                )}
              </Button>
            );
          })}
        </div>
      </CardBody>
    </Card>
  );
}