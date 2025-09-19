import React from 'react';

interface StructuredDataProps {
  organizationData?: object;
  websiteData?: object;
  localBusinessData?: object;
}

export function StructuredData({ 
  organizationData, 
  websiteData, 
  localBusinessData 
}: StructuredDataProps = {}) {
  const defaultOrganizationData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "TangoGuía",
    "alternateName": ["Tango Guía", "tangoguia"],
    "url": "https://tangoguia.com",
    "logo": "https://tangoguia.com/logo.png",
    "description": "Plataforma para descubrir y promover el tango en Mar del Plata. Clases, milongas, eventos y comunidad tanguera.",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Mar del Plata",
      "addressRegion": "Buenos Aires",
      "addressCountry": "AR"
    },
    "areaServed": {
      "@type": "Place",
      "name": "Mar del Plata, Buenos Aires, Argentina"
    },
    "founder": {
      "@type": "Person",
      "name": "Equipo TangoGuía"
    },
    "foundingDate": "2024"
  };

  const defaultWebsiteData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "TangoGuía",
    "alternateName": "Tango Guía",
    "url": "https://tangoguia.com",
    "description": "La plataforma definitiva para el tango en Mar del Plata",
    "inLanguage": "es-AR",
    "about": {
      "@type": "Thing",
      "name": "Tango Argentino",
      "description": "Danza y música tradicional argentina"
    },
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": "https://tangoguia.com/buscar?q={search_term_string}"
      },
      "query-input": "required name=search_term_string"
    }
  };

  const defaultLocalBusinessData = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "TangoGuía",
    "image": "https://tangoguia.com/logo.png",
    "description": "Plataforma digital para la comunidad tanguera de Mar del Plata",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Mar del Plata",
      "addressRegion": "Buenos Aires",
      "addressCountry": "AR"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": -38.0055,
      "longitude": -57.5426
    },
    "url": "https://tangoguia.com",
    "priceRange": "Gratuito",
    "openingHoursSpecification": {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": [
        "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"
      ],
      "opens": "00:00",
      "closes": "23:59"
    }
  };

  return (
    <>
      {/* Schema.org para la organización */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(organizationData || defaultOrganizationData),
        }}
      />
      
      {/* Schema.org para el sitio web */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(websiteData || defaultWebsiteData),
        }}
      />

      {/* Schema.org para LocalBusiness */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(localBusinessData || defaultLocalBusinessData),
        }}
      />
    </>
  );
}