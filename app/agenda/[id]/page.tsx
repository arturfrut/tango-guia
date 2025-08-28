import { CompleteEventData, EventType, ClassLevel } from '@/app/types';
import { Avatar } from '@heroui/avatar';
import { Card, CardBody, CardHeader } from '@heroui/card';
import { Chip } from '@heroui/chip';
import { Divider } from '@heroui/divider';
import { createClient } from '@supabase/supabase-js';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { ArrowLeft, Calendar, Clock, DollarSign, MapPin, User, GraduationCap } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';

interface EventPageProps {
  params: Promise<{ id: string }>;
}

async function getEventById(id: string): Promise<CompleteEventData | null> {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  try {
    const { data: event, error } = await supabase
      .from('tango_events')
      .select(
        `
        *,
        classes:event_classes (
          id,
          class_name,
          start_time,
          end_time,
          class_level,
          class_order
        ),
        practice:event_practices (
          id,
          practice_time,
          practice_end_time
        ),
        organizers:event_organizers (
          id,
          organizer_type,
          is_primary,
          is_one_time_teacher,
          one_time_teacher_name,
          users:user_id (
            id,
            name,
            phone_number
          )
        ),
        pricing:event_pricing (
          id,
          price_type,
          price,
          description
        ),
        seminar_days (
          id,
          day_number,
          date,
          theme,
          seminar_day_classes (
            id,
            class_name,
            start_time,
            end_time,
            class_level,
            class_order
          )
        ),
        milonga_pre_class:milonga_pre_classes (
          id,
          class_time,
          class_end_time,
          class_level,
          milonga_start_time
        )
      `
      )
      .eq('id', id)
      .eq('is_active', true)
      .is('deleted_at', null)
      .single();

    if (error) {
      console.error('Server-side fetch error:', error);
      return null;
    }

    if (event?.seminar_days) {
      event.seminar_days = event.seminar_days.map((day: any) => ({
        ...day,
        classes: day.seminar_day_classes || [],
      }));
    }

    return event as CompleteEventData;
  } catch (error) {
    console.error('Server-side error:', error);
    return null;
  }
}

function EventLoading() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Card className="mb-6">
          <div className="w-full h-64 md:h-80 bg-default-200 animate-pulse"></div>

          <CardHeader className="pb-2">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-24 h-6 bg-default-200 rounded-full animate-pulse"></div>
                  <div className="w-20 h-6 bg-default-200 rounded-full animate-pulse"></div>
                </div>
                <div className="w-3/4 h-8 bg-default-200 rounded animate-pulse"></div>
                <div className="w-1/2 h-6 bg-default-200 rounded animate-pulse"></div>
              </div>
              <div className="w-20 h-8 bg-default-200 rounded animate-pulse"></div>
            </div>
          </CardHeader>

          <CardBody className="pt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="space-y-3">
                  <div className="w-32 h-6 bg-default-200 rounded animate-pulse"></div>
                  <div className="space-y-2">
                    <div className="w-full h-4 bg-default-200 rounded animate-pulse"></div>
                    <div className="w-3/4 h-4 bg-default-200 rounded animate-pulse"></div>
                  </div>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}

export default async function EventPage({ params }: EventPageProps) {
  const { id } = await params;
  const event = await getEventById(id);
  if (!event) {
    notFound();
  }

  return (
    <Suspense fallback={<EventLoading />}>
      <EventDetail event={event} />
    </Suspense>
  );
}

function EventDetail({ event }: { event: CompleteEventData }) {
  const allOrganizers = event.organizers || [];

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

    if (event.classes && event.classes.length > 0 && event.event_type !== 'class') {
      chips.push({
        type: 'class' as EventType,
        label: 'Clase',
        icon: getEventTypeIcon('class'),
      });
    }

    if (event.practice && event.practice.length > 0) {
      chips.push({
        type: 'practice',
        label: 'Práctica',
        icon: getEventTypeIcon('practice'),
      });
    }

    if (event.milonga_pre_class && event.event_type !== 'milonga' && event.event_type !== 'class') {
      chips.push({
        type: 'class' as EventType,
        label: 'Clase',
        icon: getEventTypeIcon('class'),
      });
    }

    return chips;
  };

  const getSchedule = () => {
    const schedule = [];

    if (event.classes && event.classes.length > 0) {
      event.classes.forEach((cls) => {
        if (cls.start_time) {
          schedule.push({
            name: cls.class_name || 'Clase',
            time: `${cls.start_time.slice(0, 5)}${cls.end_time ? ` - ${cls.end_time.slice(0, 5)}` : ''}`,
            level: cls.class_level,
            type: 'class',
          });
        }
      });
    }

    if (event.practice && event.practice.length > 0 && event.practice[0].practice_time) {
      schedule.push({
        name: 'Práctica',
        time: `${event.practice[0].practice_time.slice(0, 5)}${event.practice[0].practice_end_time ? ` - ${event.practice[0].practice_end_time.slice(0, 5)}` : ''}`,
        level: null,
        type: 'practice',
      });
    }

    if (event.milonga_pre_class && event.milonga_pre_class.class_time) {
      schedule.push({
        name: 'Clase',
        time: `${event.milonga_pre_class.class_time.slice(0, 5)}${event.milonga_pre_class.class_end_time ? ` - ${event.milonga_pre_class.class_end_time.slice(0, 5)}` : ''}`,
        level: event.milonga_pre_class.class_level,
        type: 'class',
      });
    }

    return schedule.sort((a, b) => a.time.localeCompare(b.time));
  };

  const eventChips = getEventChips();
  const schedule = getSchedule();

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Card className="mb-6">
          <Link
            href="/agenda"
            className="pt-6 px-6 flex gap-3 items-center text-default-900 font-medium"
          >
            <ArrowLeft className="text-default-900" />
            Volver
          </Link>

          <Divider className="m-4" />
          <CardHeader className="pb-4">
            <div className="flex items-start gap-4 mb-4">
              <Avatar
                src={event.avatar_image_url}
                name={event.title}
                className="w-16 h-16 md:w-20 md:h-20 text-lg font-bold flex-shrink-0"
                classNames={{
                  base: event.avatar_image_url
                    ? ''
                    : 'bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500',
                  name: 'text-white font-bold text-sm',
                }}
              />
              <div className="flex-1">
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

                <h1 className="text-2xl md:text-3xl font-bold text-foreground leading-tight">
                  {event.title}
                </h1>
              </div>
            </div>
          </CardHeader>

          <CardBody className="pt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="space-y-2">
                <h3 className="font-semibold text-lg flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-primary" />
                  Fecha
                </h3>
                <div className="flex items-center gap-2 text-default-700">
                  <span className="font-medium">
                    {format(new Date(event.date), 'EEEE, dd MMMM yyyy', {
                      locale: es,
                    })}
                  </span>
                </div>
                {event.has_weekly_recurrence && (
                  <div className="text-sm text-default-600">Se repite semanalmente</div>
                )}
              </div>

              {event.address && (
                <div className="space-y-2">
                  <h3 className="font-semibold text-lg flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-primary" />
                    Ubicación
                  </h3>
                  <div className="flex items-center gap-2 text-default-700">
                    <div>
                      <p className="font-medium">{event.venue_name}</p>
                      <p className="text-sm text-default-600">{event.address}</p>
                    </div>
                  </div>
                </div>
              )}

              {allOrganizers.length > 0 && (
                <div className="space-y-2">
                  <h3 className="font-semibold text-lg flex items-center gap-2">
                    <User className="w-5 h-5 text-primary" />
                    {allOrganizers.length > 1 ? 'Organizadores' : 'Organizador'}
                  </h3>
                  <div className="space-y-2">
                    {allOrganizers.map((organizer, index) => {
                      const organizerName = organizer.is_one_time_teacher
                        ? organizer.one_time_teacher_name
                        : organizer.users?.name;

                      return (
                        <div key={index} className="flex items-center gap-3">
                          <Avatar
                            name={organizerName || 'Organizador'}
                            size="sm"
                            className="flex-shrink-0"
                          />
                          <div>
                            <div className="font-medium text-default-700 flex items-center gap-2">
                              {organizerName || 'Organizador'}
                            </div>
                            {!organizer.is_one_time_teacher && organizer.users?.phone_number && (
                              <div className="text-xs text-default-500">
                                {organizer.users.phone_number}
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {event.contact_phone && (
                <div className="space-y-2">
                  <h3 className="font-semibold text-lg">Contacto</h3>
                  <a
                    href={`https://wa.me/${event.contact_phone.replace(/\D/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-green-600 hover:text-green-700 font-medium"
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488" />
                    </svg>
                    {event.contact_phone}
                  </a>
                </div>
              )}

              {schedule.length > 0 && (
                <div className="space-y-2">
                  <h3 className="font-semibold text-lg flex items-center gap-2">
                    <Clock className="w-5 h-5 text-primary" />
                    Cronograma
                  </h3>
                  <div className="space-y-2">
                    {schedule.map((item, index) => (
                      <div
                        key={index}
                        className="p-3 bg-default-50 rounded-lg"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 flex-1">
                            <span className="text-sm">
                              {getEventTypeIcon(item.type as EventType)}
                            </span>
                            <span className="font-medium text-default-700">{item.name}</span>
                          </div>
                          <div className="flex items-center gap-1 text-sm font-medium text-default-600">
                            <Clock className="w-3 h-3" />
                            {item.time}
                          </div>
                        </div>
                        {item.level && (
                          <div className="text-sm text-default-600 mt-1 ml-6">
                            {formatClassLevel(item.level)}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {event.pricing && event.pricing.length > 0 && (
                <div className="space-y-2">
                  <h3 className="font-semibold text-lg flex items-center gap-2">
                    <DollarSign className="w-5 h-5 text-primary" />
                    Precios
                  </h3>
                  <div className="space-y-2">
                    {event.pricing.map((price) => (
                      <div
                        key={price.id}
                        className="flex items-center justify-between p-3 bg-default-50 rounded-lg"
                      >
                        <div className="flex-1">
                          {price.description && (
                            <div className="text-sm text-default-600">{price.description}</div>
                          )}
                        </div>
                        <div className="flex items-center gap-1 font-semibold text-foreground">
                          <DollarSign className="w-4 h-4" />
                          {price.price}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {event.description && (
              <div className="mb-6">
                <h3 className="font-semibold text-lg mb-3">Descripción</h3>
                <p className="text-default-700 leading-relaxed whitespace-pre-wrap">
                  {event.description}
                </p>
              </div>
            )}

            {event.show_description && (
              <div className="mb-6">
                <h3 className="font-semibold text-lg mb-3">Información del Show</h3>
                <p className="text-default-700 leading-relaxed whitespace-pre-wrap">
                  {event.show_description}
                </p>
              </div>
            )}
          </CardBody>
        </Card>
      </div>
    </div>
  );
}