export interface RouteStep {
  label: string;
  note?: string;
}
export interface Route {
  id: string;
  title: string;
  duration: string;
  best: string; // どんな人向け
  image: string;
  alt: string;
  steps: RouteStep[];
}

export const routes: Route[] = [
  {
    id: 'quick',
    title: '45分 ― 大橋だけを見る',
    duration: '約45分',
    best: '時間が短い方、バスツアー、定番の一枚だけ撮りたい方',
    image: '/images/bridge-classic.jpg',
    alt: '角島へまっすぐ伸びる角島大橋',
    steps: [
      { label: '海士ヶ瀬公園に駐車' },
      { label: '海士ヶ瀬公園で撮影', note: '橋の全景' },
      { label: '角島展望台', note: '橋脚と浅瀬' },
      { label: '正面・高台の撮影ポイント', note: '定番の中央構図' },
      { label: '駐車場へ戻る' },
    ],
  },
  {
    id: 'classic',
    title: '3時間 ― 角島の定番コース',
    duration: '約3時間',
    best: '橋も島も、ひととおり見て回りたい方',
    image: '/images/lighthouse.jpg',
    alt: '御影石造りの角島灯台',
    steps: [
      { label: '角島展望台' },
      { label: '角島大橋を渡る' },
      { label: '瀬崎陽の公園', note: '角島側から振り返る' },
      { label: '角島大浜海水浴場' },
      { label: '角島灯台', note: '登れる灯台' },
      { label: '牧崎風の公園' },
    ],
  },
  {
    id: 'photo',
    title: '半日 ― 撮影メインのコース',
    duration: '約4〜5時間',
    best: '光を追って、じっくり撮りたい方',
    image: '/images/bridge-front.jpg',
    alt: '高台から見た角島大橋の正面構図',
    steps: [
      { label: '午前・角島展望台', note: '海の色が澄む時間' },
      { label: '正面・高台の撮影ポイント' },
      { label: '橋を渡る' },
      { label: '角島灯台' },
      { label: '牧崎風の公園' },
      { label: '海景ランチ' },
      { label: '瀬崎陽の公園', note: '夕方に橋を振り返る' },
    ],
  },
  {
    id: 'northshore',
    title: '1日 ― 北浦をめぐるコース',
    duration: '1日',
    best: '角島だけでなく、北浦の海岸線も楽しみたい方',
    image: '/images/sea.jpg',
    alt: '角島周辺の澄んだ日本海',
    steps: [
      { label: '道の駅 北浦街道ほうほく' },
      { label: '角島展望台' },
      { label: '角島を一周', note: '灯台・海水浴場' },
      { label: '土井ヶ浜海岸' },
      { label: '川棚温泉方面へ' },
    ],
  },
];
