'use client';

import { useDateSelector } from '@/app/hooks/useDateSelector';
import { Select, SelectItem } from '@heroui/select';
import { format } from 'date-fns';

interface DateSelectorMobileProps {
  selectedDate: Date;
  onDateSelect: (date: Date) => void;
  initialDate: Date;
}

export function DateSelectorMobile({ selectedDate, onDateSelect, initialDate }: DateSelectorMobileProps) {
  const {
    days,
    isToday,
    formatDayOption,
    selectedValue,
    selectColor,
    handleMobileSelectionChange,
  } = useDateSelector({ selectedDate, onDateSelect, initialDate });

  return (
    <div className="w-full">
      <Select
        selectedKeys={new Set([selectedValue])}
        onSelectionChange={handleMobileSelectionChange}
        placeholder="Selecciona una fecha"
        className="w-full"
        color={selectColor}
        variant="bordered"
        size="lg"
        selectionMode="single"
        disallowEmptySelection
      >
        {days.map((day: Date) => {
          const dayKey = format(day, 'yyyy-MM-dd');
          const dayLabel = formatDayOption(day);
          const todayIndicator = isToday(day);
          
          return (
            <SelectItem
              key={dayKey}
              textValue={dayLabel}
              className={todayIndicator ? 'text-success-600 font-medium' : ''}
            >
              <div className="flex items-center justify-between w-full">
                <span>{dayLabel}</span>
                {todayIndicator && (
                  <div className="w-2 h-2 bg-success rounded-full ml-2" />
                )}
              </div>
            </SelectItem>
          );
        })}
      </Select>
    </div>
  );
}