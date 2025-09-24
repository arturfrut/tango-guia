'use client';

import { Button } from '@heroui/button';
import { Card, CardBody } from '@heroui/card';
import { DateSelectorMobile } from './DateSelectorMobile';
import { Key } from 'react';
import { useDateSelector } from '@/app/hooks/useDateSelector';

interface DateSelectorProps {
  selectedDate: Date;
  onDateSelect: (date: Date) => void;
  initialDate: Date;
}

export function DateSelector({ selectedDate, onDateSelect, initialDate }: DateSelectorProps) {
  const {
    days,
    isToday,
    isSelected,
    formatDayButton,
    getButtonVariant,
    getButtonColor,
    handleDateSelect,
  } = useDateSelector({ selectedDate, onDateSelect, initialDate });

  return (
    <Card className="w-full shadow-md">
      <CardBody className="p-5">
        {/* Desktop version - hidden on mobile (md breakpoint = 768px) */}
        <div className="hidden md:flex flex-wrap gap-3 justify-center">
          {days.map((day: Date) => {
            const { dayName, dayNumber } = formatDayButton(day);
            return (
              <Button
                key={day.toISOString()}
                onClick={() => handleDateSelect(day)}
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

        {/* Mobile version - hidden on desktop */}
        <div className="block md:hidden">
          <DateSelectorMobile
            selectedDate={selectedDate}
            onDateSelect={onDateSelect}
            initialDate={initialDate}
          />
        </div>
      </CardBody>
    </Card>
  );
}