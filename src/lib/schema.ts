import { site } from '../data/site';
import { attraction } from '../data/attraction';

const abs = (path: string) => new URL(path, site.url).href;

export const placeSchema = {
  '@context': 'https://schema.org',
  '@type': 'TouristAttraction',
  '@id': `${site.url}/#attraction`,
  // Google マップ上の正式名称を実体としてバインドし、日本語呼称を別名に
  name: attraction.fullName,
  alternateName: [
    attraction.jpName,
    attraction.shortName,
    `${attraction.city} ${attraction.fullName}`,
  ],
  description: site.description,
  url: site.url,
  image: [abs(site.ogImage)],
  isAccessibleForFree: true,
  publicAccess: true,
  // 評価・口コミはページ表示のみとし、JSON-LD（aggregateRating）には含めない
  // （Google のレビュースニペット方針に従い、第三者評価の無断構造化を避ける）
  address: {
    '@type': 'PostalAddress',
    streetAddress: attraction.streetAddress,
    addressLocality: attraction.city,
    addressRegion: attraction.region,
    postalCode: attraction.postalCode,
    addressCountry: attraction.countryCode,
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: attraction.lat,
    longitude: attraction.lng,
  },
  hasMap: attraction.mapsShareUrl,
  sameAs: [attraction.mapsShareUrl, attraction.govtTourismUrl],
  touristType: ['写真撮影', 'ドライブ', '家族旅行'],
};

export function itemListSchema(items: { id: string; name: string }[], pagePath: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: items.map((it, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: it.name,
      url: abs(`${pagePath}#${it.id}`),
    })),
  };
}

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
