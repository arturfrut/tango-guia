import { EventWithDetails } from '@/app/types';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface EventCardProps {
  event: EventWithDetails;
}

export function EventCard({ event }: EventCardProps) {
  const primarySchedule = event.event_schedules?.[0];
  const primaryTeacher = event.event_teachers?.find((et: { is_primary_teacher: any; }) => et.is_primary_teacher)?.teacher;
  const thumbnailImage = event.event_images?.find((img: { display_order: number; }) => img.display_order === 0) || event.event_images?.[0];

  const formatEventType = (type: string) => {
    const types = {
      'special_event': 'Evento Especial',
      'class': 'Clase',
      'seminar': 'Seminario',
      'milonga': 'Milonga',
      'practice': 'Práctica'
    };
    return types[type as keyof typeof types] || type;
  };

  const formatClassLevel = (level?: string) => {
    const levels = {
      'beginner': 'Principiante',
      'intermediate': 'Intermedio',
      'advanced': 'Avanzado',
      'all_levels': 'Todos los niveles'
    };
    return level ? levels[level as keyof typeof levels] || level : null;
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      {thumbnailImage && (
        <div className="h-48 bg-gray-200 overflow-hidden">
          <img
            src={thumbnailImage.image_url}
            alt={event.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}
      
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
            {event.title}
          </h3>
          <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full whitespace-nowrap ml-2">
            {formatEventType(event.event_type)}
          </span>
        </div>

        {event.description && (
          <p className="text-gray-600 text-sm mb-3 line-clamp-2">
            {event.description}
          </p>
        )}

        <div className="space-y-2 text-sm">
          {primarySchedule && (
            <div className="flex items-center text-gray-700">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span>
                {format(new Date(primarySchedule.start_date), 'dd/MM/yyyy', { locale: es })}
                {primarySchedule.start_time && (
                  <span className="ml-1">
                    - {primarySchedule.start_time.slice(0, 5)}
                    {primarySchedule.end_time && ` a ${primarySchedule.end_time.slice(0, 5)}`}
                  </span>
                )}
              </span>
            </div>
          )}

          {event.address && (
            <div className="flex items-center text-gray-700">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span className="truncate">{event.address}</span>
            </div>
          )}

          {primaryTeacher && (
            <div className="flex items-center text-gray-700">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <span>{primaryTeacher.name || 'Profesor'}</span>
            </div>
          )}

          <div className="flex items-center justify-between pt-2">
            {event.class_level && (
              <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                {formatClassLevel(event.class_level)}
              </span>
            )}
            
            {event.price && (
              <span className="text-lg font-semibold text-gray-900">
                ${event.price}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}