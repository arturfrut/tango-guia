import { Metadata } from 'next';
import { siteConfig } from './site';

const baseUrl =
  process.env.NODE_ENV === 'production' ? 'https://www.tangoguia.com' : 'http://localhost:3000';

export const pagesMetadata: Record<string, Metadata> = {
  home: {
    metadataBase: new URL(baseUrl),
    title: {
      default: 'TangoGuía - Tango en Mar del Plata | Clases, Milongas y Comunidad',
      template: `%s | ${siteConfig.name}`,
    },
    description:
      'TangoGuía es la plataforma definitiva para descubrir el tango en Mar del Plata. Encontrá clases, milongas, eventos, el Semillero tanguero y toda la comunidad en un solo lugar.',
    keywords: [
      'tangoguia',
      'tango guía',
      'tango mar del plata',
      'milongas mar del plata',
      'clases tango',
      'semillero tango',
      'eventos tango',
      'comunidad tanguera',
      'tango argentino',
      'agenda tango',
      'aprender tango',
    ].join(', '),
    authors: [{ name: 'TangoGuía' }],
    creator: 'TangoGuía',
    publisher: 'TangoGuía',
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    icons: {
      icon: '/favicon.svg',
      shortcut: '/favicon-16x16.png',
      apple: '/apple-touch-icon.png',
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    alternates: {
      canonical: 'https://www.tangoguia.com',
    },
    openGraph: {
      title: 'TangoGuía - Tango en Mar del Plata | Clases, Milongas y Comunidad',
      description:
        'La plataforma definitiva para el tango en Mar del Plata. Descubrí clases, milongas, eventos y conectá con la comunidad tanguera.',
      url: 'https://www.tangoguia.com',
      siteName: 'TangoGuía',
      images: [
        {
          url: '/images/og-home.jpg',
          width: 1200,
          height: 630,
          alt: 'TangoGuía - Tango en Mar del Plata',
        },
      ],
      locale: 'es_AR',
      type: 'website',
    },
  },

  semillero: {
    metadataBase: new URL(baseUrl),
    title: 'El Semillero - Jóvenes y Tango | TangoGuía Mar del Plata',
    description:
      'El Semillero de TangoGuía: clases gratuitas y beneficios para jóvenes de 18 a 35 años que quieran aprender tango en Mar del Plata. Creando la nueva generación tanguera.',
    keywords:
      'semillero tango, jóvenes tango, clases gratis tango, nueva generación tanguera, mar del plata',
    alternates: {
      canonical: 'https://www.tangoguia.com/semillero',
    },
    icons: { icon: '/favicon.svg' },
    openGraph: {
      title: 'El Semillero - Jóvenes y Tango | TangoGuía',
      description:
        'Participá del Semillero de TangoGuía: clases gratis, beneficios y comunidad para jóvenes amantes del tango en Mar del Plata.',
      url: 'https://www.tangoguia.com/semillero',
      siteName: 'TangoGuía',
      images: [
        {
          url: '/images/og-semillero.jpg',
          width: 1200,
          height: 630,
          alt: 'El Semillero - Jóvenes y Tango en Mar del Plata',
        },
      ],
      locale: 'es_AR',
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title: 'El Semillero - Jóvenes y Tango | TangoGuía',
      description:
        'Clases gratis y beneficios para jóvenes de 18 a 35 años que quieran vivir el tango.',
      images: ['/images/og-semillero.jpg'],
    },
  },

  sobreTango: {
    metadataBase: new URL(baseUrl),
    title: 'Sobre TangoGuía - Proyecto Tanguero en Mar del Plata',
    description:
      'Conocé TangoGuía: el proyecto que conecta clases, milongas, docentes y la comunidad tanguera en Mar del Plata, con foco en atraer nuevas generaciones al tango argentino.',
    keywords: 'sobre tangoguia, proyecto tango, comunidad tanguera mar del plata, tango argentino',
    alternates: {
      canonical: 'https://www.tangoguia.com/sobre-tango',
    },
    icons: { icon: '/favicon.svg' },
    openGraph: {
      title: 'Sobre TangoGuía - Proyecto Tanguero en Mar del Plata',
      description:
        'TangoGuía es la herramienta digital que une a la comunidad tanguera de Mar del Plata. Agenda, beneficios y más.',
      url: 'https://www.tangoguia.com/sobre-tango',
      siteName: 'TangoGuía',
      images: [
        {
          url: '/images/og-sobre.jpg',
          width: 1200,
          height: 630,
          alt: 'Sobre TangoGuía - Proyecto Tanguero',
        },
      ],
      locale: 'es_AR',
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Sobre TangoGuía - Proyecto Tanguero',
      description: 'El proyecto que conecta y potencia la comunidad tanguera de Mar del Plata.',
      images: ['/images/og-sobre.jpg'],
    },
  },

  recomendaciones: {
    metadataBase: new URL(baseUrl),
    title: 'Recomendaciones y Denuncias | TangoGuía Mar del Plata',
    description:
      'Enviá tus sugerencias o denuncias a TangoGuía para mejorar el tango en Mar del Plata. Mantené el anonimato o compartí tus datos, vos elegís cómo participar.',
    keywords: 'recomendaciones tango, denuncias tango, mejorar comunidad tanguera, feedback tango',
    alternates: {
      canonical: 'https://www.tangoguia.com/recomendaciones',
    },
    icons: { icon: '/favicon.svg' },
    openGraph: {
      title: 'Recomendaciones y Denuncias | TangoGuía',
      description:
        'Tu voz es importante para mejorar el tango en Mar del Plata. Hacé tu aporte con sugerencias o denuncias en TangoGuía.',
      url: 'https://www.tangoguia.com/recomendaciones',
      siteName: 'TangoGuía',
      images: [
        {
          url: '/images/og-recomendaciones.jpg',
          width: 1200,
          height: 630,
          alt: 'Recomendaciones y denuncias - TangoGuía',
        },
      ],
      locale: 'es_AR',
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Recomendaciones y Denuncias | TangoGuía',
      description: 'Enviá tus sugerencias para mejorar el tango en Mar del Plata.',
      images: ['/images/og-recomendaciones.jpg'],
    },
  },

  agenda: {
    metadataBase: new URL(baseUrl),
    title: 'Agenda Semanal de Tango | TangoGuía Mar del Plata',
    description:
      'Agenda actualizada de TangoGuía: todas las clases, milongas y prácticas de tango en Mar del Plata para esta semana. Nunca te pierdas un evento tanguero.',
    keywords:
      'agenda tango, milongas mar del plata, clases tango semanal, eventos tango, práctica tango',
    alternates: {
      canonical: 'https://www.tangoguia.com/agenda',
    },
    icons: { icon: '/favicon.svg' },
    openGraph: {
      title: 'Agenda Semanal de Tango | TangoGuía',
      description:
        'Agenda actualizada de TangoGuía con todas las clases y milongas en Mar del Plata.',
      url: 'https://www.tangoguia.com/agenda',
      siteName: 'TangoGuía',
      images: [
        {
          url: '/images/og-agenda.jpg',
          width: 1200,
          height: 630,
          alt: 'Agenda semanal de tango - TangoGuía',
        },
      ],
      locale: 'es_AR',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Agenda Semanal de Tango | TangoGuía',
      description:
        'Clases, milongas y prácticas de tango en Mar del Plata actualizadas cada semana.',
      images: ['/images/og-agenda.jpg'],
    },
  },
};
