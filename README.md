# 我孫子ダッシュボード / Abiko Dashboard

市政の公開データを市民の視点で可視化する、非公式・独立した市民プロジェクトです。重点事業、財政、統計、市議会、地域の論点、先行事例を原資料とともにたどれます。

継続開発の基準は v0.82（2026年11月17日版）です。HTML・CSS・通常の JavaScript で動作し、サイトの起動にビルド、フレームワーク、データベースは不要です。

## ローカルで起動

Git と Python 3 が必要です。

```bash
git clone https://github.com/openlab-abiko/abiko-dashboard.git
cd abiko-dashboard
python3 -m http.server 8000
```

ブラウザで [http://localhost:8000/](http://localhost:8000/) を開きます。ローカルファイルを直接開く場合とは、ブラウザの動作が異なります。

## 構成

| 場所 | 役割 |
| --- | --- |
| ルートの HTML と `articles/` | 主要9ページと先行事例21記事。既存の URL と相対パスを維持します |
| `assets/styles/` | 共通スタイル、ページ別スタイル、既存の上書きスタイル |
| `assets/scripts/core/` | ナビゲーションなどの共通 UI と互換処理 |
| `assets/scripts/features/` | 財政、統計、議会などの描画と操作 |
| `assets/scripts/data/` | ブラウザで使用するデータ、記事本文、既存の編集コンテンツ |
| `assets/data/` | 市議会の JSON データと、出典・対象期間・更新日の管理台帳 |
| `scripts/`、`tests/` | 市議会の表示用データ生成と静的・画面検証 |
| `docs/` | 構成、データ管理方針、保全基準、検証資料 |

対象データと更新手順は [データ管理方針](docs/DATA_POLICY.md)、既存コードの依存関係と保守上の課題は [構成と課題](docs/ARCHITECTURE.md) を参照してください。

## 開発と検証

Codex と Claude Code は共通の [AGENTS.md](AGENTS.md) に従います。GitHub の `main` から作業ブランチを作り、データ更新・構成変更・画面変更は目的ごとにレビューします。従来の CSS と通常のスクリプトの読み込み順、および `assets/js/v34.js` の互換 URL を維持します。

```bash
python3 scripts/sync_council_data.py --check
python3 tests/check_integrity.py
```

画面比較には Python の Playwright と Pillow、および Chromium が必要です。OS に `chromium` がある場合はそれを使用します。それ以外は `python -m playwright install chromium` で導入できます。

```bash
python3 -m venv .venv
. .venv/bin/activate
python -m pip install playwright pillow
python tests/visual_regression.py --baseline ../abiko-baseline
```

画面比較の前に、前回承認した版を `../abiko-baseline` に展開します。標準の比較対象は30ページの PC・モバイル表示です。手動検証項目は [MANUAL_QA.md](docs/MANUAL_QA.md) を参照してください。

コミット前に、クローンごとに公開してよい作成者名とGitHubのnoreplyアドレスを設定します。運営者の登録名は `openlab-abiko` です。メールには各自の [GitHub Settings → Emails](https://github.com/settings/emails) に表示されたアドレスを使い、`git var GIT_AUTHOR_IDENT` と `git var GIT_COMMITTER_IDENT` で両方の設定を確認してください。

## 公開

新しいページや画像を配信する場合は、公開してよいことを確認し、`scripts/pages-files.txt` にパスを追加します。配信するファイルを次の手順で生成し、公開時と同じサブパスで試せます。

```bash
python3 scripts/build_pages.py --output ../pages-preview/abiko-dashboard
python3 -m http.server 8000 --directory ../pages-preview
```

プレビューは [http://localhost:8000/abiko-dashboard/](http://localhost:8000/abiko-dashboard/) で開きます。配信先は [GitHub Pages](https://openlab-abiko.github.io/abiko-dashboard/) のプロジェクトサイトです。初回は運営者がリポジトリを一般公開し、Settings → Pages → Build and deployment で GitHub Actions を選んだうえで、Actions の「GitHub Pages」を `main` から実行します。以降は、運営者が差分と検証結果を承認して `main` にマージすると、同じワークフローで公開されます。

配信する範囲は許可リストで決まります。リポジトリの一般公開後は、GitHub上で開発資料も閲覧できます。個人情報や非公開の資料はリポジトリの外で管理してください。
