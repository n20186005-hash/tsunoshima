import { site, geo } from '../data/site';

const abs = (path: string) => new URL(path, site.url).href;

export const placeSchema = {
  '@context': 'https://schema.org',
  '@type': 'TouristAttraction',
  name: '角島展望台',
  description: site.description,
  url: site.url,
  image: abs(site.ogImage),
  isAccessibleForFree: true,
  publicAccess: true,
  address: {
    '@type': 'PostalAddress',
    addressCountry: 'JP',
    addressRegion: '山口県',
    addressLocality: '下関市豊北町',
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: geo.viewpoint.lat,
    longitude: geo.viewpoint.lng,
  },
  touristType: ['写真撮影', 'ドライブ', '家族旅行'],
};

export function breadcrumb(items: { name: string; path: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((it, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: it.name,
      item: abs(it.path),
    })),
  };
}

export function faqSchema(faqs: { q: string; a: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };
}
