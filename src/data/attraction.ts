// 単一観光地の SEO 実体バインド用データ。
// サイト全体（JSON-LD / TDK / 地図 / 評価表示）で使う。
// 最新の Google マップ情報（名称・評価・住所）は 2026 年 9 月時点のもの。

export const attraction = {
  // ドメインと実体のバインド
  domain: 'tsunoshima.org',
  url: 'https://tsunoshima.org',

  // Google マップ上の正式名称（英語）と、日本語での呼称・通称
  fullName: 'Tsunoshima Observatory', // Google Maps の正式名称
  shortName: 'Tsunoshima Viewpoint', // ドメインの意味・通称（観景台）
  jpName: '角島展望台',

  // 住所（Google マップ掲載の正式住所）
  city: 'Shimonoseki',
  cityJp: '下関市',
  region: 'Yamaguchi',
  regionJp: '山口県',
  country: 'Japan',
  countryJp: '日本',
  countryCode: 'JP',
  postalCode: '759-5331',
  streetAddress: 'Hohokucho Oaza Kanda',

  // 座標（角島展望台）
  lat: 34.3523,
  lng: 130.885,

  // Google マップ
  mapsShareUrl: 'https://maps.app.goo.gl/vyFNvXPytQad1xUd9',
  mapsEmbedSrc:
    'https://www.google.com/maps?q=34.3523,130.885(Tsunoshima%20Observatory)&z=15&output=embed',

  // 周辺の主要ランドマーク
  nearbyLandmark1: '角島大橋',
  nearbyLandmark2: '角島灯台',
  nearbyLandmark1En: 'Tsunoshima Bridge',
  nearbyLandmark2En: 'Tsunoshima Lighthouse',

  // 公式観光ポータル（山口県観光）
  govtTourismUrl: 'https://yamaguchi-tourism.jp/feature/tsunoshima',

  // Google マップの評価（ページ表示のみ。JSON-LD には含めない）
  rating: {
    score: 4.5,
    reviews: 7600,
    source: 'Google Maps',
    syncedAt: '2026 年 9 月',
    // 評価表示のすぐ下の小字（末尾のフレーズが Google マップへのリンク）
    inlineNote: '评分与评价数同步自谷歌地图（Google Maps）用户评价 · 2026 年 9 月 · ',
    inlineNoteLink: '点击查看谷歌地图全部评价↗',
    // 評価ブロックの出所説明
    sourceNote: '同步自 Google 地图用户评价，同步时间 2026 年 9 月；版权归原作者与 Google 地图所有',
    // ボタン文言
    buttonLabel: '在谷歌地图查看全部评价',
  },
} as const;
