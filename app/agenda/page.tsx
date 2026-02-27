import { Suspense } from 'react';
import { EventsClient } from './EventsClient';
import { PageProps } from '@/.next/types/app/page';
import { getInitialEvents } from './getInitialEvents';

function EventsLoading() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <svg
              className="w-8 h-8 text-primary"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 002 2z"
              />
            </svg>
            <h1 className="text-4xl font-bold text-foreground">Tango esta semana</h1>
          </div>
        </div>

        <div className="flex justify-center items-center h-64">
          <div className="flex items-center gap-3">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <span className="text-default-500 text-lg">Cargando eventos...</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default async function EventsPage(props: PageProps) {
  const todayStr = new Intl.DateTimeFormat('sv-SE', {
    timeZone: 'America/Argentina/Buenos_Aires',
  }).format(new Date());
  const [y, m, d] = todayStr.split('-').map(Number);
  const today = new Date(y, m - 1, d); 
  const initialEvents = await getInitialEvents(today);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <svg
              className="w-8 h-8 text-primary"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 002 2z"
              />
            </svg>
            <h1 className="text-4xl font-bold text-foreground">Tango esta semana</h1>
          </div>
          <p className="text-default-500 text-lg">
            Descubrí las próximas clases, milongas y eventos especiales
          </p>
        </div>

        <Suspense fallback={<EventsLoading />}>
          <EventsClient initialEvents={initialEvents} initialDate={today} />
        </Suspense>
      </div>
    </div>
  );
}
