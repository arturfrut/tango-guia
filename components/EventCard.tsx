import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Card, CardBody } from '@heroui/card';
import { Chip } from '@heroui/chip';
import { Avatar } from '@heroui/avatar';
import { Clock, MapPin, User } from 'lucide-react';
import { EventWithDetails } from '@/app/types';
import { useRouter } from 'next/navigation';

interface EventCardProps {
  event: EventWithDetails;
  onClick?: () => void;
}

export function EventCard({ event, onClick }: EventCardProps) {
  const router = useRouter();
  const primarySchedule = event.event_schedules?.[0];
  const primaryTeacher = event.event_teachers?.find(
    (et: { is_primary_teacher: any }) => et.is_primary_teacher
  )?.teacher;
  const thumbnailImage =
    event.event_images?.find((img: { display_order: number }) => img.display_order === 0) ||
    event.event_images?.[0];

  const handleCardClick = () => {
    if (onClick) {
      onClick();
    } else {
      router.push(`/agenda/${event.id}`);
    }
  };
  const formatEventType = (type: string) => {
    const types = {
      special_event: 'Evento Especial',
      class: 'Clase',
      seminar: 'Seminario',
      milonga: 'Milonga',
      practice: 'Práctica',
    };
    return types[type as keyof typeof types] || type;
  };

  const formatClassLevel = (level?: string) => {
    const levels = {
      beginner: 'Principiante',
      intermediate: 'Intermedio',
      advanced: 'Avanzado',
      all_levels: 'Todos los niveles',
    };
    return level ? levels[level as keyof typeof levels] || level : null;
  };

  const getEventTypeColor = (type: string) => {
    const colorMap = {
      special_event: 'secondary',
      class: 'primary',
      seminar: 'success',
      milonga: 'warning',
      practice: 'default',
    };
    return colorMap[type as keyof typeof colorMap] || 'default';
  };

  const getEventTypeIcon = (type: string) => {
    const iconMap = {
      special_event: '🎉',
      class: '📚',
      seminar: '🎓',
      milonga: '💃',
      practice: '🔄',
    };
    return iconMap[type as keyof typeof iconMap] || '📅';
  };

  return (
    <Card
      isPressable
      onPress={handleCardClick}
      className="w-full hover:scale-[1.01] transition-all duration-200 shadow-md hover:shadow-lg"
    >
      <CardBody className="p-5">
        <div className="flex items-start gap-4">
          {/* Avatar con imagen o inicial */}
          <Avatar
            src={thumbnailImage?.image_url}
            name={event.title}
            className="w-16 h-16 text-lg font-bold flex-shrink-0"
            classNames={{
              base: thumbnailImage
                ? ''
                : 'bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500',
              name: 'text-white font-bold text-sm',
            }}
          />

          {/* Contenido del evento */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-3">
              <Chip
                size="sm"
                variant="flat"
                color={getEventTypeColor(event.event_type) as any}
                startContent={<span className="text-sm">{getEventTypeIcon(event.event_type)}</span>}
                className="font-medium"
              >
                {formatEventType(event.event_type)}
              </Chip>

              {primarySchedule && (
                <div className="text-xs text-default-400 font-medium">
                  {format(new Date(primarySchedule.start_date), 'eee dd MMM', {
                    locale: es,
                  })}
                </div>
              )}
            </div>

            <h3 className="font-bold text-lg text-foreground mb-2 line-clamp-2 leading-tight">
              {event.title}
            </h3>

            {primaryTeacher && (
              <div className="flex items-center gap-1 mb-3">
                <User className="h-4 w-4 text-default-500" />
                <p className="text-sm text-default-600 font-medium">
                  {primaryTeacher.name || 'Profesor'}
                </p>
              </div>
            )}

            <div className="flex items-center justify-between text-sm text-default-500">
              {primarySchedule?.start_time && (
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span className="font-medium">
                    {primarySchedule.start_time.slice(0, 5)}
                    {primarySchedule.end_time && ` - ${primarySchedule.end_time.slice(0, 5)}`}
                  </span>
                </div>
              )}

              {event.address && (
                <div className="flex items-center gap-1 max-w-[150px]">
                  <MapPin className="h-4 w-4 flex-shrink-0" />
                  <span className="truncate text-xs">{event.address.split(',')[0]}</span>
                </div>
              )}
            </div>

            {/* Nivel de clase y precio */}
            <div className="flex items-center justify-between mt-3">
              {event.class_level && (
                <Chip size="sm" color="success" variant="flat" className="text-xs">
                  {formatClassLevel(event.class_level)}
                </Chip>
              )}

              {event.price && (
                <span className="text-lg font-semibold text-foreground">${event.price}</span>
              )}
            </div>

            {/* Descripción si existe */}
            {event.description && (
              <div className="mt-2 text-xs text-default-400 line-clamp-2">{event.description}</div>
            )}
          </div>
        </div>
      </CardBody>
    </Card>
  );
}
