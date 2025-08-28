import { CompleteEventData, EventType, ClassLevel } from '@/app/types';
import { Avatar } from '@heroui/avatar';
import { Button } from '@heroui/button';
import { Card, CardBody, CardHeader } from '@heroui/card';
import { Chip } from '@heroui/chip';
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

// Server-side function to fetch event by ID
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
        classes: day.seminar_day_classes || []
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
  const primaryOrganizer = event.organizers?.find(org => org.is_primary);
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

  const getEventTypeIcon = (type: EventType) => {
    const iconMap = {
      special_event: '🎉',
      class: '📚',
      seminar: '🎓',
      milonga: '💃',
    };
    return iconMap[type] || '📅';
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Main Event Card */}
        <Card className="mb-6">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between mb-4">
              <Link href="/agenda">
                <Button
                  variant="light"
                  startContent={<ArrowLeft className="w-4 h-4" />}
                  className="text-default-600 hover:text-default-900"
                >
                  Volver
                </Button>
              </Link>
            </div>

            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <Chip
                    size="md"
                    variant="flat"
                    color={getEventTypeColor(event.event_type) as any}
                    startContent={
                      <span className="text-lg">{getEventTypeIcon(event.event_type)}</span>
                    }
                    className="font-medium"
                  >
                    {formatEventType(event.event_type)}
                  </Chip>
                </div>

                <h1 className="text-2xl md:text-3xl font-bold text-foreground leading-tight mb-2">
                  {event.title}
                </h1>
                
                {event.venue_name && (
                  <p className="text-lg text-default-600">{event.venue_name}</p>
                )}
              </div>

              {event.pricing && event.pricing.length > 0 && (
                <div className="text-right">
                  <div className="flex items-center gap-1 text-2xl font-bold text-foreground">
                    <DollarSign className="w-6 h-6" />
                    {event.pricing[0].price}
                  </div>
                  {event.pricing[0].description && (
                    <p className="text-sm text-default-500">{event.pricing[0].description}</p>
                  )}
                </div>
              )}
            </div>
          </CardHeader>

          <CardBody className="pt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="space-y-3">
                <h3 className="font-semibold text-lg flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-primary" />
                  Fecha
                </h3>
                <div className="flex items-center gap-2 text-default-700">
                  <Calendar className="w-4 h-4 text-default-500" />
                  <span className="font-medium">
                    {format(new Date(event.date), 'EEEE, dd MMMM yyyy', {
                      locale: es,
                    })}
                  </span>
                </div>
                {event.has_weekly_recurrence && (
                  <div className="text-sm text-default-600">
                    Se repite semanalmente
                  </div>
                )}
              </div>

              {/* Location */}
              {event.address && (
                <div className="space-y-3">
                  <h3 className="font-semibold text-lg flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-primary" />
                    Ubicación
                  </h3>
                  <div className="flex items-start gap-2 text-default-700">
                    <MapPin className="w-4 h-4 text-default-500 mt-1 flex-shrink-0" />
                    <span>{event.address}</span>
                  </div>
                </div>
              )}

              {allOrganizers.length > 0 && (
                <div className="space-y-3">
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
                              {organizer.is_primary && (
                                <Chip size="sm" color="primary" variant="flat">
                                  Principal
                                </Chip>
                              )}
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

              {(event.contact_phone || event.reminder_phone) && (
                <div className="space-y-3">
                  <h3 className="font-semibold text-lg">Contacto</h3>
                  {event.contact_phone && (
                    <div className="text-default-700">
                      <span className="text-sm text-default-500">Información: </span>
                      <span className="font-medium">{event.contact_phone}</span>
                    </div>
                  )}
                  {event.reminder_phone && (
                    <div className="text-default-700">
                      <span className="text-sm text-default-500">Recordatorios: </span>
                      <span className="font-medium">{event.reminder_phone}</span>
                    </div>
                  )}
                </div>
              )}
            </div>

            {event.classes && event.classes.length > 0 && (
              <div className="mb-6">
                <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                  <GraduationCap className="w-5 h-5 text-primary" />
                  {event.classes.length > 1 ? 'Clases' : 'Clase'}
                </h3>
                <div className="space-y-3">
                  {event.classes
                    .sort((a, b) => a.class_order - b.class_order)
                    .map((classItem) => (
                      <div
                        key={classItem.id}
                        className="flex items-center justify-between p-4 bg-default-50 rounded-lg"
                      >
                        <div className="flex-1">
                          <div className="font-medium text-default-700">
                            {classItem.class_name || 'Clase de Tango'}
                          </div>
                          {classItem.class_level && (
                            <div className="text-sm text-default-600">
                              {formatClassLevel(classItem.class_level)}
                            </div>
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-default-600">
                          <Clock className="w-4 h-4" />
                          <span className="font-medium">
                            {classItem.start_time.slice(0, 5)}
                            {classItem.end_time && ` - ${classItem?.end_time?.slice(0, 5)}`}
                          </span>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}

            {event.practice && (
              <div className="mb-6">
                <h3 className="font-semibold text-lg mb-3">Práctica</h3>
                <div className="flex items-center justify-between p-4 bg-default-50 rounded-lg">
                  <span className="font-medium text-default-700">Práctica libre</span>
                  <div className="flex items-center gap-2 text-default-600">
                    <Clock className="w-4 h-4" />
                    <span className="font-medium">
                      {event.practice?.practice_time?.slice(0, 5)}
                      {event.practice.practice_end_time &&
                        ` - ${event.practice.practice_end_time.slice(0, 5)}`}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {event.milonga_pre_class && (
              <div className="mb-6">
                <h3 className="font-semibold text-lg mb-3">Pre-clase de Milonga</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-4 bg-default-50 rounded-lg">
                    <div className="flex-1">
                      <div className="font-medium text-default-700">Clase previa</div>
                      {event.milonga_pre_class.class_level && (
                        <div className="text-sm text-default-600">
                          {formatClassLevel(event.milonga_pre_class.class_level)}
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-default-600">
                      <Clock className="w-4 h-4" />
                      <span className="font-medium">
                        {event.milonga_pre_class?.class_time?.slice(0, 5)}
                        {event.milonga_pre_class.class_end_time &&
                          ` - ${event.milonga_pre_class.class_end_time.slice(0, 5)}`}
                      </span>
                    </div>
                  </div>
                  {event.milonga_pre_class.milonga_start_time && (
                    <div className="text-sm text-default-600">
                      <strong>Milonga comienza:</strong>{' '}
                      {event.milonga_pre_class.milonga_start_time.slice(0, 5)}
                    </div>
                  )}
                </div>
              </div>
            )}

            {event.seminar_days && event.seminar_days.length > 0 && (
              <div className="mb-6">
                <h3 className="font-semibold text-lg mb-4">Días del Seminario</h3>
                <div className="space-y-4">
                  {event.seminar_days
                    .sort((a, b) => a.day_number - b.day_number)
                    .map((seminarDay) => (
                      <div key={seminarDay.id} className="border border-default-200 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <h4 className="font-medium text-default-700">
                              Día {seminarDay.day_number}
                            </h4>
                            <div className="text-sm text-default-600">
                              {format(new Date(seminarDay.date), 'EEEE, dd MMMM yyyy', {
                                locale: es,
                              })}
                            </div>
                          </div>
                          {seminarDay.theme && (
                            <Chip size="sm" variant="flat" color="success">
                              {seminarDay.theme}
                            </Chip>
                          )}
                        </div>
                        
                        {seminarDay.classes && seminarDay.classes.length > 0 && (
                          <div className="space-y-2">
                            {seminarDay.classes
                              .sort((a, b) => a.class_order - b.class_order)
                              .map((classItem) => (
                                <div
                                  key={classItem.id}
                                  className="flex items-center justify-between p-3 bg-default-50 rounded"
                                >
                                  <div className="flex-1">
                                    <div className="font-medium text-default-700">
                                      {classItem.class_name}
                                    </div>
                                    {classItem.class_level && (
                                      <div className="text-sm text-default-600">
                                        {formatClassLevel(classItem.class_level)}
                                      </div>
                                    )}
                                  </div>
                                  <div className="flex items-center gap-2 text-default-600">
                                    <Clock className="w-4 h-4" />
                                    <span className="font-medium">
                                      {classItem.start_time.slice(0, 5)}
                                      {classItem.end_time && ` - ${classItem.end_time.slice(0, 5)}`}
                                    </span>
                                  </div>
                                </div>
                              ))}
                          </div>
                        )}
                      </div>
                    ))}
                </div>
              </div>
            )}

            {event.pricing && event.pricing.length > 1 && (
              <div className="mb-6">
                <h3 className="font-semibold text-lg mb-4">Opciones de Precio</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {event.pricing.map((price) => (
                    <div
                      key={price.id}
                      className="flex items-center justify-between p-4 bg-default-50 rounded-lg"
                    >
                      <div className="flex-1">
                        <div className="font-medium text-default-700">{price.price_type}</div>
                        {price.description && (
                          <div className="text-sm text-default-600">{price.description}</div>
                        )}
                      </div>
                      <div className="flex items-center gap-1 text-lg font-semibold text-foreground">
                        <DollarSign className="w-5 h-5" />
                        {price.price}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

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