'use client';

import { useState, useEffect } from 'react';
import { Card, CardBody, CardHeader } from '@heroui/card';
import { Input } from '@heroui/input';
import { Button } from '@heroui/button';
import { Divider } from '@heroui/divider';

const PASSWORD = 'tantoTango2026!';
const STORAGE_KEY = 'admin_auth';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const auth = sessionStorage.getItem(STORAGE_KEY);
    if (auth === 'true') setAuthenticated(true);
    setLoading(false);
  }, []);

  const handleLogin = () => {
    if (password === PASSWORD) {
      sessionStorage.setItem(STORAGE_KEY, 'true');
      setAuthenticated(true);
      setError('');
    } else {
      setError('Contraseña incorrecta');
    }
  };

  if (loading) return null;

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <Card className="w-full max-w-sm">
          <CardHeader className="flex flex-col items-start gap-1 pb-0">
            <h1 className="text-xl font-bold">Panel de administración</h1>
            <p className="text-sm text-default-500">TangoGuia</p>
          </CardHeader>
          <Divider className="mt-4" />
          <CardBody className="gap-4">
            <Input
              label="Contraseña"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
              isInvalid={!!error}
              errorMessage={error}
              autoFocus
            />
            <Button color="primary" onPress={handleLogin} className="w-full">
              Ingresar
            </Button>
          </CardBody>
        </Card>
      </div>
    );
  }

  return <>{children}</>;
}