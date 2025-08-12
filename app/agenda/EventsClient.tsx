// app/eventos/EventsClient.tsx
'use client'

import { EventCard } from '@/components/EventCard'
import { Button } from '@heroui/button'
import { addDays, format, startOfDay } from 'date-fns'
import { es } from 'date-fns/locale'
import { useMemo, useState } from 'react'
import { useEvents } from '../hooks/useEvents'
import { EventsResponse } from '../types'

interface EventsClientProps {
  initialEvents: EventsResponse
  initialDate: Date
}

export function EventsClient({
  initialEvents,
  initialDate
}: EventsClientProps) {
  const [selectedDate, setSelectedDate] = useState(startOfDay(initialDate))

  const days = useMemo(() => {
    return Array.from({ length: 7 }, (_, i) => addDays(initialDate, i - 1))
  }, [initialDate])

  // Use React Query for client-side data fetching
  const {
    data: eventsData,
    isLoading,
    error
  } = useEvents({
    startDate: selectedDate,
    // Skip initial fetch if it's for today and we have initial data
    enabled:
      format(selectedDate, 'yyyy-MM-dd') !== format(initialDate, 'yyyy-MM-dd')
  })

  // Use initial data for today, otherwise use fetched data
  const events =
    format(selectedDate, 'yyyy-MM-dd') === format(initialDate, 'yyyy-MM-dd')
      ? initialEvents.events
      : eventsData?.events || []

  const formatDayButton = (date: Date) => {
    const dayName = format(date, 'EEE', { locale: es }).toUpperCase()
    const dayNumber = format(date, 'd/M')
    return { dayName, dayNumber }
  }

  const isToday = (date: Date) => {
    return format(date, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd')
  }

  const isSelected = (date: Date) => {
    return format(date, 'yyyy-MM-dd') === format(selectedDate, 'yyyy-MM-dd')
  }

  const getButtonVariant = (date: Date) => {
    if (isSelected(date)) return 'solid'
    if (isToday(date)) return 'bordered'
    return 'light'
  }

  const getButtonColor = (date: Date) => {
    if (isSelected(date)) return 'primary'
    if (isToday(date)) return 'success'
    return 'default'
  }

  return (
    <div className='space-y-8'>
      {/* Date Navigation */}
      <div className='border-y-stone-500 border-1 rounded-large shadow-medium p-6'>


        <div className='flex flex-wrap gap-3 justify-center'>
          {days.map(day => {
            const { dayName, dayNumber } = formatDayButton(day)
            return (
              <Button
                key={day.toISOString()}
                onClick={() => setSelectedDate(startOfDay(day))}
                variant={getButtonVariant(day)}
                color={getButtonColor(day)}
                className='flex-col h-16 min-w-20 relative'
                size='sm'
              >
                <span className='text-xs font-medium'>{dayName}</span>
                <span className='text-sm font-bold'>{dayNumber}</span>
                {isToday(day) && !isSelected(day) && (
                  <div className='absolute -top-1 -right-1 w-2 h-2 bg-success rounded-full' />
                )}
              </Button>
            )
          })}
        </div>
      </div>

      {/* Selected Date Display */}
      <div className='text-center space-y-2'>
        <h2 className='text-2xl font-bold text-foreground'>
          {format(selectedDate, "EEEE d 'de' MMMM", { locale: es })}
        </h2>
        {isToday(selectedDate) && (
          <span className='inline-block px-2 py-1 bg-success-100 text-success-700 text-sm font-medium rounded-full'>
            Hoy
          </span>
        )}
      </div>

      <div className='border-t border-divider'></div>

      {/* Loading State */}
      {isLoading && (
        <div className='rounded-large shadow-medium'>
          <div className='flex justify-center items-center h-32 p-6'>
            <div className='flex items-center gap-3'>
              <div className='animate-spin rounded-full h-6 w-6 border-b-2 border-primary'></div>
              <span className='text-default-500'>Cargando eventos...</span>
            </div>
          </div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className='bg-white rounded-large shadow-medium'>
          <div className='text-center py-8 p-6'>
            <svg
              className='mx-auto mb-4 w-12 h-12 text-danger'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z'
              />
            </svg>
            <p className='text-danger text-lg font-medium mb-2'>
              Error al cargar los eventos
            </p>
            <p className='text-default-500'>
              Por favor, intenta de nuevo más tarde.
            </p>
          </div>
        </div>
      )}

      {/* Events Grid */}
      {!isLoading && !error && (
        <>
          {events.length > 0 ? (
            <>
              <div className='flex flex-col gap-6'>
                {events.map(event => (
                  <EventCard key={event.id} event={event} />
                ))}
              </div>

              {/* Events Count */}
              <div className='text-center'>
                <span className='inline-block px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm font-medium'>
                  {events.length === 1
                    ? '1 evento encontrado'
                    : `${events.length} eventos encontrados`}
                </span>
              </div>
            </>
          ) : (
            <div className='text-center py-12'>
              <svg
                className='mx-auto mb-4 w-16 h-16 text-default-300'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 002 2z'
                />
              </svg>
              <h3 className='text-xl font-semibold text-foreground mb-2'>
                No hay eventos
              </h3>
              <p className='text-default-500'>
                No se encontraron eventos para{' '}
                {format(selectedDate, "EEEE d 'de' MMMM", {
                  locale: es
                }).toLowerCase()}
                .
              </p>
              <span className='inline-block mt-4 px-3 py-1 bg-default-100 text-default-600 rounded-full text-sm'>
                Prueba seleccionando otra fecha
              </span>
            </div>
          )}
        </>
      )}
    </div>
  )
}
