#!/usr/bin/env python3
"""Download curated CC-licensed Tsunoshima photos from Wikimedia Commons.
Writes files to public/images/ and an attribution manifest to src/data/credits.json.
"""
import urllib.request, urllib.parse, json, os, re, sys

UA = {'User-Agent': 'TsunoshimaViewpointGuide/1.0 (contact jsiwano@gmail.com)'}
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
IMG_DIR = os.path.join(ROOT, 'public', 'images')
DATA_DIR = os.path.join(ROOT, 'src', 'data')
os.makedirs(IMG_DIR, exist_ok=True)
os.makedirs(DATA_DIR, exist_ok=True)

# slug -> (Commons File title, requested width, japanese caption/alt)
SELECTION = {
    'hero-bridge':        ('File:角島大橋 (38654569244).jpg', 2400, '海の上を弧を描いて伸びる角島大橋の空撮'),
    'bridge-panorama':    ('File:Tsunoshima Bridge panorama (32275932414).jpg', 2560, '角島大橋と浅瀬の色が広がるパノラマ'),
    'bridge-front':       ('File:Tsunoshima ohashi.JPG', 1920, '山側の高台から望む角島大橋の正面構図'),
    'bridge-classic':     ('File:角島大橋１.jpg', 1920, '角島へまっすぐ伸びる角島大橋'),
    'bridge-2017':        ('File:Tsunoshima ohashi 2017-07-29.jpg', 1920, '晴れた日の角島大橋とエメラルドグリーンの海'),
    'bridge-rough':       ('File:角島大橋少し荒れ.jpg', 1920, '風の強い日にやや波立つ角島大橋の海'),
    'bridge-side':        ('File:Tsunoshima Bridge (32994549311).jpg', 1920, '橋脚と浅瀬の層が見える角島大橋'),
    'beach':              ('File:Tsunoshima Cobalt Blue Beach.jpg', 1920, 'コバルトブルーに輝く角島の砂浜と海'),
    'sea':                ('File:The beautiful sea 角島 綺麗な海、夏の終わり - panoramio.jpg', 1920, '夏の終わりの角島の澄んだ海'),
    'seaside':            ('File:Tunoshima sea side.JPG', 1920, '角島の海岸線と岩場'),
    'lighthouse':         ('File:Tsunoshima light house 2012.jpg', 1600, '御影石造りの角島灯台'),
    'lighthouse-winter':  ('File:Lighthouse and Narcissuses 角島灯台とスイセンの花 - panoramio.jpg', 1920, '水仙の花と冬の角島灯台'),
    'lighthouse2':        ('File:角島の灯台.jpg', 1600, '青空にそびえる角島灯台'),
    'store':              ('File:Tsunoshima-bridge Store.jpg', 1920, '海士ヶ瀬公園そばの売店と駐車エリア'),
    'bus':                ('File:Tsunoshima-bridge Bus.jpg', 1920, '角島大橋のたもとを走る路線バス'),
}


def api(params):
    params['format'] = 'json'
    url = 'https://commons.wikimedia.org/w/api.php?' + urllib.parse.urlencode(params)
    req = urllib.request.Request(url, headers=UA)
    return json.load(urllib.request.urlopen(req, timeout=60))


def strip_html(s):
    return re.sub(r'\s+', ' ', re.sub('<[^>]+>', '', s or '')).strip()


credits = []
titles = [v[0] for v in SELECTION.values()]
meta = {}
for i in range(0, len(titles), 10):
    batch = titles[i:i+10]
    d = api({'action': 'query', 'titles': '|'.join(batch), 'prop': 'imageinfo',
             'iiprop': 'url|extmetadata|size', 'iiurlwidth': 2560})
    # map normalized titles back
    norm = {}
    for n in d['query'].get('normalized', []):
        norm[n['to']] = n['from']
    for p in d['query']['pages'].values():
        meta[p['title']] = p

for slug, (title, width, alt) in SELECTION.items():
    # find page by title (handle normalization of fullurl-escaped titles)
    page = meta.get(title)
    if not page:
        # try normalized lookup
        for t, pg in meta.items():
            if t.replace(' ', '_') == title.replace(' ', '_'):
                page = pg
                break
    if not page or 'imageinfo' not in page:
        print('!! not found:', slug, title, file=sys.stderr)
        continue
    ii = page['imageinfo'][0]
    md = ii.get('extmetadata', {})
    # build a thumb url at requested width
    d2 = api({'action': 'query', 'titles': title, 'prop': 'imageinfo',
              'iiprop': 'url', 'iiurlwidth': width})
    pg2 = list(d2['query']['pages'].values())[0]
    thumb = pg2['imageinfo'][0].get('thumburl') or ii['url']
    ext = '.jpg'
    dest = os.path.join(IMG_DIR, slug + ext)
    req = urllib.request.Request(thumb, headers=UA)
    data = urllib.request.urlopen(req, timeout=120).read()
    with open(dest, 'wb') as f:
        f.write(data)
    print(f'downloaded {slug:20s} {len(data)//1024:6d} KB  <- {title}')
    credits.append({
        'slug': slug,
        'file': f'/images/{slug}{ext}',
        'title': title.replace('File:', ''),
        'author': strip_html(md.get('Artist', {}).get('value', 'Unknown')),
        'license': md.get('LicenseShortName', {}).get('value', ''),
        'licenseUrl': md.get('LicenseUrl', {}).get('value', ''),
        'sourceUrl': ii.get('descriptionurl', ''),
        'alt': alt,
    })

with open(os.path.join(DATA_DIR, 'credits.json'), 'w') as f:
    json.dump(credits, f, ensure_ascii=False, indent=2)
print('\nWrote', len(credits), 'credits ->', os.path.join(DATA_DIR, 'credits.json'))
