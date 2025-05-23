import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useRegion } from '../../context/RegionContext';

const SEOHead = ({
  title,
  description,
  keywords,
  canonicalUrl,
  type = 'website',
  image = '/og-image.jpg',
  structuredData,
}) => {
  const { selectedCountry, countries } = useRegion();
  const countryName = countries[selectedCountry]?.name || 'Global';

  const fullTitle = title
    ? `${title} | WageCalculator`
    : 'WageCalculator - Free Financial Calculators for Global Use';
  const fullDescription =
    description ||
    `Calculate salaries, taxes, savings, and more with our comprehensive suite of financial calculators. Accurate calculations for ${countryName} and 40+ countries worldwide.`;

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={fullDescription} />
      {keywords && <meta name="keywords" content={keywords} />}
      <meta name="author" content="WageCalculator" />
      <meta
        name="robots"
        content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1"
      />

      {/* Canonical URL */}
      {canonicalUrl && <link rel="canonical" href={canonicalUrl} />}

      {/* Open Graph */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={fullDescription} />
      <meta property="og:image" content={image} />
      <meta property="og:site_name" content="WageCalculator" />
      <meta property="og:locale" content="en_US" />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={fullDescription} />
      <meta name="twitter:image" content={image} />

      {/* Additional Meta Tags */}
      <meta name="format-detection" content="telephone=no" />
      <meta name="theme-color" content="#0ea5e9" />

      {/* Structured Data */}
      {structuredData && (
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      )}

      {/* Geo Tags */}
      <meta name="geo.region" content={selectedCountry} />
      <meta name="geo.placename" content={countryName} />

      {/* Language and Regional */}
      <meta httpEquiv="content-language" content="en" />
      <meta name="language" content="en" />
    </Helmet>
  );
};

export default SEOHead;
