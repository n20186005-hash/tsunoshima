# 角島展望台ガイド（Tsunoshima Viewpoint Guide）

角島大橋を望む本州側の展望台を入口に、駐車・撮影・アクセス・食事・行程づくりまでを日本語でまとめた実用型の観光ガイドサイト。`doc.md` の企画にもとづく実装です。

## 技術スタック

- **Astro 5**（静的出力）＋ **Tailwind CSS 4**（`@tailwindcss/vite`）＋ **TypeScript**
- フォントはセルフホスト（`@fontsource`、日本語＋ラテンのサブセットのみ）
- データベース・ログイン・CMS なし。コンテンツは `src/data/` の型付き TS で管理
- GA4：`G-HXM22WWPKP`（本番ビルドでのみ読み込み）
- デプロイ想定：Cloudflare Workers 静的アセット（`wrangler.jsonc`）

## 開発

```bash
pnpm install            # 回線が遅い場合は pnpm install --prefer-offline
pnpm dev                # 開発サーバ
pnpm build              # dist/ に静的生成
pnpm preview            # ビルド結果をローカル確認
```

## ページ構成

| パス | 内容 |
| --- | --- |
| `/` | ヒーロー・位置関係の俯瞰図・4スポット比較・今日の角島ブルー・Q&A・モデルコース |
| `/viewpoints` | 4つの撮影スポット比較＋地図連動の写真スイッチャー |
| `/access` | 車・バス・混雑・強風時の通行情報、駐車場ナビ |
| `/photo-guide` | 天気別の撮り方・焦点距離・撮影マナー（ドローン届出含む） |
| `/history` | 灯台（1876）と大橋（2000）の時間軸と読み物 |
| `/food` | 動線別（過橋前／島内／環島途中）の周辺グルメ |
| `/model-course` | 45分〜1日のモデルコース＋「わたしの角島 半日プラン」ビルダー |
| `/faq` | よくある質問（FAQPage 構造化データ） |
| `/credits` | 写真の著作者・ライセンス・出典一覧 |

## 主な機能

- **俯瞰イメージ図（自作SVG）**：似た名前の4スポットの位置関係を最初に整理
- **写真スイッチャー**：地図上の点をタップすると、その場所からの眺めに切替
- **今日の角島ブルー**：Open-Meteo（APIキー不要）から当日の天気を取得し、
  海の色の見えやすさを 0〜100 の参考指数と時間帯提案に変換
- **プランビルダー**：立ち寄り先を選ぶと滞在時間を集計。LocalStorage と URL パラメータに保存、
  Canvas でシェアカード（1:1／4:5／9:16）を生成
- **GA4 イベント**：`hero_navigation_click` / `parking_navigation_click` / `photo_spot_switch` /
  `weather_card_view` / `route_save` / `route_share` / `share_card_generate` /
  `nearby_attraction_add` などを `data-ga` 属性で宣言的に送信

## 写真について

すべての写真はウィキメディア・コモンズのクリエイティブ・コモンズ／パブリックドメイン作品で、
`scripts/download-images.py` で取得しています。著作者・ライセンス・出典は `/credits` に掲載し、
`src/data/credits.json` が原本です。差し替える場合はスクリプトの `SELECTION` を編集して再実行してください。

## 公開前に差し替える項目

- `astro.config.mjs` と `src/data/site.ts`、`public/robots.txt` の公開URL
- 掲載施設の営業時間・バス時刻（`status: verify` の項目）は訪問前確認を前提の設計
