export const site = {
  name: '角島展望台',
  tagline: '角島大橋を望む、海への入口',
  seoName: '角島展望台ガイド｜角島大橋の撮影スポット・駐車場・アクセス',
  description:
    '角島大橋を望む本州側の展望台ガイド。海士ヶ瀬公園の駐車場、四つの撮影スポット、アクセス、モデルコース、周辺グルメを、旅の前と現地の両方で役立つようにまとめました。',
  // 本番の公開URLに合わせて変更してください
  url: 'https://tsunoshima-viewpoint.pages.dev',
  locale: 'ja_JP',
  lang: 'ja',
  ga4: 'G-HXM22WWPKP',
  ogImage: '/images/hero-bridge.jpg',
} as const;

// 主要な座標（ナビの目的地は「展望台」ではなく駐車場に）
export const geo = {
  amagase: { lat: 34.3517, lng: 130.8862, label: '海士ヶ瀬公園駐車場' },
  viewpoint: { lat: 34.3523, lng: 130.885, label: '角島展望台' },
  lighthouse: { lat: 34.3585, lng: 130.847, label: '角島灯台' },
} as const;

export function navUrl(target: { lat: number; lng: number; label: string }) {
  const q = encodeURIComponent(`${target.lat},${target.lng} (${target.label})`);
  return `https://www.google.com/maps/dir/?api=1&destination=${q}`;
}

export const nav = [
  { href: '/viewpoints', label: '撮影スポット' },
  { href: '/access', label: 'アクセス・駐車場' },
  { href: '/photo-guide', label: '写真ガイド' },
  { href: '/model-course', label: 'モデルコース' },
  { href: '/food', label: '周辺グルメ' },
  { href: '/history', label: '歴史' },
  { href: '/faq', label: 'よくある質問' },
] as const;
