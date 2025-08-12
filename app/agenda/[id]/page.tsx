import { EventWithDetails } from '@/app/types';
import { Avatar } from '@heroui/avatar';
import { Button } from '@heroui/button';
import { Card, CardBody, CardHeader } from '@heroui/card';
import { Chip } from '@heroui/chip';
import { createClient } from '@supabase/supabase-js';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { ArrowLeft, Calendar, Clock, DollarSign, MapPin, User } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';

interface EventPageProps {
  params: Promise<{ id: string }>;
}

// Server-side function to fetch event by ID
async function getEventById(id: string): Promise<EventWithDetails | null> {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  try {
    const { data: event, error } = await supabase
      .from('events')
      .select(
        `
        *,
        event_schedules (
          id,
          start_date,
          end_date,
          start_time,
          end_time,
          timezone,
          recurrence_pattern,
          recurrence_rule,
          days_of_week,
          ends_at
        ),
        event_images (
          id,
          image_url,
          meta_media_id,
          caption,
          display_order
        ),
        event_teachers (
          id,
          is_primary_teacher,
          teacher:users!event_teachers_teacher_id_fkey (
            id,
            name,
            phone_number
          )
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

    return event as EventWithDetails;
  } catch (error) {
    console.error('Server-side error:', error);
    return null;
  }
}

// Loading component for Suspense
function EventLoading() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Card className="mb-6">
          {/* Image skeleton */}
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

            <div className="space-y-3 mb-6">
              <div className="w-24 h-6 bg-default-200 rounded animate-pulse"></div>
              <div className="space-y-2">
                <div className="w-full h-4 bg-default-200 rounded animate-pulse"></div>
                <div className="w-full h-4 bg-default-200 rounded animate-pulse"></div>
                <div className="w-2/3 h-4 bg-default-200 rounded animate-pulse"></div>
              </div>
            </div>
          </CardBody>
        </Card>

        <div className="flex gap-4 justify-center">
          <div className="w-40 h-12 bg-default-200 rounded-lg animate-pulse"></div>
          <div className="w-40 h-12 bg-default-200 rounded-lg animate-pulse"></div>
        </div>
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

// Event detail component
function EventDetail({ event }: { event: EventWithDetails }) {
  const primarySchedule = event.event_schedules?.[0];
  const primaryTeacher = event.event_teachers?.find(
    (et: { is_primary_teacher: any }) => et.is_primary_teacher
  )?.teacher;
  const allTeachers = event.event_teachers?.map((et: { teacher: any }) => et.teacher) || [];
  const mainImage =
    event.event_images?.find((img: { display_order: number }) => img.display_order === 0) ||
    event.event_images?.[0];
  const additionalImages =
    event.event_images?.filter((img: { display_order: number }) => img.display_order > 0) || [];

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
    <div className="">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Main Event Card */}
        <Card className="mb-6">
          <Link href="/agenda">
            <Button
              variant="light"
              startContent={<ArrowLeft className="w-4 h-4" />}
              className="text-default-600 hover:text-default-900"
            >
              Volver
            </Button>
          </Link>
          {/* {mainImage && (
            <div className="relative w-full h-64 md:h-80 overflow-hidden">
              <Image
                src={mainImage.image_url}
                alt={event.title}
                fill
                className="object-cover"
                priority
              />
              {mainImage.caption && (
                <div className="absolute bottom-4 left-4 bg-black/60 text-white px-3 py-1 rounded-lg text-sm">
                  {mainImage.caption}
                </div>
              )}
            </div>
          )} */}

          <CardHeader className="pb-2">
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

                  {event.class_level && (
                    <Chip size="md" color="success" variant="flat">
                      {formatClassLevel(event.class_level)}
                    </Chip>
                  )}
                </div>

                <h1 className="text-2xl md:text-3xl font-bold text-foreground leading-tight">
                  {event.title}
                </h1>
              </div>

              {event.price && (
                <div className="text-right">
                  <div className="flex items-center gap-1 text-2xl font-bold text-foreground">
                    <DollarSign className="w-6 h-6" />
                    {event.price}
                  </div>
                </div>
              )}
            </div>
          </CardHeader>

          <CardBody className="pt-0">
            {/* Event Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {/* Date and Time */}
              {primarySchedule && (
                <div className="space-y-3">
                  <h3 className="font-semibold text-lg flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-primary" />
                    Fecha y Horario
                  </h3>

                  <div className="space-y-2 text-default-700">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-default-500" />
                      <span className="font-medium">
                        {format(new Date(primarySchedule.start_date), 'EEEE, dd MMMM yyyy', {
                          locale: es,
                        })}
                      </span>
                    </div>

                    {primarySchedule.start_time && (
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-default-500" />
                        <span>
                          {primarySchedule.start_time.slice(0, 5)}
                          {primarySchedule.end_time && ` - ${primarySchedule.end_time.slice(0, 5)}`}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}

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

              {/* Teachers */}
              {allTeachers.length > 0 && (
                <div className="space-y-3">
                  <h3 className="font-semibold text-lg flex items-center gap-2">
                    <User className="w-5 h-5 text-primary" />
                    {allTeachers.length > 1 ? 'Profesores' : 'Profesor'}
                  </h3>

                  <div className="space-y-2">
                    {allTeachers.map((teacher: any, index: number) => (
                      <div key={index} className="flex items-center gap-3">
                        <Avatar
                          name={teacher?.name || 'Profesor'}
                          size="sm"
                          className="flex-shrink-0"
                        />
                        <div>
                          <div className="font-medium text-default-700">
                            {teacher?.name || 'Profesor'}
                          </div>
                          {teacher?.phone_number && (
                            <div className="text-xs text-default-500">{teacher?.phone_number}</div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Description */}
            {event.description && (
              <div className="mb-6">
                <h3 className="font-semibold text-lg mb-3">Descripción</h3>
                <p className="text-default-700 leading-relaxed whitespace-pre-wrap">
                  {event.description}
                </p>
              </div>
            )}

            {/* Additional Images */}
            {/* {additionalImages.length > 0 && (
              <div>
                <h3 className="font-semibold text-lg mb-4">Más imágenes</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {additionalImages.map((image: any) => (
                    <div key={image?.id} className="relative aspect-square overflow-hidden rounded-lg">
                      <Image
                        src={image?.image_url}
                        alt={image?.caption || event.title}
                        fill
                        className="object-cover hover:scale-105 transition-transform duration-300"
                      />
                      {image?.caption && (
                        <div className="absolute bottom-2 left-2 right-2 bg-black/60 text-white px-2 py-1 rounded text-xs">
                          {image?.caption}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )} */}
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
