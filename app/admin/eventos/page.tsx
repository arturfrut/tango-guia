'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/app/utils/supabase/client';
import { Card, CardBody, CardHeader } from '@heroui/card';
import { Button } from '@heroui/button';
import { Chip } from '@heroui/chip';
import { Divider } from '@heroui/divider';
import { ArrowLeft, Plus, Pencil, Trash2, Power, ChevronDown } from 'lucide-react';
import { useRouter } from 'next/navigation';

// ─── Types ───────────────────────────────────────────────────────────────────

interface EventRow {
  id: string;
  title: string;
  event_type: string;
  date: string;
  has_weekly_recurrence: boolean;
  is_active: boolean;
  deleted_at: string | null;
  classes: { id: string }[];
  practice: { id: string }[];
  milonga_pre_class: { id: string }[];
}

// ─── Constants ───────────────────────────────────────────────────────────────

const EVENT_TYPE_LABELS: Record<string, string> = {
  class: 'Clase',
  milonga: 'Milonga',
  seminar: 'Seminario',
  practice: 'Práctica',
  special_event: 'Evento Especial',
};

const EVENT_TYPE_COLORS: Record<string, 'primary' | 'secondary' | 'success' | 'warning' | 'danger'> = {
  class: 'primary',
  milonga: 'secondary',
  seminar: 'success',
  practice: 'warning',
  special_event: 'danger',
};

const DAYS_FULL = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
const DAYS_SHORT = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
const RECURRING_VISIBLE = 10;
const ONE_TIME_INITIAL = 5;

// ─── Helpers ─────────────────────────────────────────────────────────────────

function getEventChips(event: EventRow) {
  const chips: { label: string; color: 'primary' | 'secondary' | 'success' | 'warning' | 'danger' }[] = [];

  chips.push({
    label: EVENT_TYPE_LABELS[event.event_type] || event.event_type,
    color: EVENT_TYPE_COLORS[event.event_type] || 'primary',
  });

  if (event.classes?.length > 0 && event.event_type !== 'class') {
    chips.push({ label: 'Clase', color: 'primary' });
  }

  if (event.practice?.length > 0) {
    chips.push({ label: 'Práctica', color: 'warning' });
  }

if (event.milonga_pre_class?.length > 0 && event.event_type !== 'milonga' && event.event_type !== 'class') {
  chips.push({ label: 'Clase', color: 'primary' });
}

  return chips;
}

function formatDate(dateString: string) {
  const [year, month, day] = dateString.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  return `${DAYS_SHORT[date.getDay()]} ${String(day).padStart(2, '0')}/${String(month).padStart(2, '0')}/${year}`;
}

function getOrderedDays(todayDow: number): number[] {
  const order = [];
  for (let i = 0; i < 7; i++) {
    order.push((todayDow + i) % 7);
  }
  return order;
}

// ─── Event Row Component ─────────────────────────────────────────────────────

function EventTableRow({
  event,
  showDate,
  onToggleActive,
  onDelete,
  onEdit,
}: {
  event: EventRow;
  showDate: boolean;
  onToggleActive: (e: EventRow) => void;
  onDelete: (id: string) => void;
  onEdit: (id: string) => void;
}) {
  const chips = getEventChips(event);

  return (
    <tr className="border-b border-divider last:border-0 hover:bg-default-50">
      <td className="px-4 py-3 font-medium">{event.title}</td>
      <td className="px-4 py-3">
        <div className="flex flex-wrap gap-1">
          {chips.map((chip, i) => (
            <Chip key={i} size="sm" color={chip.color} variant="flat">
              {chip.label}
            </Chip>
          ))}
        </div>
      </td>
      {showDate && (
        <td className="px-4 py-3 text-default-500 text-sm">{formatDate(event.date)}</td>
      )}
      <td className="px-4 py-3">
        <Chip size="sm" variant="flat" color={event.is_active ? 'success' : 'default'}>
          {event.is_active ? 'Activo' : 'Inactivo'}
        </Chip>
      </td>
      <td className="px-4 py-3">
        <div className="flex items-center gap-2 justify-end">
          <Button
            isIconOnly size="sm" variant="flat"
            color={event.is_active ? 'warning' : 'success'}
            onPress={() => onToggleActive(event)}
            title={event.is_active ? 'Desactivar' : 'Activar'}
          >
            <Power className="w-3 h-3" />
          </Button>
          <Button isIconOnly size="sm" variant="flat" onPress={() => onEdit(event.id)}>
            <Pencil className="w-3 h-3" />
          </Button>
          <Button isIconOnly size="sm" variant="flat" color="danger" onPress={() => onDelete(event.id)}>
            <Trash2 className="w-3 h-3" />
          </Button>
        </div>
      </td>
    </tr>
  );
}

// ─── Event Table Component ────────────────────────────────────────────────────

function EventTable({
  title,
  events,
  showDate,
  initialVisible,
  onToggleActive,
  onDelete,
  onEdit,
  onLoadMore,
  hasMore,
  loadingMore,
}: {
  title: string;
  events: EventRow[];
  showDate: boolean;
  initialVisible: number;
  onToggleActive: (e: EventRow) => void;
  onDelete: (id: string) => void;
  onEdit: (id: string) => void;
  onLoadMore?: () => void;
  hasMore?: boolean;
  loadingMore?: boolean;
}) {
  const [expanded, setExpanded] = useState(false);
  const visible = expanded ? events : events.slice(0, initialVisible);
  const canExpand = events.length > initialVisible || hasMore;

  const handleExpand = () => {
    if (!expanded && hasMore && onLoadMore) {
      onLoadMore();
    }
    setExpanded(true);
  };

  return (
    <Card>
      <CardHeader>
        <h2 className="font-semibold">{title}</h2>
        <span className="text-default-400 text-sm ml-2">({events.length}{hasMore ? '+' : ''})</span>
      </CardHeader>
      <Divider />
      <CardBody className="p-0">
        {events.length === 0 ? (
          <div className="p-4 text-center text-default-400 text-sm">Sin eventos</div>
        ) : (
          <>
            <table className="w-full">
              <thead>
                <tr className="border-b border-divider">
                  <th className="text-left px-4 py-3 text-xs font-semibold text-default-500 uppercase">Título</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-default-500 uppercase">Tipo</th>
                  {showDate && <th className="text-left px-4 py-3 text-xs font-semibold text-default-500 uppercase">Fecha</th>}
                  <th className="text-left px-4 py-3 text-xs font-semibold text-default-500 uppercase">Estado</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody>
                {visible.map((event) => (
                  <EventTableRow
                    key={event.id}
                    event={event}
                    showDate={showDate}
                    onToggleActive={onToggleActive}
                    onDelete={onDelete}
                    onEdit={onEdit}
                  />
                ))}
              </tbody>
            </table>
            {!expanded && canExpand && (
              <div className="p-3 text-center border-t border-divider">
                <Button
                  size="sm" variant="flat"
                  startContent={<ChevronDown className="w-3 h-3" />}
                  isLoading={loadingMore}
                  onPress={handleExpand}
                >
                  Ver más
                </Button>
              </div>
            )}
          </>
        )}
      </CardBody>
    </Card>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function EventosPage() {
  const router = useRouter();
  const supabase = createClient();

  const [recurring, setRecurring] = useState<EventRow[]>([]);
  const [oneTime, setOneTime] = useState<EventRow[]>([]);
  const [hasMoreOneTime, setHasMoreOneTime] = useState(false);
  const [loadingRecurring, setLoadingRecurring] = useState(true);
  const [loadingOneTime, setLoadingOneTime] = useState(true);
  const [loadingMoreOneTime, setLoadingMoreOneTime] = useState(false);

  const SELECT = `
    id, title, event_type, date, has_weekly_recurrence, is_active, deleted_at,
    classes:event_classes (id),
    practice:event_practices (id),
    milonga_pre_class:milonga_pre_classes (id)
  `;

  const fetchRecurring = async () => {
    setLoadingRecurring(true);
    const { data } = await supabase
      .from('tango_events')
      .select(SELECT)
      .is('deleted_at', null)
      .eq('has_weekly_recurrence', true)
      .order('date', { ascending: true });
    setRecurring((data as EventRow[]) || []);
    setLoadingRecurring(false);
  };

  const fetchOneTime = async () => {
    setLoadingOneTime(true);
    const { data } = await supabase
      .from('tango_events')
      .select(SELECT)
      .is('deleted_at', null)
      .eq('has_weekly_recurrence', false)
      .order('date', { ascending: true })
      .limit(ONE_TIME_INITIAL + 1);

    if (data) {
      setHasMoreOneTime(data.length > ONE_TIME_INITIAL);
      setOneTime((data.slice(0, ONE_TIME_INITIAL) as EventRow[]) || []);
    }
    setLoadingOneTime(false);
  };

  const loadMoreOneTime = async () => {
    setLoadingMoreOneTime(true);
    const { data } = await supabase
      .from('tango_events')
      .select(SELECT)
      .is('deleted_at', null)
      .eq('has_weekly_recurrence', false)
      .order('date', { ascending: true })
      .range(ONE_TIME_INITIAL, 999);

    if (data) setOneTime((prev) => [...prev, ...(data as EventRow[])]);
    setHasMoreOneTime(false);
    setLoadingMoreOneTime(false);
  };

  useEffect(() => {
    fetchRecurring();
    fetchOneTime();
  }, []);

  const handleToggleActive = async (event: EventRow) => {
    await supabase.from('tango_events').update({ is_active: !event.is_active }).eq('id', event.id);
    fetchRecurring();
    fetchOneTime();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Seguro que querés eliminar este evento?')) return;
    await supabase.from('tango_events').update({ deleted_at: new Date().toISOString() }).eq('id', id);
    fetchRecurring();
    fetchOneTime();
  };

  const handleEdit = (id: string) => router.push(`/admin/eventos/${id}/editar`);

  // Agrupar recurrentes por día de la semana
  const today = new Date();
  const todayDow = today.getDay();
  const orderedDays = getOrderedDays(todayDow);

  const recurringByDay = orderedDays.reduce<Record<number, EventRow[]>>((acc, dow) => {
    acc[dow] = recurring.filter((e) => {
      const [year, month, day] = e.date.split('-').map(Number);
      return new Date(year, month - 1, day).getDay() === dow;
    });
    return acc;
  }, {});

  const loading = loadingRecurring || loadingOneTime;

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">

        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button isIconOnly variant="flat" onPress={() => router.push('/admin')}>
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold">Eventos</h1>
              <p className="text-default-500 text-sm">
                {recurring.length} recurrentes · {oneTime.length}{hasMoreOneTime ? '+' : ''} de una vez
              </p>
            </div>
          </div>
          <Button
            color="primary"
            startContent={<Plus className="w-4 h-4" />}
            onPress={() => router.push('/admin/eventos/nuevo')}
          >
            Nuevo evento
          </Button>
        </div>

        {loading ? (
          <div className="p-6 text-center text-default-500">Cargando...</div>
        ) : (
          <>
            {/* Recurrentes por día */}
            <div>
              <h2 className="text-lg font-bold mb-3">Eventos recurrentes</h2>
              <div className="space-y-4">
                {orderedDays.map((dow) => {
                  const dayEvents = recurringByDay[dow] || [];
                  if (dayEvents.length === 0) return null;
                  const isToday = dow === todayDow;
                  return (
                    <EventTable
                      key={dow}
                      title={`${DAYS_FULL[dow]}${isToday ? ' (hoy)' : ''}`}
                      events={dayEvents}
                      showDate={false}
                      initialVisible={RECURRING_VISIBLE}
                      onToggleActive={handleToggleActive}
                      onDelete={handleDelete}
                      onEdit={handleEdit}
                    />
                  );
                })}
                {recurring.length === 0 && (
                  <p className="text-default-400 text-sm text-center">No hay eventos recurrentes</p>
                )}
              </div>
            </div>

            {/* Una sola vez */}
            <div>
              <h2 className="text-lg font-bold mb-3">Eventos de una sola vez</h2>
              <EventTable
                title="Próximos eventos"
                events={oneTime}
                showDate={true}
                initialVisible={ONE_TIME_INITIAL}
                onToggleActive={handleToggleActive}
                onDelete={handleDelete}
                onEdit={handleEdit}
                onLoadMore={loadMoreOneTime}
                hasMore={hasMoreOneTime}
                loadingMore={loadingMoreOneTime}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
}