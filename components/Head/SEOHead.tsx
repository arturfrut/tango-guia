import React from 'react';
import { StructuredData } from './StructuredData';

interface SEOHeadProps {
  structuredData?: {
    organizationData?: object;
    websiteData?: object;
    localBusinessData?: object;
  };
}

export function SEOHead({ 
  structuredData = {}
}: SEOHeadProps = {}) {
  return (
    <>
      {/* Preconnect para mejorar performance */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      
      {/* DNS prefetch para servicios externos */}
      <link rel="dns-prefetch" href="//www.google-analytics.com" />
      <link rel="dns-prefetch" href="//www.googletagmanager.com" />
      
      <StructuredData {...structuredData} />
    </>
  );
}