import { CompleteEventData, ClassLevel, EventType } from '@/app/types';
import { Avatar } from '@heroui/avatar';
import { Card, CardBody } from '@heroui/card';
import { Chip } from '@heroui/chip';
import { Divider } from '@heroui/divider';
import { Clock, MapPin, User, Users } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface EventCardProps {
  event: CompleteEventData;
  onClick?: () => void;
}

const SEMILLERO_ID = '990aa66a-d494-495d-8cb5-6785c84cb026';
const CALESITA_ID = '76071439-0832-4146-98df-79bcbd93674a';

export function EventCard({ event, onClick }: EventCardProps) {
  const router = useRouter();

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

  const getEventTypeIcon = (type: EventType | 'practice') => {
    const iconMap = {
      special_event: '🎉',
      class: '📚',
      seminar: '🎓',
      milonga: '💃',
      practice: '🕺',
    };
    return iconMap[type] || '📅';
  };

  const getEventChips = () => {
    const chips = [];

    chips.push({
      type: event.event_type,
      label: formatEventType(event.event_type),
      icon: getEventTypeIcon(event.event_type),
    });

    if (event.classes && event.classes.length > 0) {
      if (event.event_type !== 'class') {
        chips.push({
          type: 'class' as EventType,
          label: 'Clase',
          icon: getEventTypeIcon('class'),
        });
      }
    }

    if (event.practice && event.practice.length > 0) {
      chips.push({
        type: 'practice',
        label: 'Práctica',
        icon: getEventTypeIcon('practice'),
      });
    }

    if (event.milonga_pre_class) {
      if (event.event_type !== 'milonga' && event.event_type !== 'class') {
        chips.push({
          type: 'class' as EventType,
          label: 'Clase',
          icon: getEventTypeIcon('class'),
        });
      }
    }

    return chips;
  };

  const getScheduleInfo = () => {
    const schedules = [];

    if (event.classes && event.classes.length > 0) {
      event.classes.forEach((cls) => {
        if (cls.start_time) {
          schedules.push({
            name: cls.class_name || 'Clase',
            time: `${cls.start_time.slice(0, 5)}${cls.end_time ? ` - ${cls.end_time.slice(0, 5)}` : ''}`,
          });
        }
      });
    }

    if (event?.practice?.[0]?.practice_time) {
      schedules.push({
        name: 'Práctica',
        time: `${event.practice[0].practice_time.slice(0, 5)}${event.practice[0]?.practice_end_time ? ` - ${event.practice[0].practice_end_time.slice(0, 5)}` : ''}`,
      });
    }

    const mpc = Array.isArray(event.milonga_pre_class)
      ? event.milonga_pre_class[0]
      : event.milonga_pre_class;

    if (mpc?.class_time) {
      schedules.push({
        name: 'Clase',
        time: `${mpc.class_time.slice(0, 5)}${mpc.class_end_time ? ` - ${mpc.class_end_time.slice(0, 5)}` : ''}`,
      });
    }

    if (mpc?.milonga_start_time) {
      schedules.push({
        name: 'Milonga',
        time: mpc.milonga_start_time.slice(0, 5),
      });
    }

    return schedules;
  };

  const getInstructors = () => {
    if (!event.organizers || event.organizers.length === 0) return null;

    const instructors = event.organizers
      .map((org) => (org.is_one_time_teacher ? org.one_time_teacher_name : org.teachers?.name))
      .filter(Boolean);
    return instructors;
  };

  const eventChips = getEventChips();
  const schedules = getScheduleInfo();
  const instructors = getInstructors();
  const isSemillero = event.id === SEMILLERO_ID || event.id.startsWith(SEMILLERO_ID);
  const isCalesita = event.id === CALESITA_ID || event.id.startsWith(CALESITA_ID);
  const isRecommended = isSemillero || isCalesita;

  return (
    <Card
      isPressable
      onPress={handleCardClick}
      className={`w-full hover:scale-[1.01] transition-all duration-200 shadow-md hover:shadow-lg ${
        isRecommended
          ? 'border border-green-500 shadow-green-500/20 dark:bg-green-950/20 bg-green-50'
          : ''
      }`}
    >
      <CardBody className="p-5">
        <div className="flex items-center gap-4">
          <div className="flex-shrink-0">
            <Avatar
              src={event.avatar_image_url}
              name={event.title}
              className="mr-2 w-20 h-20 sm:w-16 sm:h-16 md:w-32 md:h-32 text-lg font-bold"
              classNames={{
                base: event.avatar_image_url
                  ? ''
                  : 'bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500',
                name: 'text-white font-bold text-sm',
              }}
            />
          </div>

          <div className="flex-1 min-w-0">
            {isRecommended && (
              <div className="flex items-center gap-1 mb-2">
                <span className="text-xs font-semibold text-green-600 dark:text-green-400 tracking-wide">
                  ⭐ Recomendación TangoGuia
                </span>
              </div>
            )}
            <div className="flex flex-wrap gap-2 mb-3">
              {eventChips.map((chip, index) => (
                <Chip
                  key={index}
                  size="sm"
                  variant="flat"
                  color="primary"
                  startContent={<span className="text-sm">{chip.icon}</span>}
                  className="font-medium"
                >
                  {chip.label}
                </Chip>
              ))}
            </div>

            <h3 className="font-bold text-lg text-foreground mb-2 line-clamp-2 leading-tight">
              {event.title}
            </h3>

            {event.venue_name && (
              <div className="flex items-center gap-2 mb-3">
                <MapPin className="h-4 w-4 text-default-500 flex-shrink-0" />
                <div className="min-w-0">
                  <p className="text-sm text-default-600 font-medium">{event.venue_name}</p>
                  {event.address && <p className="text-xs text-default-400">{event.address}</p>}
                </div>
              </div>
            )}

            {instructors && instructors.length > 0 && (
              <div className="flex items-center gap-2 mb-3">
                {instructors.length === 1 ? (
                  <User className="h-4 w-4 text-default-500" />
                ) : (
                  <Users className="h-4 w-4 text-default-500" />
                )}
                <p className="text-sm text-default-600 font-medium">{instructors.join(' / ')}</p>
              </div>
            )}

            {schedules.length > 0 && (
              <div className="space-y-1 mb-4">
                {schedules.map((schedule, index) => (
                  <div key={index} className="flex items-center gap-2 text-sm text-default-500">
                    <Clock className="h-4 w-4" />
                    <span className="font-medium">
                      {schedule.name}: {schedule.time}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <Divider className="mb-3" />
        <p className="text-xs text-default-400 text-center">Haz click para más detalles</p>
      </CardBody>
    </Card>
  );
}