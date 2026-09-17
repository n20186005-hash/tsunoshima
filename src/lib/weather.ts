// 角島付近の天気取得（Open-Meteo ＋ Marine、キー不要）。
// ビルド時（サーバー）でもブラウザでも動作するよう、global fetch のみに依存。
// フロントエンドに「無料 API / キー不要」といった文言は出しません。

const LAT = 34.3523;
const LNG = 130.885;

// 地上の天気（気温・風・降水・紫外線など）
const ENDPOINT =
  `https://api.open-meteo.com/v1/forecast?latitude=${LAT}&longitude=${LNG}` +
  `&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m,uv_index,is_day` +
  `&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,sunrise,sunset` +
  `&timezone=Asia%2FTokyo&forecast_days=7`;

// 海のデータ（波の高さ・海水温）— 海岸の角島向けの安全目安に使う
// 注意：波高は daily、海水温は current の変数名（Marine API 仕様）
const MARINE_ENDPOINT =
  `https://marine-api.open-meteo.com/v1/marine?latitude=${LAT}&longitude=${LNG}` +
  `&current=sea_surface_temperature` +
  `&daily=wave_height_max` +
  `&timezone=Asia%2FTokyo&forecast_days=1`;

export interface WeatherNow {
  temp: number;
  apparent: number;
  humidity: number;
  precip: number;
  wind: number;
  uv: number;
  code: number;
  isDay: boolean;
}

export interface WeatherDay {
  date: string;
  code: number;
  tmax: number;
  tmin: number;
  pop: number;
  sunrise: string;
  sunset: string;
}

export interface WeatherMarine {
  waveMax: number; // 今日の最大波高（m）
  seaTemp: number; // 今日の海水温（℃）
}

export interface WeatherData {
  now: WeatherNow;
  days: WeatherDay[];
  marine?: WeatherMarine;
  fetchedAt: string;
}

// WMO 天気コード → 日本語ラベル・アイコン
export function wmo(code: number): { label: string; icon: string } {
  const m: Record<number, [string, string]> = {
    0: ['晴れ', '☀️'],
    1: ['大体晴れ', '🌤️'],
    2: ['一部曇り', '⛅'],
    3: ['曇り', '☁️'],
    45: ['霧', '🌫️'],
    48: ['霧氷', '🌫️'],
    51: ['弱い霧雨', '🌦️'],
    53: ['霧雨', '🌦️'],
    55: ['強い霧雨', '🌧️'],
    56: ['凍る霧雨', '🌧️'],
    57: ['強い凍る霧雨', '🌧️'],
    61: ['弱い雨', '🌦️'],
    63: ['雨', '🌧️'],
    65: ['強い雨', '🌧️'],
    66: ['凍る雨', '🌧️'],
    67: ['強い凍る雨', '🌧️'],
    71: ['弱い雪', '🌨️'],
    73: ['雪', '🌨️'],
    75: ['強い雪', '❄️'],
    77: ['雪粒', '❄️'],
    80: ['にわか雨', '🌦️'],
    81: ['雨', '🌧️'],
    82: ['激しいにわか雨', '⛈️'],
    85: ['弱い雪', '🌨️'],
    86: ['強い雪', '❄️'],
    95: ['雷雨', '⛈️'],
    96: ['雷雨・ひょう', '⛈️'],
    99: ['激しい雷雨・ひょう', '⛈️'],
  };
  const hit = m[code];
  return hit ? { label: hit[0], icon: hit[1] } : { label: 'その他', icon: '🌡️' };
}

// m/s → ビューフォート風力階級
export function beaufort(ms: number): number {
  if (ms < 0.3) return 0;
  if (ms < 1.6) return 1;
  if (ms < 3.4) return 2;
  if (ms < 5.5) return 3;
  if (ms < 8.0) return 4;
  if (ms < 10.8) return 5;
  if (ms < 13.9) return 6;
  if (ms < 17.2) return 7;
  if (ms < 20.8) return 8;
  if (ms < 24.5) return 9;
  if (ms < 28.5) return 10;
  if (ms < 32.7) return 11;
  return 12;
}

const LIGHT = new Set([51, 53, 55, 56, 57, 61, 80, 81]);
const HEAVY = new Set([63, 65, 66, 67, 82]);
const STORM = new Set([95, 96, 99]);

export interface Advice {
  outgoing: string[]; // 服装の目安
  playing: string[]; // 過ごし方の目安
  items: string[]; // 持ち物
  risk: string[]; // リスク注意（赤で置顶）
}

// 天気データから「そのまま行動に使える日本語の助言」を組み立てる。
// 該当しない条件は出力しない（動的レンダリング）。
export function advise(d: WeatherData): Advice {
  const out: string[] = [];
  const play: string[] = [];
  const items: string[] = [];
  const risk: string[] = [];

  const now = d.now;
  const today = d.days[0];
  const code = now.code;
  const pop = today.pop;
  const windLevel = beaufort(now.wind);
  const diff = today.tmax - today.tmin;
  const isLight = LIGHT.has(code);
  const isHeavy = HEAVY.has(code);
  const isStorm = STORM.has(code);
  const isSunny = code === 0 || code === 1;
  const isCloudy = code === 3;
  const isFog = code === 45 || code === 48;

  // 降水確率（「必ず降る」ではなく、確率で伝える）
  if (pop >= 60) {
    out.push('雨が降る可能性が高いので、雨具があると安心です。');
    play.push('屋内の施設を優先し、登山や海辺での遊びは控えめに。');
    items.push('傘 / レインコート');
  } else if (pop >= 30) {
    items.push('折りたたみ傘（にわか雨に備えて）');
  }

  // 小雨
  if (isLight && pop < 60) {
    out.push('小雨です。足元が滑りやすいので歩く際は注意。');
    play.push('屋外の体験はやや物足りないかもしれません。');
    items.push('折りたたみ傘');
  }
  // 中〜大雨
  if (isHeavy) {
    risk.push('雨が強いので、谷や低い土地は避けて行動しましょう。');
    play.push('屋外の遊びは控え、遊覧船などの海上プログラムは運休の可能性があります。');
    items.push('レインコート（風が強い日は長傘よりレインコートが安心）');
  }
  // 雷雨
  if (isStorm) {
    risk.push('雷に注意。山登りや海辺での水遊び、木の下での避雨は避けて。');
    play.push('水上プログラムは中止の可能性が高いです。');
  }
  // 高温
  if (today.tmax >= 32) {
    out.push('気温が高いので、正午の外出は避けて。');
    play.push('屋外での滞在時間は短めに。');
    items.push('日焼け止め、十分な飲み物、熱中症対策');
  }
  // 紫外線
  if (now.uv >= 5) {
    out.push('紫外線が強いので日焼け対策を。');
    items.push('日焼け止め、サングラス、帽子');
  }
  // 寒暖差
  if (diff > 8) {
    out.push('朝夕の寒暖差が大きいので、羽織るものがあると便利です。');
  }
  // 低温
  if (today.tmax <= 10) {
    out.push('気温が低いのでしっかり防寒を。');
    items.push('厚手の上着、マフラー');
  }
  // 風
  if (windLevel >= 7) {
    risk.push('風が強いので、看板や海辺の岩場から離れて。');
    play.push('海上の屋外プログラムは中止の可能性大。角島大橋の上も横風に注意。');
  } else if (windLevel >= 5) {
    out.push('風がやや強い。');
    play.push('海の遊覧船や屋外のアトラクションが運休の可能性。');
    items.push('帽子は飛ばされやすいので、ゆったりした服は避えて');
  }
  // 晴 / 曇
  if (isSunny) {
    out.push('天気が良く、屋外にぴったり。');
    play.push('朝焼け・夕焼けの景色におすすめ。');
    items.push('日焼け止め');
  }
  if (isCloudy) {
    out.push('光が柔らかく、撮影に良い日。');
    play.push('日差しがなく、長時間の屋外散歩に向いています。');
  }
  // 霧
  if (isFog) {
    risk.push('視界が悪いので、フェリー等の便の遅れに注意。');
    play.push('海や山の展望には不向き。');
    items.push('マスク');
  }
  // 海辺（角島）固有：波・海水温
  if (d.marine) {
    const w = d.marine.waveMax;
    const s = d.marine.seaTemp;
    play.push(`今日の波の高さは約${w}m、海水温は約${s}℃（磯遊びや岩場は波と足元に注意）。`);
    if (w >= 1.5) {
      play.push('波が高めです。岩場や磯への立ち入りは控えめに。');
    }
  }

  // すべて空なら、穏やかな日としてのんびり案内
  if (out.length === 0 && play.length === 0 && items.length === 0) {
    out.push('特に気になる点はありません。いつもの服装で大丈夫です。');
    play.push('のんびり過ごせる一日です。');
  }

  return { outgoing: out, playing: play, items, risk };
}

export async function fetchWeather(): Promise<WeatherData> {
  const [wRes, mRes] = await Promise.allSettled([fetch(ENDPOINT), fetch(MARINE_ENDPOINT)]);

  if (wRes.status !== 'fulfilled' || !wRes.value.ok) {
    throw new Error('weather fetch failed');
  }
  const j = (await wRes.value.json()) as any;
  const c = j.current;
  const d = j.daily;
  const days: WeatherDay[] = d.time.map((date: string, i: number) => ({
    date,
    code: d.weather_code[i],
    tmax: Math.round(d.temperature_2m_max[i]),
    tmin: Math.round(d.temperature_2m_min[i]),
    pop: d.precipitation_probability_max?.[i] ?? 0,
    sunrise: d.sunrise[i],
    sunset: d.sunset[i],
  }));

  let marine: WeatherMarine | undefined;
  if (mRes.status === 'fulfilled' && mRes.value.ok) {
    try {
      const m = (await mRes.value.json()) as any;
      const wh = m.daily?.wave_height_max?.[0];
      const st = m.current?.sea_surface_temperature;
      if (typeof wh === 'number' && typeof st === 'number') {
        marine = { waveMax: Math.round(wh * 10) / 10, seaTemp: Math.round(st) };
      }
    } catch {
      /* 海データが取れなくても天気は表示 */
    }
  }

  return {
    now: {
      temp: Math.round(c.temperature_2m),
      apparent: Math.round(c.apparent_temperature),
      humidity: c.relative_humidity_2m,
      precip: c.precipitation,
      wind: Math.round(c.wind_speed_10m),
      uv: Math.round(c.uv_index ?? 0),
      code: c.weather_code,
      isDay: c.is_day === 1,
    },
    days,
    marine,
    fetchedAt: new Date().toISOString(),
  };
}

const YOUBI = ['日', '月', '火', '水', '木', '金', '土'];

function dayLabel(date: string, i: number): string {
  if (i === 0) return '今日';
  if (i === 1) return '明日';
  const dt = new Date(date + 'T00:00:00');
  return `${dt.getMonth() + 1}/${dt.getDate()}(${YOUBI[dt.getDay()]})`;
}

// サーバー・クライアント両方で使う描画（ブラウザ専用 API は使わない）。
export function renderWeatherHTML(data: WeatherData): string {
  const a = advise(data);
  const now = data.now;
  const cur = wmo(now.code);
  const today = data.days[0];

  const riskHTML = a.risk.length
    ? `<div class="mt-3 rounded-xl border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700">
         <span class="font-bold">⚠️ 注意：</span>${a.risk.join(' ')}
       </div>`
    : `<div class="mt-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-2 text-xs text-emerald-700">
         ✓ 特記すべき気象注意情報はありません（最新は気象庁の発表もあわせて）
       </div>`;

  const base = `
    <div class="flex items-end gap-4">
      <span class="text-5xl leading-none text-ink tnum">${now.temp}°</span>
      <div>
        <div class="text-2xl">${cur.icon}</div>
        <div class="text-sm font-medium text-ink">${cur.label}</div>
      </div>
      <div class="ml-auto text-right text-xs text-ink-soft">
        <div>体感 ${now.apparent}°</div>
        <div>湿度 ${now.humidity}%</div>
        <div>風 ${now.wind} m/s</div>
        ${now.uv ? `<div>紫外線 ${now.uv}</div>` : ''}
      </div>
    </div>
    <p class="mt-3 rounded-xl bg-sky/40 px-4 py-2 text-sm text-ink">今日の降水確率 ${today.pop}%</p>
    ${
      data.marine
        ? `<p class="mt-2 text-xs text-ink-soft">波の高さ 約${data.marine.waveMax}m・海水温 約${data.marine.seaTemp}℃（海辺の遊びは波と岩に注意）</p>`
        : ''
    }
  `;

  const block = (title: string, items: string[]) =>
    items.length
      ? `<div class="mt-4 rounded-2xl border border-black/5 bg-white/70 p-4">
          <h3 class="text-sm font-bold text-deep">${title}</h3>
          <ul class="mt-2 space-y-1.5 text-sm text-ink">
            ${items.map((i) => `<li class="flex gap-2"><span class="text-shallow">✓</span><span>${i}</span></li>`).join('')}
          </ul>
        </div>`
      : '';

  const rows = data.days
    .slice(0, 7)
    .map((d, i) => {
      const w = wmo(d.code);
      const label = dayLabel(d.date, i);
      return `<div class="flex items-center justify-between gap-2 py-1.5">
        <span class="w-14 text-sm text-ink-soft">${label}</span>
        <span class="text-lg">${w.icon}</span>
        <span class="flex-1 text-sm text-ink">${w.label}</span>
        <span class="tnum text-sm text-ink">${d.tmax}° / ${d.tmin}°</span>
        <span class="tnum w-12 text-right text-xs text-sky">${d.pop}%</span>
      </div>`;
    })
    .join('');

  return (
    riskHTML +
    base +
    block('服装の目安', a.outgoing) +
    block('過ごし方の目安（遊び方）', a.playing) +
    block('持ち物', a.items) +
    `<div class="mt-4 divide-y divide-black/5">${rows}</div>`
  );
}
