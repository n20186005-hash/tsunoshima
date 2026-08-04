// 「わたしの角島 半日プラン」で選べる立ち寄り先
export interface Attraction {
  id: string;
  name: string;
  category: 'view' | 'nature' | 'beach' | 'food' | 'sweets';
  note: string;
  minutes: number; // 目安の滞在（分）
}

export const attractions: Attraction[] = [
  { id: 'tenbodai', name: '角島展望台', category: 'view', note: '橋を望む本州側の展望デッキ', minutes: 20 },
  { id: 'front-hill', name: '正面・高台の撮影ポイント', category: 'view', note: '定番の中央構図', minutes: 20 },
  { id: 'sezakiyo', name: '瀬崎陽の公園', category: 'view', note: '角島側から橋を振り返る', minutes: 20 },
  { id: 'lighthouse', name: '角島灯台', category: 'nature', note: '1876年点灯・登れる灯台', minutes: 40 },
  { id: 'ohama', name: '角島大浜海水浴場', category: 'beach', note: '白砂とコバルトブルーの海', minutes: 45 },
  { id: 'makizaki', name: '牧崎風の公園', category: 'nature', note: '草原と断崖の岬', minutes: 40 },
  { id: 'lunch', name: '海景ランチ', category: 'food', note: '海鮮丼・瓦そばなど', minutes: 60 },
  { id: 'sweets', name: 'ご当地スイーツ', category: 'sweets', note: '角島プリン・ジェラート', minutes: 20 },
];

export const categoryLabel: Record<Attraction['category'], string> = {
  view: '展望・撮影',
  nature: '自然',
  beach: 'ビーチ',
  food: '食事',
  sweets: 'スイーツ',
};
