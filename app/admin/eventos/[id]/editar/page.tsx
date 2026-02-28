'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { createClient } from '@/app/utils/supabase/client';
import EventForm, { EventFormData } from '../../_components/EventForm';

export default function EditarEventoPage() {
  const { id } = useParams<{ id: string }>();
  const supabase = createClient();

  const [initialData, setInitialData] = useState<EventFormData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvent = async () => {
      const { data, error } = await supabase
        .from('tango_events')
        .select(`
          *,
          classes:event_classes (id, class_name, start_time, end_time, class_level, class_order),
          practice:event_practices (id, practice_time, practice_end_time),
          organizers:event_organizers (id, teacher_id, is_one_time_teacher, one_time_teacher_name),
          pricing:event_pricing (id, price_type, price, description),
          milonga_pre_class:milonga_pre_classes (id, class_time, class_end_time, class_level, milonga_start_time),
          seminar_days (id, day_number, date, theme, seminar_day_classes (id, class_name, start_time, end_time, class_level, class_order))
        `)
        .eq('id', id)
        .single();

      if (error || !data) {
        setLoading(false);
        return;
      }

      const mpc = Array.isArray(data.milonga_pre_class)
        ? data.milonga_pre_class[0]
        : data.milonga_pre_class;

      const milongaStartTime = mpc?.milonga_start_time || '';
      const hasPreClass = !!(mpc?.class_time);

      const formData: EventFormData = {
        title: data.title || '',
        event_type: data.event_type || 'class',
        date: data.date || '',
        has_weekly_recurrence: data.has_weekly_recurrence || false,
        is_active: data.is_active ?? true,
        venue_name: data.venue_name || '',
        address: data.address || '',
        contact_phone: data.contact_phone || '',
        avatar_image_url: data.avatar_image_url || '',
        description: data.description || '',
        show_description: data.show_description || '',
        organizers: (data.organizers || []).map((o: any) => ({
          teacher_id: o.teacher_id || null,
          is_one_time_teacher: o.is_one_time_teacher || false,
          one_time_teacher_name: o.one_time_teacher_name || '',
        })),
        pricing: (data.pricing || []).map((p: any) => ({
          price_type: p.price_type || '',
          price: String(p.price || ''),
          description: p.description || '',
        })),
        classes: (data.classes || [])
          .sort((a: any, b: any) => a.class_order - b.class_order)
          .map((c: any) => ({
            class_name: c.class_name || '',
            start_time: c.start_time || '',
            end_time: c.end_time || '',
            class_level: c.class_level || 'all_levels',
            class_order: c.class_order || 1,
          })),
        practice: data.practice?.[0]
          ? {
              practice_time: data.practice[0].practice_time || '',
              practice_end_time: data.practice[0].practice_end_time || '',
            }
          : null,
        milonga_start_time: milongaStartTime,
        milonga_pre_class: hasPreClass
          ? {
              class_time: mpc.class_time || '',
              class_end_time: mpc.class_end_time || '',
              class_level: mpc.class_level || 'all_levels',
            }
          : null,
        seminar_days: (data.seminar_days || [])
          .sort((a: any, b: any) => a.day_number - b.day_number)
          .map((d: any) => ({
            day_number: d.day_number,
            date: d.date || '',
            theme: d.theme || '',
            classes: (d.seminar_day_classes || [])
              .sort((a: any, b: any) => a.class_order - b.class_order)
              .map((c: any) => ({
                class_name: c.class_name || '',
                start_time: c.start_time || '',
                end_time: c.end_time || '',
                class_level: c.class_level || 'all_levels',
                class_order: c.class_order || 1,
              })),
          })),
      };

      setInitialData(formData);
      setLoading(false);
    };

    fetchEvent();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-default-500">Cargando evento...</p>
      </div>
    );
  }

  if (!initialData) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-danger">No se encontró el evento</p>
      </div>
    );
  }

  return <EventForm mode="edit" eventId={id} initialData={initialData} />;
}