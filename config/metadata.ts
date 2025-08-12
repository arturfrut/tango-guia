import { Metadata } from 'next';
import { siteConfig } from './site';

export const pagesMetadata: Record<string, Metadata> = {
  home: {
    title: {
      default: 'Inicio',
      template: `%s - ${siteConfig.name}`,
    },
    description:
      'Tango Guía es la plataforma para descubrir y promover el tango en Mar del Plata. Encontrá clases, milongas, eventos y la comunidad tanguera en un solo lugar.',
    icons: { icon: '/favicon.ico' },
    openGraph: {
      title: 'Tango Guía - Clases y Milongas en Mar del Plata',
      description:
        'Descubrí toda la agenda de tango en Mar del Plata: clases, milongas, eventos y comunidad. Conectá con el mundo tanguero fácilmente.',
      url: 'https://tangoguia.com',
      siteName: siteConfig.name,
      images: [
        {
          url: '/images/og-home.jpg',
          width: 1200,
          height: 630,
          alt: 'Tango Guía - Clases y Milongas en Mar del Plata',
        },
      ],
      locale: 'es_AR',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Tango Guía - Clases y Milongas en Mar del Plata',
      description:
        'Toda la información de tango en Mar del Plata. Clases, milongas, comunidad y eventos en un solo lugar.',
      images: ['/images/og-home.jpg'],
    },
  },
  semillero: {
    title: 'El Semillero - Nueva generación tanguera',
    description:
      'Clases y beneficios para jóvenes de 18 a 35 años que quieran aprender y vivir el tango en Mar del Plata. Un espacio pensado para crear la nueva generación tanguera.',
    icons: { icon: '/favicon.ico' },
    openGraph: {
      title: 'El Semillero - Jóvenes y Tango en Mar del Plata',
      description:
        'Participá de El Semillero: clases gratis, beneficios y comunidad para jóvenes amantes del tango en Mar del Plata.',
      url: 'https://tangoguia.com/semillero',
      siteName: siteConfig.name,
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
      title: 'El Semillero - Jóvenes y Tango en Mar del Plata',
      description: 'Clases y beneficios para jóvenes de 18 a 35 años que quieran vivir el tango.',
      images: ['/images/og-semillero.jpg'],
    },
  },
  sobreTango: {
    title: 'Sobre Tango Guía',
    description:
      'Conocé Tango Guía: un proyecto para conectar clases, milongas, docentes y comunidad tanguera en Mar del Plata, con foco en atraer nuevas generaciones.',
    icons: { icon: '/favicon.ico' },
    openGraph: {
      title: 'Sobre Tango Guía - Proyecto Tanguero en Mar del Plata',
      description:
        'Tango Guía es una herramienta digital para unir a la comunidad tanguera de Mar del Plata. Agenda, beneficios y más.',
      url: 'https://tangoguia.com/sobre-tango',
      siteName: siteConfig.name,
      images: [
        {
          url: '/images/og-sobre.jpg',
          width: 1200,
          height: 630,
          alt: 'Sobre Tango Guía',
        },
      ],
      locale: 'es_AR',
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Sobre Tango Guía',
      description: 'Un proyecto para conectar y potenciar la comunidad tanguera de Mar del Plata.',
      images: ['/images/og-sobre.jpg'],
    },
  },
  recomendaciones: {
    title: 'Recomendaciones y denuncias',
    description:
      'Enviá tus sugerencias o denuncias para mejorar el tango en Mar del Plata. Mantené el anonimato o compartí tus datos, vos elegís.',
    icons: { icon: '/favicon.ico' },
    openGraph: {
      title: 'Recomendaciones y Denuncias - Tango Guía',
      description:
        'Tu voz es importante para mejorar el tango en Mar del Plata. Hacé tu aporte con sugerencias o denuncias.',
      url: 'https://tangoguia.com/recomendaciones',
      siteName: siteConfig.name,
      images: [
        {
          url: '/images/og-recomendaciones.jpg',
          width: 1200,
          height: 630,
          alt: 'Recomendaciones y denuncias',
        },
      ],
      locale: 'es_AR',
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Recomendaciones y Denuncias',
      description: 'Enviá tus sugerencias o denuncias para mejorar el tango en Mar del Plata.',
      images: ['/images/og-recomendaciones.jpg'],
    },
  },
  agenda: {
    title: 'Agenda semanal de tango',
    description:
      'Descubrí todas las clases, milongas y prácticas de tango en Mar del Plata para esta semana.',
    icons: { icon: '/favicon.ico' },
    openGraph: {
      title: 'Agenda Semanal - Tango Guía',
      description: 'Agenda actualizada con todas las clases y milongas en Mar del Plata.',
      url: 'https://tangoguia.com/agenda',
      siteName: siteConfig.name,
      images: [
        {
          url: '/images/og-agenda.jpg',
          width: 1200,
          height: 630,
          alt: 'Agenda semanal de tango',
        },
      ],
      locale: 'es_AR',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Agenda Semanal de Tango',
      description:
        'Clases, milongas y prácticas de tango en Mar del Plata actualizadas cada semana.',
      images: ['/images/og-agenda.jpg'],
    },
  },
};
