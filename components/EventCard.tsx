import { CompleteEventData, ClassLevel, EventType } from '@/app/types';
import { Avatar } from '@heroui/avatar';
import { Card, CardBody } from '@heroui/card';
import { Chip } from '@heroui/chip';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Clock, MapPin, User, DollarSign } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface EventCardProps {
  event: CompleteEventData;
  onClick?: () => void;
}

export function EventCard({ event, onClick }: EventCardProps) {
  const router = useRouter();
  
  const primaryOrganizer = event.organizers?.find(org => org.is_primary);
  const organizerName = primaryOrganizer?.is_one_time_teacher 
    ? primaryOrganizer.one_time_teacher_name 
    : primaryOrganizer?.users?.name;

  const firstClass = event.classes?.[0];
  const practiceTime = event.practice?.practice_time;
  const preClassTime = event.milonga_pre_class?.class_time;
  
  const getDisplayTime = () => {
    if (firstClass?.start_time) {
      return {
        start: firstClass.start_time.slice(0, 5),
        end: firstClass.end_time?.slice(0, 5)
      };
    }
    if (practiceTime) {
      return {
        start: practiceTime.slice(0, 5),
        end: event.practice?.practice_end_time?.slice(0, 5)
      };
    }
    if (preClassTime) {
      return {
        start: preClassTime.slice(0, 5),
        end: event.milonga_pre_class?.class_end_time?.slice(0, 5)
      };
    }
    return null;
  };

  const displayTime = getDisplayTime();

  const mainPrice = event.pricing?.[0];

  const handleCardClick = () => {
    if (onClick) {
      onClick();
    } else {
      router.push(`/agenda/${event.id}`);
    }
  };

  const formatEventType = (type: EventType) => {
    const types = {
      special_event: 'Evento Especial',
      class: 'Clase',
      seminar: 'Seminario',
      milonga: 'Milonga',
    };
    return types[type] || type;
  };

  const formatClassLevel = (level?: ClassLevel) => {
    if (!level) return null;
    const levels = {
      beginner: 'Principiante',
      intermediate: 'Intermedio',
      advanced: 'Avanzado',
      all_levels: 'Todos los niveles',
    };
    return levels[level] || level;
  };

  const getEventTypeColor = (type: EventType) => {
    const colorMap = {
      special_event: 'secondary',
      class: 'primary',
      seminar: 'success',
      milonga: 'warning',
    };
    return colorMap[type] || 'default';
  };

  const getEventTypeIcon = (type: EventType) => {
    const iconMap = {
      special_event: '🎉',
      class: '📚',
      seminar: '🎓',
      milonga: '💃',
    };
    return iconMap[type] || '📅';
  };

  const displayLevel = firstClass?.class_level || event.milonga_pre_class?.class_level;

  return (
    <Card
      isPressable
      onPress={handleCardClick}
      className="w-full hover:scale-[1.01] transition-all duration-200 shadow-md hover:shadow-lg"
    >
      <CardBody className="p-5">
        <div className="flex items-start gap-4">
          <Avatar
            src={event.avatar_image_url}
            name={event.title}
            className="w-16 h-16 text-lg font-bold flex-shrink-0"
            classNames={{
              base: event.avatar_image_url
                ? ''
                : 'bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500',
              name: 'text-white font-bold text-sm',
            }}
          />

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

              <div className="text-xs text-default-400 font-medium">
                {format(new Date(event.date), 'eee dd MMM', {
                  locale: es,
                })}
              </div>
            </div>

            <h3 className="font-bold text-lg text-foreground mb-2 line-clamp-2 leading-tight">
              {event.title}
            </h3>

            {event.venue_name && (
              <div className="flex items-center gap-1 mb-2">
                <MapPin className="h-4 w-4 text-default-500" />
                <p className="text-sm text-default-600 font-medium">
                  {event.venue_name}
                </p>
              </div>
            )}

            {organizerName && (
              <div className="flex items-center gap-1 mb-3">
                <User className="h-4 w-4 text-default-500" />
                <p className="text-sm text-default-600 font-medium">
                  {organizerName}
                </p>
              </div>
            )}

            <div className="flex items-center justify-between text-sm text-default-500">
              {displayTime && (
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span className="font-medium">
                    {displayTime.start}
                    {displayTime.end && ` - ${displayTime.end}`}
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

            <div className="flex items-center justify-between mt-3">
              {displayLevel && (
                <Chip size="sm" color="success" variant="flat" className="text-xs">
                  {formatClassLevel(displayLevel)}
                </Chip>
              )}

              {mainPrice && (
                <div className="flex items-center gap-1 text-lg font-semibold text-foreground">
                  <DollarSign className="w-4 h-4" />
                  <span>${mainPrice.price}</span>
                </div>
              )}
            </div>

            {event.classes && event.classes.length > 1 && (
              <div className="mt-2">
                <Chip size="sm" color="primary" variant="flat" className="text-xs">
                  {event.classes.length} clases
                </Chip>
              </div>
            )}

            {event.description && (
              <div className="mt-2 text-xs text-default-400 line-clamp-2">
                {event.description}
              </div>
            )}
          </div>
        </div>
      </CardBody>
    </Card>
  );
}