import { addDays, format, startOfDay } from 'date-fns';
import { es } from 'date-fns/locale';
import { useMemo } from 'react';

interface UseDateSelectorProps {
  selectedDate: Date;
  onDateSelect: (date: Date) => void;
  initialDate: Date;
}

export function useDateSelector({ selectedDate, onDateSelect, initialDate }: UseDateSelectorProps) {
  const days = useMemo(() => {
    const today = startOfDay(new Date());
    const yesterday = addDays(today, -1);
    return Array.from({ length: 7 }, (_, i) => addDays(yesterday, i));
  }, []);

  const isToday = (date: Date) => {
    return format(date, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd');
  };

  const isSelected = (date: Date) => {
    return format(date, 'yyyy-MM-dd') === format(selectedDate, 'yyyy-MM-dd');
  };

  const isYesterday = (date: Date) => {
    const yesterday = addDays(startOfDay(new Date()), -1);
    return format(date, 'yyyy-MM-dd') === format(yesterday, 'yyyy-MM-dd');
  };

  const formatDayButton = (date: Date) => {
    const dayName = format(date, 'EEE', { locale: es }).toUpperCase();
    const dayNumber = format(date, 'd/M');
    return { dayName, dayNumber };
  };

  // Mobile select formatting
  const formatDayOption = (date: Date) => {
    if (isYesterday(date)) {
      return 'Ayer';
    }
    
    if (isToday(date)) {
      return 'Hoy';
    }
    
    return format(date, "EEEE d 'de' MMMM", { locale: es });
  };

  // Desktop button styling
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

  const handleDateSelect = (date: Date) => {
    onDateSelect(startOfDay(date));
  };

  const handleMobileSelectionChange = (keys: any) => {
    const selectedKey = Array.from(keys)[0] as string;
    if (selectedKey) {
      const selectedDay = days.find(day => format(day, 'yyyy-MM-dd') === selectedKey);
      if (selectedDay) {
        handleDateSelect(selectedDay);
      }
    }
  };

  return {
    days,
    selectedDate,
    isToday,
    isSelected,
    isYesterday,
    formatDayButton,
    formatDayOption,
    getButtonVariant,
    getButtonColor,
    handleDateSelect,
    handleMobileSelectionChange,
    selectedValue: format(selectedDate, 'yyyy-MM-dd'),
    selectColor: (isToday(selectedDate) ? 'success' : 'primary') as 'success' | 'primary' | 'default' | 'secondary' | 'warning' | 'danger',
  };
}