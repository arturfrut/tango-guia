import Link from 'next/link';

// Versión futura con Supabase
/*
import { createClient } from '@supabase/supabase-js'

export default async function SobreNosotrosPage() {
  const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_KEY!)
  const { data: needs } = await supabase.from('needs').select('name').order('id')
  // Usar "needs" en vez del array estático
}
*/

export default function SobreTangoPage() {
  const needs = [
    'Zapatos para el Semillero',
    'Imprimir afiches',
    'Publicidad',
    'Nombramientos en radios o diarios',
    'Espacios para clases',
    'Contacto con grupos juveniles interesados',
    'Fotografía y video para eventos',
    'Diseño gráfico para redes y afiches',
    'Apoyo en redes sociales para difusión',
  ];

  return (
    <section className="min-h-screen flex flex-col items-center justify-start pb-10">
      {/* Título */}
      <div className="text-center max-w-3xl px-4 mb-8">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Sobre nosotros</h1>
        <p className="text-lg text-default-500">
          Tango Guía es un proyecto que busca fortalecer el ecosistema tanguero de Mar del Plata,
          combinando una aplicación web con buen SEO y un chatbot de WhatsApp para facilitar la
          difusión de clases, milongas y eventos. Nuestro objetivo es que tanto quienes están dentro
          de la comunidad como quienes no, tengan acceso a la información de forma clara, sencilla y
          centralizada.
        </p>
      </div>

      {/* Cuerpo */}
      <div className="max-w-3xl text-default-700 px-4 space-y-4 mb-10">
        <p>
          Nacimos para resolver dos grandes problemáticas: la dificultad para enterarse de lo que
          pasa en el ambiente, y la falta de participación de gente joven.
        </p>
        <p>
          Con herramientas simples, buscamos que cualquier docente pueda subir sus eventos y que
          cualquier persona pueda encontrar dónde y cuándo bailar tango. Además, impulsamos
          <strong> Se llama &quot;El Semillero&quot; </strong>, un espacio de formación para nuevas
          generaciones.
        </p>
        <p>Tu colaboración es clave para que el proyecto siga creciendo.</p>
      </div>

      <div className="max-w-3xl px-4 mb-10">
        <h2 className="text-2xl font-bold mb-4">¿Cómo podés colaborar?</h2>
        <p className="mb-2">
          Si querés hacer una donación, podés enviar tu aporte al alias{' '}
          <strong>tango-guia-mdp</strong>.
        </p>
        <p className="mb-4">Si no podés colaborar económicamente, también necesitamos:</p>
        <ul className="list-disc pl-6 space-y-1">
          {needs.map((item, idx) => (
            <li key={idx}>{item}</li>
          ))}
        </ul>
      </div>

      <div className="flex flex-col gap-4 w-full max-w-md px-4">
        <Link
          href="https://www.instagram.com/tangoguia"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-primary text-white px-6 py-3 rounded-xl font-medium hover:opacity-90 text-center"
        >
          Más info / Quiero ayudar!
        </Link>
      </div>
    </section>
  );
}
