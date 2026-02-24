'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/app/utils/supabase/client';
import { Button } from '@heroui/button';
import { Input, Textarea } from '@heroui/input';
import { Select, SelectItem } from '@heroui/select';
import { Switch } from '@heroui/switch';
import { Card, CardBody, CardHeader } from '@heroui/card';
import { Divider } from '@heroui/divider';
import { Plus, Trash2, ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

// ─── Types ───────────────────────────────────────────────────────────────────

interface Teacher {
  id: string;
  name: string;
  nickname?: string;
}

interface OrganizerEntry {
  teacher_id: string | null;
  is_one_time_teacher: boolean;
  one_time_teacher_name: string;
}

interface ClassEntry {
  class_name: string;
  start_time: string;
  end_time: string;
  class_level: string;
  class_order: number;
}

interface PracticeEntry {
  practice_time: string;
  practice_end_time: string;
}

interface SeminarDayEntry {
  day_number: number;
  date: string;
  theme: string;
  classes: ClassEntry[];
}

interface PricingEntry {
  price_type: string;
  price: string;
  description: string;
}

interface MilongaPreClassEntry {
  class_time: string;
  class_end_time: string;
  class_level: string;
  milonga_start_time: string;
}

export interface EventFormData {
  // Common
  title: string;
  event_type: string;
  date: string;
  has_weekly_recurrence: boolean;
  is_active: boolean;
  venue_name: string;
  address: string;
  contact_phone: string;
  avatar_image_url: string;
  description: string;
  show_description: string;
  // Relations
  organizers: OrganizerEntry[];
  pricing: PricingEntry[];
  // Type-specific
  classes: ClassEntry[];
  practice: PracticeEntry | null;
  milonga_pre_class: MilongaPreClassEntry | null;
  seminar_days: SeminarDayEntry[];
}

const emptyForm: EventFormData = {
  title: '',
  event_type: 'class',
  date: '',
  has_weekly_recurrence: false,
  is_active: true,
  venue_name: '',
  address: '',
  contact_phone: '',
  avatar_image_url: '',
  description: '',
  show_description: '',
  organizers: [],
  pricing: [],
  classes: [],
  practice: null,
  milonga_pre_class: null,
  seminar_days: [],
};

const CLASS_LEVELS = [
  { key: 'beginner', label: 'Principiante' },
  { key: 'intermediate', label: 'Intermedio' },
  { key: 'advanced', label: 'Avanzado' },
  { key: 'all_levels', label: 'Todos los niveles' },
];

const EVENT_TYPES = [
  { key: 'class', label: 'Clase' },
  { key: 'milonga', label: 'Milonga' },
  { key: 'seminar', label: 'Seminario' },
  { key: 'practice', label: 'Práctica' },
  { key: 'special_event', label: 'Evento Especial' },
];

const DAYS_OF_WEEK = [
  { key: '0', label: 'Domingo' },
  { key: '1', label: 'Lunes' },
  { key: '2', label: 'Martes' },
  { key: '3', label: 'Miércoles' },
  { key: '4', label: 'Jueves' },
  { key: '5', label: 'Viernes' },
  { key: '6', label: 'Sábado' },
];

function getNextDateForDow(dow: number): string {
  const today = new Date();
  const diff = (dow - today.getDay() + 7) % 7 || 7;
  const next = new Date(today);
  next.setDate(today.getDate() + diff);
  return next.toISOString().split('T')[0];
}

function getDowFromDate(dateString: string): string {
  if (!dateString) return '';
  const [year, month, day] = dateString.split('-').map(Number);
  return String(new Date(year, month - 1, day).getDay());
}

// ─── Props ───────────────────────────────────────────────────────────────────

interface EventFormProps {
  initialData?: EventFormData;
  eventId?: string;
  mode: 'create' | 'edit';
}

// ─── Component ───────────────────────────────────────────────────────────────

export default function EventForm({ initialData, eventId, mode }: EventFormProps) {
  const router = useRouter();
  const supabase = createClient();

  const [form, setForm] = useState<EventFormData>(initialData || emptyForm);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    supabase
      .from('teachers')
      .select('id, name, nickname')
      .order('name')
      .then(({ data }) => setTeachers(data || []));
  }, []);

  const set = (field: keyof EventFormData, value: any) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  // ─── Organizers ────────────────────────────────────────────────────────────

  const addOrganizer = () =>
    set('organizers', [
      ...form.organizers,
      { teacher_id: null, is_one_time_teacher: false, one_time_teacher_name: '' },
    ]);

  const updateOrganizer = (index: number, field: keyof OrganizerEntry, value: any) => {
    const updated = [...form.organizers];
    updated[index] = { ...updated[index], [field]: value };
    set('organizers', updated);
  };

  const removeOrganizer = (index: number) =>
    set(
      'organizers',
      form.organizers.filter((_, i) => i !== index)
    );

  // ─── Pricing ───────────────────────────────────────────────────────────────

  const addPricing = () =>
    set('pricing', [...form.pricing, { price_type: '', price: '', description: '' }]);

  const updatePricing = (index: number, field: keyof PricingEntry, value: string) => {
    const updated = [...form.pricing];
    updated[index] = { ...updated[index], [field]: value };
    set('pricing', updated);
  };

  const removePricing = (index: number) =>
    set(
      'pricing',
      form.pricing.filter((_, i) => i !== index)
    );

  // ─── Classes ───────────────────────────────────────────────────────────────

  const addClass = () =>
    set('classes', [
      ...form.classes,
      {
        class_name: '',
        start_time: '',
        end_time: '',
        class_level: 'all_levels',
        class_order: form.classes.length + 1,
      },
    ]);

  const updateClass = (index: number, field: keyof ClassEntry, value: any) => {
    const updated = [...form.classes];
    updated[index] = { ...updated[index], [field]: value };
    set('classes', updated);
  };

  const removeClass = (index: number) =>
    set(
      'classes',
      form.classes.filter((_, i) => i !== index)
    );

  // ─── Seminar Days ──────────────────────────────────────────────────────────

  const addSeminarDay = () =>
    set('seminar_days', [
      ...form.seminar_days,
      { day_number: form.seminar_days.length + 1, date: '', theme: '', classes: [] },
    ]);

  const updateSeminarDay = (index: number, field: keyof SeminarDayEntry, value: any) => {
    const updated = [...form.seminar_days];
    updated[index] = { ...updated[index], [field]: value };
    set('seminar_days', updated);
  };

  const removeSeminarDay = (index: number) =>
    set(
      'seminar_days',
      form.seminar_days.filter((_, i) => i !== index)
    );

  const addSeminarDayClass = (dayIndex: number) => {
    const updated = [...form.seminar_days];
    updated[dayIndex].classes = [
      ...updated[dayIndex].classes,
      {
        class_name: '',
        start_time: '',
        end_time: '',
        class_level: 'all_levels',
        class_order: updated[dayIndex].classes.length + 1,
      },
    ];
    set('seminar_days', updated);
  };

  const updateSeminarDayClass = (
    dayIndex: number,
    classIndex: number,
    field: keyof ClassEntry,
    value: any
  ) => {
    const updated = [...form.seminar_days];
    updated[dayIndex].classes[classIndex] = {
      ...updated[dayIndex].classes[classIndex],
      [field]: value,
    };
    set('seminar_days', updated);
  };

  const removeSeminarDayClass = (dayIndex: number, classIndex: number) => {
    const updated = [...form.seminar_days];
    updated[dayIndex].classes = updated[dayIndex].classes.filter((_, i) => i !== classIndex);
    set('seminar_days', updated);
  };

  // ─── Save ──────────────────────────────────────────────────────────────────

  const handleSave = async () => {
    if (!form.title.trim()) {
      setError('El título es obligatorio');
      return;
    }
    if (!form.date) {
      setError('La fecha es obligatoria');
      return;
    }
    setSaving(true);
    setError('');

    try {
      const eventPayload = {
        title: form.title.trim(),
        event_type: form.event_type,
        date: form.date,
        has_weekly_recurrence: form.has_weekly_recurrence,
        is_active: form.is_active,
        venue_name: form.venue_name.trim(),
        address: form.address.trim(),
        contact_phone: form.contact_phone.trim(),
        avatar_image_url: form.avatar_image_url.trim() || null,
        description: form.description.trim() || null,
        show_description: form.show_description.trim() || null,
      };

      let id = eventId;

      if (mode === 'create') {
        const { data, error } = await supabase
          .from('tango_events')
          .insert(eventPayload)
          .select('id')
          .single();
        if (error) throw error;
        id = data.id;
      } else {
        const { error } = await supabase.from('tango_events').update(eventPayload).eq('id', id);
        if (error) throw error;
        // Limpiar relaciones anteriores
        await supabase.from('event_organizers').delete().eq('event_id', id);
        await supabase.from('event_pricing').delete().eq('event_id', id);
        await supabase.from('event_classes').delete().eq('event_id', id);
        await supabase.from('event_practices').delete().eq('event_id', id);
        await supabase.from('milonga_pre_classes').delete().eq('event_id', id);
        await supabase.from('seminar_days').delete().eq('event_id', id);
      }

      // Organizers
      if (form.organizers.length > 0) {
        await supabase.from('event_organizers').insert(
          form.organizers.map((o) => ({
            event_id: id,
            teacher_id: o.is_one_time_teacher ? null : o.teacher_id,
            organizer_type: 'teacher',
            is_primary: false,
            is_one_time_teacher: o.is_one_time_teacher,
            one_time_teacher_name: o.is_one_time_teacher ? o.one_time_teacher_name : null,
          }))
        );
      }

      // Pricing
      if (form.pricing.length > 0) {
        await supabase.from('event_pricing').insert(
          form.pricing.map((p) => ({
            event_id: id,
            price_type: p.price_type,
            price: parseFloat(p.price),
            description: p.description || null,
          }))
        );
      }

      // Type-specific
      if (form.event_type === 'class' || form.event_type === 'special_event') {
        if (form.classes.length > 0) {
          await supabase
            .from('event_classes')
            .insert(form.classes.map((c) => ({ event_id: id, ...c })));
        }
        if (form.practice) {
          await supabase.from('event_practices').insert({ event_id: id, ...form.practice });
        }
      }

      if (form.event_type === 'milonga') {
        if (form.milonga_pre_class) {
          await supabase
            .from('milonga_pre_classes')
            .insert({ event_id: id, ...form.milonga_pre_class });
        }
      }

      if (form.event_type === 'practice') {
        if (form.practice) {
          await supabase.from('event_practices').insert({ event_id: id, ...form.practice });
        }
      }

      if (form.event_type === 'seminar') {
        for (const day of form.seminar_days) {
          const { data: dayData } = await supabase
            .from('seminar_days')
            .insert({
              event_id: id,
              day_number: day.day_number,
              date: day.date,
              theme: day.theme || null,
            })
            .select('id')
            .single();

          if (dayData && day.classes.length > 0) {
            await supabase
              .from('seminar_day_classes')
              .insert(day.classes.map((c) => ({ seminar_day_id: dayData.id, ...c })));
          }
        }
      }

      router.push('/admin/eventos');
    } catch (e: any) {
      setError(e.message || 'Error al guardar');
    } finally {
      setSaving(false);
    }
  };

  // ─── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <Button isIconOnly variant="flat" onPress={() => router.push('/admin/eventos')}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <h1 className="text-2xl font-bold">
            {mode === 'create' ? 'Nuevo evento' : 'Editar evento'}
          </h1>
        </div>

        {/* Campos comunes */}
        <Card>
          <CardHeader>
            <h2 className="font-semibold">Información general</h2>
          </CardHeader>
          <Divider />
          <CardBody className="gap-4">
            <div className="flex items-center justify-between">
              <span className="text-sm">Recurrencia semanal</span>
              <Switch
                isSelected={form.has_weekly_recurrence}
                onValueChange={(v) => {
                  set('has_weekly_recurrence', v);
                  if (v && form.date) {
                    // mantener fecha existente
                  } else if (!v) {
                    set('date', '');
                  }
                }}
              />
            </div>

            <Input
              label="Título"
              value={form.title}
              onChange={(e) => set('title', e.target.value)}
              isRequired
            />
            <Select
              label="Tipo de evento"
              selectedKeys={[form.event_type]}
              onSelectionChange={(keys) => set('event_type', Array.from(keys)[0])}
            >
              {EVENT_TYPES.map((t) => (
                <SelectItem key={t.key}>{t.label}</SelectItem>
              ))}
            </Select>

            {form.has_weekly_recurrence ? (
              <Select
                label="Día de la semana"
                selectedKeys={form.date ? new Set([getDowFromDate(form.date)]) : new Set()}
                onSelectionChange={(keys) => {
                  const dow = Number(Array.from(keys)[0]);
                  set('date', getNextDateForDow(dow));
                }}
              >
                {DAYS_OF_WEEK.map((d) => (
                  <SelectItem key={d.key} textValue={d.label}>
                    {d.label}
                  </SelectItem>
                ))}
              </Select>
            ) : (
              <Input
                label="Fecha"
                type="date"
                value={form.date}
                onChange={(e) => set('date', e.target.value)}
                isRequired
              />
            )}

            <div className="flex items-center justify-between">
              <span className="text-sm">Activo</span>
              <Switch isSelected={form.is_active} onValueChange={(v) => set('is_active', v)} />
            </div>
            <Input
              label="Nombre del lugar"
              value={form.venue_name}
              onChange={(e) => set('venue_name', e.target.value)}
            />
            <Input
              label="Dirección"
              value={form.address}
              onChange={(e) => set('address', e.target.value)}
            />
            <Input
              label="Teléfono de contacto"
              value={form.contact_phone}
              onChange={(e) => set('contact_phone', e.target.value)}
            />
            <Input
              label="URL de avatar"
              value={form.avatar_image_url}
              onChange={(e) => set('avatar_image_url', e.target.value)}
            />
            <Textarea
              label="Descripción"
              value={form.description}
              onChange={(e) => set('description', e.target.value)}
              minRows={2}
            />
            <Textarea
              label="Descripción del show"
              value={form.show_description}
              onChange={(e) => set('show_description', e.target.value)}
              minRows={2}
            />
          </CardBody>
        </Card>

        {/* Organizadores */}
        <Card>
          <CardHeader className="flex justify-between items-center">
            <h2 className="font-semibold">Organizadores</h2>
            <Button
              size="sm"
              variant="flat"
              startContent={<Plus className="w-3 h-3" />}
              onPress={addOrganizer}
            >
              Agregar
            </Button>
          </CardHeader>
          <Divider />
          <CardBody className="gap-4">
            {form.organizers.length === 0 && (
              <p className="text-default-400 text-sm text-center">No hay organizadores agregados</p>
            )}
            {form.organizers.map((org, i) => (
              <div key={i} className="border border-divider rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-default-500">Profesor de una sola vez</span>
                    <Switch
                      size="sm"
                      isSelected={org.is_one_time_teacher}
                      onValueChange={(v) => updateOrganizer(i, 'is_one_time_teacher', v)}
                    />
                  </div>
                  <Button
                    isIconOnly
                    size="sm"
                    variant="flat"
                    color="danger"
                    onPress={() => removeOrganizer(i)}
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
                {org.is_one_time_teacher ? (
                  <Input
                    label="Nombre del profesor"
                    value={org.one_time_teacher_name}
                    onChange={(e) => updateOrganizer(i, 'one_time_teacher_name', e.target.value)}
                  />
                ) : (
                  <Select
                    label="Profesor"
                    selectedKeys={org.teacher_id ? new Set([org.teacher_id]) : new Set()}
                    onSelectionChange={(keys) => {
                      const selected = Array.from(keys)[0];
                      updateOrganizer(i, 'teacher_id', selected ?? null);
                    }}
                  >
                    {teachers.map((t) => {
                      const label = t.name + (t.nickname ? ` (${t.nickname})` : '');
                      return (
                        <SelectItem key={t.id} textValue={label}>
                          {label}
                        </SelectItem>
                      );
                    })}
                  </Select>
                )}
              </div>
            ))}
          </CardBody>
        </Card>

        {/* Precios */}
        <Card>
          <CardHeader className="flex justify-between items-center">
            <h2 className="font-semibold">Precios</h2>
            <Button
              size="sm"
              variant="flat"
              startContent={<Plus className="w-3 h-3" />}
              onPress={addPricing}
            >
              Agregar
            </Button>
          </CardHeader>
          <Divider />
          <CardBody className="gap-4">
            {form.pricing.length === 0 && (
              <p className="text-default-400 text-sm text-center">No hay precios cargados</p>
            )}
            {form.pricing.map((p, i) => (
              <div key={i} className="border border-divider rounded-lg p-4 space-y-3">
                <div className="flex justify-end">
                  <Button
                    isIconOnly
                    size="sm"
                    variant="flat"
                    color="danger"
                    onPress={() => removePricing(i)}
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
                <Input
                  label="Tipo (ej: General, Estudiante)"
                  value={p.price_type}
                  onChange={(e) => updatePricing(i, 'price_type', e.target.value)}
                />
                <Input
                  label="Precio"
                  type="number"
                  value={p.price}
                  onChange={(e) => updatePricing(i, 'price', e.target.value)}
                />
                <Input
                  label="Descripción"
                  value={p.description}
                  onChange={(e) => updatePricing(i, 'description', e.target.value)}
                />
              </div>
            ))}
          </CardBody>
        </Card>

        {/* Clases (type: class o special_event) */}
        {(form.event_type === 'class' || form.event_type === 'special_event') && (
          <Card>
            <CardHeader className="flex justify-between items-center">
              <h2 className="font-semibold">Clases</h2>
              <Button
                size="sm"
                variant="flat"
                startContent={<Plus className="w-3 h-3" />}
                onPress={addClass}
              >
                Agregar clase
              </Button>
            </CardHeader>
            <Divider />
            <CardBody className="gap-4">
              {form.classes.length === 0 && (
                <p className="text-default-400 text-sm text-center">No hay clases agregadas</p>
              )}
              {form.classes.map((cls, i) => (
                <div key={i} className="border border-divider rounded-lg p-4 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Clase {i + 1}</span>
                    <Button
                      isIconOnly
                      size="sm"
                      variant="flat"
                      color="danger"
                      onPress={() => removeClass(i)}
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                  <Input
                    label="Nombre de la clase"
                    value={cls.class_name}
                    onChange={(e) => updateClass(i, 'class_name', e.target.value)}
                  />
                  <div className="grid grid-cols-2 gap-3">
                    <Input
                      label="Inicio"
                      type="time"
                      value={cls.start_time}
                      onChange={(e) => updateClass(i, 'start_time', e.target.value)}
                    />
                    <Input
                      label="Fin"
                      type="time"
                      value={cls.end_time}
                      onChange={(e) => updateClass(i, 'end_time', e.target.value)}
                    />
                  </div>
                  <Select
                    label="Nivel"
                    selectedKeys={[cls.class_level]}
                    onSelectionChange={(keys) => updateClass(i, 'class_level', Array.from(keys)[0])}
                  >
                    {CLASS_LEVELS.map((l) => (
                      <SelectItem key={l.key}>{l.label}</SelectItem>
                    ))}
                  </Select>
                </div>
              ))}
            </CardBody>
          </Card>
        )}

        {/* Práctica (type: class o practice) */}
        {(form.event_type === 'class' || form.event_type === 'practice') && (
          <Card>
            <CardHeader className="flex justify-between items-center">
              <h2 className="font-semibold">Práctica</h2>
              {!form.practice && (
                <Button
                  size="sm"
                  variant="flat"
                  startContent={<Plus className="w-3 h-3" />}
                  onPress={() => set('practice', { practice_time: '', practice_end_time: '' })}
                >
                  Agregar práctica
                </Button>
              )}
            </CardHeader>
            <Divider />
            <CardBody className="gap-4">
              {!form.practice ? (
                <p className="text-default-400 text-sm text-center">No hay práctica cargada</p>
              ) : (
                <div className="border border-divider rounded-lg p-4 space-y-3">
                  <div className="flex justify-end">
                    <Button
                      isIconOnly
                      size="sm"
                      variant="flat"
                      color="danger"
                      onPress={() => set('practice', null)}
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <Input
                      label="Inicio"
                      type="time"
                      value={form.practice.practice_time}
                      onChange={(e) =>
                        set('practice', { ...form.practice, practice_time: e.target.value })
                      }
                    />
                    <Input
                      label="Fin"
                      type="time"
                      value={form.practice.practice_end_time}
                      onChange={(e) =>
                        set('practice', { ...form.practice, practice_end_time: e.target.value })
                      }
                    />
                  </div>
                </div>
              )}
            </CardBody>
          </Card>
        )}

        {/* Pre-clase milonga */}
        {form.event_type === 'milonga' && (
          <Card>
            <CardHeader className="flex justify-between items-center">
              <h2 className="font-semibold">Pre-clase</h2>
              {!form.milonga_pre_class && (
                <Button
                  size="sm"
                  variant="flat"
                  startContent={<Plus className="w-3 h-3" />}
                  onPress={() =>
                    set('milonga_pre_class', {
                      class_time: '',
                      class_end_time: '',
                      class_level: 'all_levels',
                      milonga_start_time: '',
                    })
                  }
                >
                  Agregar pre-clase
                </Button>
              )}
            </CardHeader>
            <Divider />
            <CardBody className="gap-4">
              {!form.milonga_pre_class ? (
                <p className="text-default-400 text-sm text-center">Sin pre-clase</p>
              ) : (
                <div className="border border-divider rounded-lg p-4 space-y-3">
                  <div className="flex justify-end">
                    <Button
                      isIconOnly
                      size="sm"
                      variant="flat"
                      color="danger"
                      onPress={() => set('milonga_pre_class', null)}
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <Input
                      label="Inicio clase"
                      type="time"
                      value={form.milonga_pre_class.class_time}
                      onChange={(e) =>
                        set('milonga_pre_class', {
                          ...form.milonga_pre_class,
                          class_time: e.target.value,
                        })
                      }
                    />
                    <Input
                      label="Fin clase"
                      type="time"
                      value={form.milonga_pre_class.class_end_time}
                      onChange={(e) =>
                        set('milonga_pre_class', {
                          ...form.milonga_pre_class,
                          class_end_time: e.target.value,
                        })
                      }
                    />
                  </div>
                  <Select
                    label="Nivel"
                    selectedKeys={[form.milonga_pre_class.class_level]}
                    onSelectionChange={(keys) =>
                      set('milonga_pre_class', {
                        ...form.milonga_pre_class,
                        class_level: Array.from(keys)[0],
                      })
                    }
                  >
                    {CLASS_LEVELS.map((l) => (
                      <SelectItem key={l.key}>{l.label}</SelectItem>
                    ))}
                  </Select>
                  <Input
                    label="Inicio milonga"
                    type="time"
                    value={form.milonga_pre_class.milonga_start_time}
                    onChange={(e) =>
                      set('milonga_pre_class', {
                        ...form.milonga_pre_class,
                        milonga_start_time: e.target.value,
                      })
                    }
                  />
                </div>
              )}
            </CardBody>
          </Card>
        )}

        {/* Días de seminario */}
        {form.event_type === 'seminar' && (
          <Card>
            <CardHeader className="flex justify-between items-center">
              <h2 className="font-semibold">Días del seminario</h2>
              <Button
                size="sm"
                variant="flat"
                startContent={<Plus className="w-3 h-3" />}
                onPress={addSeminarDay}
              >
                Agregar día
              </Button>
            </CardHeader>
            <Divider />
            <CardBody className="gap-4">
              {form.seminar_days.length === 0 && (
                <p className="text-default-400 text-sm text-center">No hay días cargados</p>
              )}
              {form.seminar_days.map((day, di) => (
                <div key={di} className="border border-divider rounded-lg p-4 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Día {day.day_number}</span>
                    <Button
                      isIconOnly
                      size="sm"
                      variant="flat"
                      color="danger"
                      onPress={() => removeSeminarDay(di)}
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                  <Input
                    label="Fecha"
                    type="date"
                    value={day.date}
                    onChange={(e) => updateSeminarDay(di, 'date', e.target.value)}
                  />
                  <Input
                    label="Tema"
                    value={day.theme}
                    onChange={(e) => updateSeminarDay(di, 'theme', e.target.value)}
                  />

                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-default-500">Clases del día</span>
                      <Button
                        size="sm"
                        variant="flat"
                        startContent={<Plus className="w-3 h-3" />}
                        onPress={() => addSeminarDayClass(di)}
                      >
                        Agregar clase
                      </Button>
                    </div>
                    {day.classes.map((cls, ci) => (
                      <div
                        key={ci}
                        className="border border-divider rounded-lg p-3 space-y-3 bg-default-50"
                      >
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium">Clase {ci + 1}</span>
                          <Button
                            isIconOnly
                            size="sm"
                            variant="flat"
                            color="danger"
                            onPress={() => removeSeminarDayClass(di, ci)}
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                        <Input
                          label="Nombre"
                          value={cls.class_name}
                          onChange={(e) =>
                            updateSeminarDayClass(di, ci, 'class_name', e.target.value)
                          }
                        />
                        <div className="grid grid-cols-2 gap-3">
                          <Input
                            label="Inicio"
                            type="time"
                            value={cls.start_time}
                            onChange={(e) =>
                              updateSeminarDayClass(di, ci, 'start_time', e.target.value)
                            }
                          />
                          <Input
                            label="Fin"
                            type="time"
                            value={cls.end_time}
                            onChange={(e) =>
                              updateSeminarDayClass(di, ci, 'end_time', e.target.value)
                            }
                          />
                        </div>
                        <Select
                          label="Nivel"
                          selectedKeys={[cls.class_level]}
                          onSelectionChange={(keys) =>
                            updateSeminarDayClass(di, ci, 'class_level', Array.from(keys)[0])
                          }
                        >
                          {CLASS_LEVELS.map((l) => (
                            <SelectItem key={l.key}>{l.label}</SelectItem>
                          ))}
                        </Select>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </CardBody>
          </Card>
        )}

        {/* Error y guardar */}
        {error && <p className="text-danger text-sm">{error}</p>}
        <div className="flex justify-end gap-3 pb-8">
          <Button variant="flat" onPress={() => router.push('/admin/eventos')}>
            Cancelar
          </Button>
          <Button color="primary" isLoading={saving} onPress={handleSave}>
            {mode === 'create' ? 'Crear evento' : 'Guardar cambios'}
          </Button>
        </div>
      </div>
    </div>
  );
}
