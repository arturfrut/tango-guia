'use client';

import { Card, CardBody } from '@heroui/card';
import { Button } from '@heroui/button';
import { useRouter } from 'next/navigation';
import { Users, Calendar } from 'lucide-react';

export default function AdminPage() {
  const router = useRouter();

  const handleLogout = () => {
    sessionStorage.removeItem('admin_auth');
    router.refresh();
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold">Panel de administración</h1>
            <p className="text-default-500 text-sm">TangoGuia</p>
          </div>
          <Button variant="flat" color="danger" size="sm" onPress={handleLogout}>
            Cerrar sesión
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Card
            isPressable
            onPress={() => router.push('/admin/profesores')}
            className="hover:scale-[1.02] transition-all duration-200"
          >
            <CardBody className="flex flex-row items-center gap-4 p-6">
              <div className="p-3 bg-primary/10 rounded-xl">
                <Users className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h2 className="font-bold text-lg">Profesores</h2>
                <p className="text-default-500 text-sm">Listar, crear y editar profesores</p>
              </div>
            </CardBody>
          </Card>

          <Card
            isPressable
            onPress={() => router.push('/admin/eventos')}
            className="hover:scale-[1.02] transition-all duration-200"
          >
            <CardBody className="flex flex-row items-center gap-4 p-6">
              <div className="p-3 bg-primary/10 rounded-xl">
                <Calendar className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h2 className="font-bold text-lg">Eventos</h2>
                <p className="text-default-500 text-sm">Listar, crear y editar eventos</p>
              </div>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
}