# Source inventory / 保守用ファイル一覧

基準: v0.82。継続開発向けの財政・市議会データの分離を反映しています。

## File counts
- HTML: 9 root pages + 21 articles = 30
- CSS: 19
- JS: 25 (+1 compatibility copy)
- Data JSON: 2

## Page dependencies (load order is critical)

### budget.html

CSS: `site.css` → `main-base.css` → `finance.css` → `latest.css` → `v75.css` → `v78.css` → `v79.css` → `v82.css`

JS: `finance-data.js` → `finance-engine.js` → `v39-controls.js` → `common-nav-v60.js` → `v64-deeplink.js` → `v66-budget.js` → `v66-deeplink.js` → `v79-nav.js` → `v78-focus.js`

### case-photo-sources.html

CSS: `site.css` → `main-base.css` → `latest.css` → `photo-credits.css` → `v75.css` → `v78.css` → `v79.css` → `v82.css`

JS: `v79-nav.js` → `v39-controls.js` → `common-nav-v60.js` → `v78-focus.js`

### city-dashboard.html

CSS: `statistics.css` → `latest.css` → `v75.css` → `v78.css` → `v79.css` → `v82.css`

JS: `v37-data-status.js` → `v39-controls.js` → `dashboard-data.js` → `v65-history.js` → `statistics-engine.js` → `v64-deeplink.js` → `v66-deeplink.js` → `common-nav-v60.js` → `v79-nav.js` → `v78-focus.js`

### compare.html

CSS: `site.css` → `main-base.css` → `cases.css` → `latest.css` → `v75.css` → `v78.css` → `v79.css` → `v82.css`

JS: `v37-page.js` → `v39-controls.js` → `ui.js` → `commons-content.js` → `case-articles.js` → `case-news.js` → `v50-ui.js` → `v64-deeplink.js` → `common-nav-v60.js` → `v79-nav.js` → `v78-focus.js`

### council.html

CSS: `v75.css` → `v82.css`

JS: `v79-nav.js`

### gikai.html

CSS: `site.css` → `main-base.css` → `council.css` → `latest.css` → `v75.css` → `v78.css` → `v79.css` → `v82.css`

JS: `common-nav-v60.js` → `v39-controls.js` → `council-data.js` → `council-engine.js` → `v79-nav.js` → `v78-focus.js`

### index.html

CSS: `site.css` → `main-base.css` → `home.css` → `latest.css` → `v75.css` → `v78.css` → `v79.css` → `v80.css` → `v81.css` → `v82.css`

JS: `v37-page.js` → `v39-controls.js` → `ui.js` → `commons-content.js` → `v50-ui.js` → `dashboard-data.js` → `v65-history.js` → `case-articles.js` → `v66-home.js` → `v64-deeplink.js` → `common-nav-v60.js` → `v79-nav.js` → `v78-focus.js`

### issues.html

CSS: `site.css` → `issues-transport.css` → `main-base.css` → `issues.css` → `latest.css` → `v75.css` → `v78.css` → `v79.css` → `v82.css`

JS: `v37-page.js` → `v39-controls.js` → `ui.js` → `commons-content.js` → `issues-engine.js` → `v64-deeplink.js` → `v66-deeplink.js` → `common-nav-v60.js` → `v79-nav.js` → `v78-focus.js`

### projects.html

CSS: `site.css` → `main-base.css` → `projects.css` → `latest.css` → `v75.css` → `v78.css` → `v79.css` → `v82.css`

JS: `v37-page.js` → `v39-controls.js` → `ui.js` → `commons-content.js` → `v64-deeplink.js` → `v66-deeplink.js` → `common-nav-v60.js` → `v79-nav.js` → `v78-focus.js`

### articles/aizu-cityhall.html

CSS: `site.css` → `articles.css` → `latest.css` → `v75.css` → `v78.css` → `v79.css` → `v82.css`

JS: `ui.js` → `v39-controls.js` → `common-nav-v60.js` → `v64-article-rail.js` → `v79-nav.js` → `v78-focus.js`

### articles/bankart1929.html

CSS: `site.css` → `articles.css` → `latest.css` → `v75.css` → `v78.css` → `v79.css` → `v82.css`

JS: `ui.js` → `v39-controls.js` → `common-nav-v60.js` → `v64-article-rail.js` → `v79-nav.js` → `v78-focus.js`

### articles/barcelona-superblock.html

CSS: `site.css` → `articles.css` → `latest.css` → `v75.css` → `v78.css` → `v79.css` → `v82.css`

JS: `ui.js` → `v39-controls.js` → `common-nav-v60.js` → `v64-article-rail.js` → `v79-nav.js` → `v78-focus.js`

### articles/camden-school-streets.html

CSS: `site.css` → `articles.css` → `latest.css` → `v75.css` → `v78.css` → `v79.css` → `v82.css`

JS: `ui.js` → `v39-controls.js` → `common-nav-v60.js` → `v64-article-rail.js` → `v79-nav.js` → `v78-focus.js`

### articles/echigo-tsumari.html

CSS: `site.css` → `articles.css` → `latest.css` → `v75.css` → `v78.css` → `v79.css` → `v82.css`

JS: `ui.js` → `v39-controls.js` → `common-nav-v60.js` → `v64-article-rail.js` → `v79-nav.js` → `v78-focus.js`

### articles/helsinki-omastadi.html

CSS: `site.css` → `articles.css` → `latest.css` → `v75.css` → `v78.css` → `v79.css` → `v82.css`

JS: `ui.js` → `v39-controls.js` → `common-nav-v60.js` → `v64-article-rail.js` → `v79-nav.js` → `v78-focus.js`

### articles/kamikatsu-why.html

CSS: `site.css` → `articles.css` → `latest.css` → `v75.css` → `v78.css` → `v79.css` → `v82.css`

JS: `ui.js` → `v39-controls.js` → `common-nav-v60.js` → `v64-article-rail.js` → `v79-nav.js` → `v78-focus.js`

### articles/kashiwa-udc2.html

CSS: `site.css` → `articles.css` → `latest.css` → `v75.css` → `v78.css` → `v79.css` → `v82.css`

JS: `ui.js` → `v39-controls.js` → `common-nav-v60.js` → `v64-article-rail.js` → `v79-nav.js` → `v78-focus.js`

### articles/kashiwanoha-udck.html

CSS: `site.css` → `articles.css` → `latest.css` → `v75.css` → `v78.css` → `v79.css` → `v82.css`

JS: `ui.js` → `v39-controls.js` → `common-nav-v60.js` → `v64-article-rail.js` → `v79-nav.js` → `v78-focus.js`

### articles/kisarazu-cityhall.html

CSS: `site.css` → `articles.css` → `latest.css` → `v75.css` → `v78.css` → `v79.css` → `v82.css`

JS: `ui.js` → `v39-controls.js` → `common-nav-v60.js` → `v64-article-rail.js` → `v79-nav.js` → `v78-focus.js`

### articles/kisarazu-organic.html

CSS: `site.css` → `articles.css` → `latest.css` → `v75.css` → `v78.css` → `v79.css` → `v82.css`

JS: `ui.js` → `v39-controls.js` → `common-nav-v60.js` → `v64-article-rail.js` → `v79-nav.js` → `v78-focus.js`

### articles/kitakyushu-ecotown.html

CSS: `site.css` → `articles.css` → `latest.css` → `v75.css` → `v78.css` → `v79.css` → `v82.css`

JS: `ui.js` → `v39-controls.js` → `common-nav-v60.js` → `v64-article-rail.js` → `v79-nav.js` → `v78-focus.js`

### articles/matsudo-oyako.html

CSS: `site.css` → `articles.css` → `latest.css` → `v75.css` → `v78.css` → `v79.css` → `v82.css`

JS: `ui.js` → `v39-controls.js` → `common-nav-v60.js` → `v64-article-rail.js` → `v79-nav.js` → `v78-focus.js`

### articles/nagareyama-station.html

CSS: `site.css` → `articles.css` → `latest.css` → `v75.css` → `v78.css` → `v79.css` → `v82.css`

JS: `ui.js` → `v39-controls.js` → `common-nav-v60.js` → `v64-article-rail.js` → `v79-nav.js` → `v78-focus.js`

### articles/nyc-participatory.html

CSS: `site.css` → `articles.css` → `latest.css` → `v75.css` → `v78.css` → `v79.css` → `v82.css`

JS: `ui.js` → `v39-controls.js` → `common-nav-v60.js` → `v64-article-rail.js` → `v79-nav.js` → `v78-focus.js`

### articles/paris-participatory.html

CSS: `site.css` → `articles.css` → `latest.css` → `v75.css` → `v78.css` → `v79.css` → `v82.css`

JS: `ui.js` → `v39-controls.js` → `common-nav-v60.js` → `v64-article-rail.js` → `v79-nav.js` → `v78-focus.js`

### articles/setagaya-odekake.html

CSS: `site.css` → `articles.css` → `latest.css` → `v75.css` → `v78.css` → `v79.css` → `v82.css`

JS: `ui.js` → `v39-controls.js` → `common-nav-v60.js` → `v64-article-rail.js` → `v79-nav.js` → `v78-focus.js`

### articles/sf-compost.html

CSS: `site.css` → `articles.css` → `latest.css` → `v75.css` → `v78.css` → `v79.css` → `v82.css`

JS: `ui.js` → `v39-controls.js` → `common-nav-v60.js` → `v64-article-rail.js` → `v79-nav.js` → `v78-focus.js`

### articles/toride-art.html

CSS: `site.css` → `articles.css` → `latest.css` → `v75.css` → `v78.css` → `v79.css` → `v82.css`

JS: `ui.js` → `v39-controls.js` → `common-nav-v60.js` → `v64-article-rail.js` → `v79-nav.js` → `v78-focus.js`

### articles/toshima-cityhall.html

CSS: `site.css` → `articles.css` → `latest.css` → `v75.css` → `v78.css` → `v79.css` → `v82.css`

JS: `ui.js` → `v39-controls.js` → `common-nav-v60.js` → `v64-article-rail.js` → `v79-nav.js` → `v78-focus.js`

### articles/waltham-forest.html

CSS: `site.css` → `articles.css` → `latest.css` → `v75.css` → `v78.css` → `v79.css` → `v82.css`

JS: `ui.js` → `v39-controls.js` → `common-nav-v60.js` → `v64-article-rail.js` → `v79-nav.js` → `v78-focus.js`

## Large modules needing future *separate* refactor

Do not split these during the v0.82 design freeze. Prioritize subsequent refactors only after browser regression testing.

| File | Size |
|---|---:|
| `assets/scripts/data/commons-content.js` | 361.1 KiB |
| `assets/styles/foundation/site.css` | 258.7 KiB |
| `assets/styles/pages/statistics.css` | 181.9 KiB |
| `assets/styles/pages/articles.css` | 123.1 KiB |
| `assets/styles/pages/council.css` | 112.8 KiB |
| `assets/scripts/data/case-articles.js` | 92.6 KiB |
| `assets/scripts/legacy/v34.js` | 92.4 KiB |
| `assets/styles/pages/finance.css` | 75.5 KiB |
| `assets/styles/pages/cases.css` | 73.1 KiB |
| `assets/scripts/features/statistics-engine.js` | 72.5 KiB |
| `assets/styles/pages/home.css` | 68.2 KiB |
| `assets/styles/foundation/main-base.css` | 66.3 KiB |

## Cautions

- `commons-content.js` inserts `assets/js/v34.js` dynamically; an original-path copy is retained.
- Some HTML articles have embedded inline markup/style; unchanged to avoid unintended differences.
- Relative links and query/hash fragments must remain valid on GitHub Pages and other static hosts.
- Database migration is not necessary for current source tree; do not introduce one for this clean-up.
- Original data accuracy and external image license checks are independent of the refactor.
