'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/app/utils/supabase/client';
import { Card, CardBody } from '@heroui/card';
import { Button } from '@heroui/button';
import { Input, Textarea } from '@heroui/input';
import { Divider } from '@heroui/divider';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from '@heroui/modal';
import { ArrowLeft, Plus, Pencil, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface Teacher {
  id: string;
  name: string;
  nickname?: string;
  phone_number?: string;
  bio?: string;
  photo_url?: string;
}

const emptyForm: Omit<Teacher, 'id'> = {
  name: '',
  nickname: '',
  phone_number: '',
  bio: '',
  photo_url: '',
};

export default function ProfesoresPage() {
  const router = useRouter();
  const supabase = createClient();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [error, setError] = useState('');

  const fetchTeachers = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('teachers')
      .select('id, name, nickname, phone_number, bio, photo_url')
      .order('name');
    if (!error) setTeachers(data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchTeachers();
  }, []);

  const handleOpen = (teacher?: Teacher) => {
    if (teacher) {
      setEditingId(teacher.id);
      setForm({
        name: teacher.name || '',
        nickname: teacher.nickname || '',
        phone_number: teacher.phone_number || '',
        bio: teacher.bio || '',
        photo_url: teacher.photo_url || '',
      });
    } else {
      setEditingId(null);
      setForm(emptyForm);
    }
    setError('');
    onOpen();
  };

  const handleSave = async () => {
    if (!form.name.trim()) {
      setError('El nombre es obligatorio');
      return;
    }
    setSaving(true);
    const payload = {
      name: form.name.trim(),
      nickname: form.nickname?.trim() || null,
      phone_number: form.phone_number?.trim() || null,
      bio: form.bio?.trim() || null,
      photo_url: form.photo_url?.trim() || null,
    };

    if (editingId) {
      const { error } = await supabase.from('teachers').update(payload).eq('id', editingId);
      if (error) setError('Error al guardar');
    } else {
      const { error } = await supabase.from('teachers').insert(payload);
      if (error) setError('Error al guardar');
    }

    setSaving(false);
    if (!error) {
      onClose();
      fetchTeachers();
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Seguro que querés eliminar este profesor?')) return;
    setDeleting(id);
    await supabase.from('teachers').delete().eq('id', id);
    setDeleting(null);
    fetchTeachers();
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <Button isIconOnly variant="flat" onPress={() => router.push('/admin')}>
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold">Profesores</h1>
              <p className="text-default-500 text-sm">{teachers.length} registrados</p>
            </div>
          </div>
          <Button
            color="primary"
            startContent={<Plus className="w-4 h-4" />}
            onPress={() => handleOpen()}
          >
            Nuevo profesor
          </Button>
        </div>

        <Card>
          <CardBody className="p-0">
            {loading ? (
              <div className="p-6 text-center text-default-500">Cargando...</div>
            ) : teachers.length === 0 ? (
              <div className="p-6 text-center text-default-500">No hay profesores registrados</div>
            ) : (
              <table className="w-full">
                <thead>
                  <tr className="border-b border-divider">
                    <th className="text-left px-4 py-3 text-xs font-semibold text-default-500 uppercase">
                      Nombre
                    </th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-default-500 uppercase">
                      Apodo
                    </th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-default-500 uppercase">
                      Teléfono
                    </th>
                    <th className="px-4 py-3"></th>
                  </tr>
                </thead>
                <tbody>
                  {teachers.map((teacher) => (
                    <tr
                      key={teacher.id}
                      className="border-b border-divider last:border-0 hover:bg-default-50"
                    >
                      <td className="px-4 py-3 font-medium">{teacher.name}</td>
                      <td className="px-4 py-3 text-default-500">{teacher.nickname || '—'}</td>
                      <td className="px-4 py-3 text-default-500">{teacher.phone_number || '—'}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2 justify-end">
                          <Button
                            isIconOnly
                            size="sm"
                            variant="flat"
                            onPress={() => handleOpen(teacher)}
                          >
                            <Pencil className="w-3 h-3" />
                          </Button>
                          <Button
                            isIconOnly
                            size="sm"
                            variant="flat"
                            color="danger"
                            isLoading={deleting === teacher.id}
                            onPress={() => handleDelete(teacher.id)}
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </CardBody>
        </Card>
      </div>

      <Modal isOpen={isOpen} onClose={onClose} size="lg">
        <ModalContent>
          <ModalHeader>{editingId ? 'Editar profesor' : 'Nuevo profesor'}</ModalHeader>
          <Divider />
          <ModalBody className="gap-4 py-4">
            <Input
              label="Nombre"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              isRequired
              isInvalid={!!error && !form.name}
              errorMessage={!form.name ? error : ''}
            />
            <Input
              label="Apodo"
              value={form.nickname}
              onChange={(e) => setForm({ ...form, nickname: e.target.value })}
            />
            <Input
              label="Teléfono"
              value={form.phone_number}
              onChange={(e) => setForm({ ...form, phone_number: e.target.value })}
            />
            <Input
              label="URL de foto"
              value={form.photo_url}
              onChange={(e) => setForm({ ...form, photo_url: e.target.value })}
            />
            <Textarea
              label="Bio"
              value={form.bio}
              onChange={(e) => setForm({ ...form, bio: e.target.value })}
              minRows={3}
            />
            {error && <p className="text-danger text-sm">{error}</p>}
          </ModalBody>
          <Divider />
          <ModalFooter>
            <Button variant="flat" onPress={onClose}>
              Cancelar
            </Button>
            <Button color="primary" isLoading={saving} onPress={handleSave}>
              {editingId ? 'Guardar cambios' : 'Crear profesor'}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}
