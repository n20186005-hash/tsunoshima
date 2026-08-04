export interface Viewpoint {
  id: string;
  name: string;
  short: string; // 一言での特徴
  image: string;
  alt: string;
  walk: string; // 駐車場からの徒歩
  focal: string; // おすすめ焦点距離
  sunset: boolean; // 夕景向き
  steps: boolean; // 階段の有無
  direction: string; // 撮影方向
  stay: string; // 目安の滞在
  body: string;
  tips?: string;
  warn?: string; // 注意（路上駐車など）
}

export const viewpoints: Viewpoint[] = [
  {
    id: 'tenbodai',
    name: '角島展望台',
    short: '橋脚と浅瀬の色を、少し高い位置から',
    image: '/images/bridge-side.jpg',
    alt: '角島展望台から見た角島大橋の橋脚と浅瀬',
    walk: '駐車場から徒歩3〜5分',
    focal: 'スマホ1×〜2× / 35〜70mm',
    sunset: false,
    steps: true,
    direction: '南西向き',
    stay: '15〜20分',
    body:
      '橋の左手、少し高い位置にある木のデッキ。橋脚と浅瀬の色の層を一緒に見下ろせます。海士ヶ瀬公園から遊歩道でつながっています。',
    tips: '手前の橋脚を入れると奥行きが出ます。木道が濡れている日は足元にご注意ください。',
  },
  {
    id: 'amagase',
    name: '海士ヶ瀬公園',
    short: '初めての一枚と、休憩に',
    image: '/images/bridge-2017.jpg',
    alt: '海士ヶ瀬公園側から望む晴れた日の角島大橋',
    walk: '駐車場からすぐ',
    focal: 'スマホ1× / 24〜35mm',
    sunset: false,
    steps: false,
    direction: '西向き',
    stay: '10〜15分',
    body:
      '駐車場・トイレに最も近く、橋の全景をいちばん手軽に見られる場所。初めての方、家族連れ、短い滞在にも向いています。',
    tips: 'まずはここで全体像をつかんでから、展望台や高台へ移動すると迷いません。',
  },
  {
    id: 'front-hill',
    name: '正面・高台の撮影ポイント',
    short: '角島へ伸びる、あの定番構図',
    image: '/images/bridge-front.jpg',
    alt: '山側の高台から見た角島大橋の定番の正面構図',
    walk: '海士ヶ瀬公園から徒歩7〜10分',
    focal: 'スマホ2×〜3× / 50〜85mm',
    sunset: false,
    steps: true,
    direction: '西向き（橋を正面に）',
    stay: '15〜20分',
    body:
      '橋が角島へまっすぐ伸びる、いちばん有名な中央構図が狙える高台。写真で見かける一枚の多くはこの付近からのものです。',
    warn: '専用の駐車場はありません。車は海士ヶ瀬公園に停め、歩いて向かってください。路肩や生活道路への駐停車はご遠慮を。',
    tips: '望遠側で圧縮すると橋のカーブがより際立ちます。',
  },
  {
    id: 'sezakiyo',
    name: '瀬崎陽の公園',
    short: '角島側から、本州と鳩島を振り返る',
    image: '/images/seaside.jpg',
    alt: '角島側の海岸から本州方向を振り返る眺め',
    walk: '橋を渡った角島側',
    focal: '24〜50mm',
    sunset: true,
    steps: false,
    direction: '東向き（本州を望む）',
    stay: '15〜30分',
    body:
      '橋を渡った角島側から、本州と鳩島、そして橋を振り返れる公園。夕方は逆光がやわらぎ、シルエットや橋の灯りが美しく見えます。',
    tips: '夕景ねらいなら日没の30〜40分前から。海側の岩場は足元にご注意を。',
  },
];
