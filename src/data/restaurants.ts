export interface Restaurant {
  id: string;
  name: string;
  area: 'honshu' | 'center' | 'west'; // 過橋前 / 角島中央 / 西側・環島
  areaLabel: string;
  summary: string;
  image: string;
  alt: string;
  tags: string[];
  dish: string; // おすすめの一品（既存の概要から抜粋、事実のみ）
  themes: string[]; // 検索意図に合わせた分類（ランチ / 海鮮丼 / カフェ / スイーツ）
  hours?: string;
  closed?: string;
  lastVerified: string;
  status: 'active' | 'seasonal' | 'verify';
  sourceType: 'official' | 'operator';
  volatile: boolean;
}

// 営業時間は変わりやすいため、訪問前の確認を促す方針（status: verify）
export const restaurants: Restaurant[] = [
  {
    id: 'hohoku',
    name: '道の駅 北浦街道ほうほく',
    area: 'honshu',
    areaLabel: '過橋前・本州側',
    summary:
      '角島へ向かう前後の休憩に。海鮮丼や定食のほか、地魚・野菜・お土産も揃う大きな道の駅です。',
    image: '/images/sea.jpg',
    alt: '本州側の海沿いにある道の駅のイメージ（角島周辺の海）',
    tags: ['海鮮', '家族向け', 'お土産', '雨の日', '駐車場あり'],
    dish: '海鮮丼・地魚定食',
    themes: ['ランチ'],
    hours: '物産館 8:30〜 / レストラン・カフェ 10:00〜（季節変動あり）',
    closed: '第1・第3火曜',
    lastVerified: '2026-10-14',
    status: 'verify',
    sourceType: 'official',
    volatile: true,
  },
  {
    id: 'harumi',
    name: '土井ヶ浜海鮮食堂 晴海',
    area: 'honshu',
    areaLabel: '過橋前・本州側',
    summary:
      '海の家を改装した海沿いの食堂。旬の魚を使った海鮮舟盛り丼が名物で、角島から車で約10分です。',
    image: '/images/seaside.jpg',
    alt: '海沿いの食堂のイメージ（角島周辺の海岸）',
    tags: ['海鮮', '舟盛り丼', '海沿い'],
    dish: '海鮮舟盛り丼',
    themes: ['ランチ', '海鮮丼'],
    lastVerified: '2026-10-14',
    status: 'verify',
    sourceType: 'official',
    volatile: true,
  },
  {
    id: 'shiokaze',
    name: 'しおかぜの里 角島',
    area: 'center',
    areaLabel: '角島・中央',
    summary:
      '島内の食事・休憩・お土産の拠点。刺身定食や海鮮丼、地元の海産物や角島限定みやげが揃います。島にはコンビニがないため、補給ポイントとしても便利です。',
    image: '/images/store.jpg',
    alt: '角島の売店・休憩施設のイメージ',
    tags: ['海鮮丼', '刺身定食', 'お土産', '補給ポイント'],
    dish: '海鮮丼・刺身定食',
    themes: ['ランチ', '海鮮丼'],
    hours: '訪問前に営業状況をご確認ください',
    lastVerified: '2026-10-14',
    status: 'verify',
    sourceType: 'official',
    volatile: true,
  },
  {
    id: 'granvista',
    name: 'グランビスタ角島',
    area: 'west',
    areaLabel: '角島・西側/環島途中',
    summary:
      '海を望むランチとカフェ。海鮮丼や瓦そば、釜揚げしらす料理、コーヒーやスイーツを、テラス席で楽しめます。',
    image: '/images/beach.jpg',
    alt: '角島西側の海を望むイメージ（コバルトブルーの砂浜）',
    tags: ['海鮮丼', '瓦そば', 'カフェ', '海景テラス'],
    dish: '海鮮丼・瓦そば',
    themes: ['ランチ', '海鮮丼', 'カフェ'],
    hours: '10:00〜18:00（訪問前にご確認ください）',
    closed: '木曜',
    lastVerified: '2026-10-14',
    status: 'verify',
    sourceType: 'official',
    volatile: true,
  },
  {
    id: 'popolo',
    name: '角島ジェラート ポポロ',
    area: 'west',
    areaLabel: '角島・西側/環島途中',
    summary:
      'ジャージー牛乳と山口県の食材を合わせたジェラート。季節ごとに味が替わり、帰り道のデザートにぴったりです。',
    image: '/images/lighthouse2.jpg',
    alt: '角島のジェラート店のイメージ（角島の風景）',
    tags: ['スイーツ', 'テイクアウト', '季節限定'],
    dish: 'ジェラート',
    themes: ['カフェ', 'スイーツ'],
    lastVerified: '2026-10-14',
    status: 'verify',
    sourceType: 'official',
    volatile: true,
  },
  {
    id: 'pudding',
    name: '角島プリン',
    area: 'west',
    areaLabel: '角島・西側/環島途中',
    summary:
      '山口県産の素材を使った、テイクアウト向きのプリン。日替わりの味と、写真映えするパッケージが人気です。',
    image: '/images/lighthouse-winter.jpg',
    alt: '角島のスイーツのイメージ（角島の風景）',
    tags: ['スイーツ', 'テイクアウト', '写真映え'],
    dish: 'プリン',
    themes: ['カフェ', 'スイーツ'],
    lastVerified: '2026-10-14',
    status: 'verify',
    sourceType: 'official',
    volatile: true,
  },
];

export const areaOrder: Restaurant['area'][] = ['honshu', 'center', 'west'];
export const areaTitle: Record<Restaurant['area'], string> = {
  honshu: '過橋前 ― 本州側',
  center: '角島・中央エリア',
  west: '角島・西側と環島途中',
};
