# Architecture / 現在の構造

## Runtime
Plain HTML5 pages with non-module JavaScript and ordinary linked stylesheets. No runtime bundler, framework, build step, or backend was added. HTTP static hosting is sufficient. This is a deliberate preservation measure for v0.82.

## Entry points
- `index.html`: homepage, summaries and primary navigation
- `projects.html`: specified municipal projects
- `city-dashboard.html`: statistics
- `issues.html`: ten issues
- `budget.html`: municipal finances
- `compare.html`: case studies
- `gikai.html`: council explorer
- `council.html`: original redirect page, preserved
- `case-photo-sources.html`: image/source references
- `articles/*.html`: 21 individual long-form case-study pages, exact public URLs retained

## Source assets
- styles/foundation: shared styles
- styles/pages: route-specific styles
- styles/overrides: successive compatibility patches, still ordered exactly as v0.82
- scripts/core: cross-page navigation, controls and deep-link handling
- scripts/data: dataset and copy declarations
- scripts/features: page feature engines
- scripts/legacy: historical program; `assets/js/v34.js` is an identical compatibility copy because `commons-content.js` dynamically writes that original URL into the document

**Important:** JavaScript files exchange global variables and functions. Moving the physical file does not change execution context. Switching to ES modules changes scope/timing and should be a separate project with tests.

## データと描画

- 財政の費目、歳入、決算推移は `assets/scripts/data/finance-data.js` が持ち、`budget.html` の財政スクリプトが参照します。既存のスクリプトに先立つ `defer` 付きの通常スクリプトとして読み込みます。
- 市議会の会期一覧は `assets/data/council-sessions.json`、記事と出典は会期別 JSON で管理します。そこから生成した `council-data.js` を `council-engine.js` の直前に読み込みます。[画面構成と更新手順](COUNCIL_REDESIGN.md)
- 統計の主なデータは `dashboard-data.js` と `v65-history.js` にあります。出典台帳の対象や更新手順は [データ管理方針](DATA_POLICY.md) を参照してください。

## 保守上の課題

| 現状 | 変更時の影響 |
| --- | --- |
| `commons-content.js` にデータ・整形済み HTML・旧スクリプトの読み込みが混在 | 重点事業、先行事例、論点などの複数ページに影響するため、実行箇所と互換 URL の確認が必要 |
| トップページの議案紹介や財政の一部の要約値が、各詳細ページと別の場所で管理されている | データ更新時は、詳細ページとトップページの出典・対象期間・値を照合する必要がある |
| 財政の一部の集計・説明用の数値が HTML や描画スクリプトにも残る | データファイルだけで値を更新できる範囲は、分離済みの項目に限られる |
| 出典・対象期間・日付の記録形式が既存ページごとに異なる | 台帳への移行時は、公表日・取得日・集計時点・サイト更新日を原資料で確認する必要がある |
| CSS の上書きと通常スクリプトのグローバル依存が多い | 依存順を保ち、ファイル統合やモジュール移行は個別に画面と操作を検証する必要がある |

## Publishing
`scripts/build_pages.py` は、`scripts/pages-files.txt` にあるファイルを相対パスのまま配信用ディレクトリへコピーします。GitHub Pagesのワークフローは、この出力を配信します。サイト本体は一般的な静的ホスティングでも起動できます。

## Runtime-constructed asset reference (important)
`assets/scripts/data/commons-content.js` uses `document.write()` to inject a `<script src="assets/js/v34.js">` tag. The browser resolves that path from the HTML page (not from the JS file). To ensure identical behavior, `assets/js/v34.js` is retained as a byte-identical compatibility copy. Do not remove it unless this dependency is migrated with a browser test.
