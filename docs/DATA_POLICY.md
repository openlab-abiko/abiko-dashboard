# データ管理方針

サイトの表示に使う値と、出典を管理する台帳を分けています。表示処理は `assets/scripts/features/`、ブラウザで読むデータは `assets/scripts/data/`、出典台帳は [assets/data/catalog.json](../assets/data/catalog.json) に置きます。台帳は保守用で、現在のページでは画面の出典表示を組み立てるために使っていません。

## 管理台帳

データセットごとに一意の `id`、名称、リポジトリ内のデータの場所 `data_path`、対象年度または集計期間 `coverage`、ダッシュボード側のデータ更新日 `updated_on`、出典 `sources` を記録します。各出典には発行機関 `publisher`、資料名 `title`、原資料の `url`、取得日 `retrieved_on` を記録します。

日付は `YYYY-MM-DD` で管理します。記録を確認できない日は `null` を使用します。資料の公表日、集計時点、取得日、サイト側の更新日は別々に扱います。今回登録したのは既存コードに記載のある出典です。原資料の再取得や数値の再集計は実施していません。

| データ | 更新箇所 |
| --- | --- |
| 財政の費目・歳入と決算推移 | `assets/scripts/data/finance-data.js`。描画処理は `finance-engine.js` と `v66-budget.js` |
| 市議会の会期・記録 | `assets/data/council-sessions.json` と会期別 JSON（`data-2026-09.json` など）。[議会データの更新手順](COUNCIL_REDESIGN.md) |
| 人口などの統計 | `assets/scripts/data/dashboard-data.js` と `v65-history.js`。人口・世帯の出典から台帳登録を開始 |
| 市議会と海外の先行事例の写真 | [assets/data/photo-sources.json](../assets/data/photo-sources.json) |

議会 JSON を更新したら、次のコマンドを実行し、JSON と生成された `assets/scripts/data/council-data.js` を同じコミットでレビューします。台帳の対象期間・更新日・出典も照合します。トップページの議案紹介は現時点では独立した既存の編集用データです。

```bash
python3 scripts/sync_council_data.py
python3 scripts/sync_council_data.py --check
```

予算・決算・公的な推計・サイト独自の試算を区別し、単位、母集団、加工方法、再利用条件を確認します。異なる期間や分類を統合する場合は根拠を記録します。出典不明の値や日付を推測で補いません。

## 写真の管理

1. 元の配布ページで作者、ライセンス、掲載・加工・再配布の条件を確認します。写真は `assets/images/editorial/` に保存します。ファイル名には安定した写真IDを使い、適切な解像度のWebPに変換します。
2. 台帳の `assets` に写真ID、ファイルとサイズ、代替テキスト、キャプション、作者、ライセンスとそのURL、配布ページ、元画像URLを登録します。市議会のカードでは「写真はイメージです」から写真の出典にリンクします。海外事例の `context` には写真の撮影対象を記載します。差し替え前の写真の用途は `previousUse` に記録し、出典ページのアンカーを引き継ぎます。
3. `cases` は記事のファイル名に対応するIDを、`council` はテーマや記録を写真IDに対応させます。下記を実行して、記事の写真・カード用データ・公開クレジットを台帳と同期します。写真はサイト内から読み込み、配布元にはクレジットからリンクします。[公開クレジット](../case-photo-sources.html#editorial-photo-title)

```bash
python3 scripts/sync_photo_assets.py
python3 scripts/sync_council_data.py
python3 scripts/sync_photo_assets.py --check
python3 scripts/sync_council_data.py --check
```
