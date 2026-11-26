# 「市議会を見る」の構成と編集手順

## 改修範囲

既存の `gikai.html` は市長提出議案24件を対象にしており、議案の分類、採決結果、日程、議会のしくみ、出典を表示していました。公開用の入口、全体ナビゲーション、フローティングメニュー、フッター、議会のしくみの詳細解説を引き継ぎました。

参照HTMLから、掲載対象の52件のID、給食費を報告・条例・請願・意見書で追う構成、介護認定調査の質疑、日程、編集方針を取り入れました。一般質問の日程と要項に加え、実際のやりとりを本会議録で確認しました。市政一般報告は参照HTMLと同じ8項目を選び、正式な項目名と公開資料のアンカーを照合しました。52件の記録IDは検証用データに収録しています。「みらい議会」からは、注目記録を先に紹介し、テーマ・会期から記録に進める情報設計を参考にしました。[記録ID](../tests/fixtures/council-record-ids-2026-09.json) · [みらい議会](https://gikai.team-mir.ai/)

| 階層 | URL と使い方 |
| --- | --- |
| 市議会トップ | `gikai.html`。注目記事、テーマ、資料をまたぐ関連記事、質疑の例、日程、議会のしくみ |
| 記録の検索 | `gikai.html#records`。例 `#records?type=bill&theme=care&session=2026-09`。キーワードの部分一致は空白で区切った各語を同時に検索 |
| 個別記事 | `gikai.html#record/2026-09/bill-13`。会期IDと記事IDの組み合わせで特定 |

`#bill-13` 等の旧議案リンク、`#bills`、`#allBills`、`#schedule`、`#guide`、`#sources`、参照HTMLで使用した `#record=bill-13` の形式にも対応します。`council.html` の転送を引き継いでいます。ルートと資産は相対パスで参照します。

## 表示デザインの参照元

記録一覧のカードと年間日程・会期のタイムラインには、大規模改修直前の市議会ページで使っていたスタイルを再利用しています。注目記事の種別、日付、テーマ、詳細リンクの配置は、現行トップのサマリーカードに揃えています。記録一覧と注目記事は900px以上で3列、650px以上900px未満で2列、それより狭い幅で1列です。

記録一覧と個別記事の番号・審議結果・会期・テーマは `council-chip` の寸法に揃えます。正式名称と提出日は個別記事で確認できます。議案カードの賛成・反対は公式採決表の人数を使い、退席の記録がある場合は併記します。反対票があるときだけ反対ラベルを塗りつぶします。

## 照合した一次資料

確認日 **2026年11月18日**。同じテーマの関連記事には、制度上直接つながるものと、背景を調べる手がかりになるものがあります。

| 確認内容 | 確認先 |
| --- | --- |
| 市長提出議案24件の番号・件名・提出日、既存解説の根拠 | [9月定例会の提出議案一覧・議案本文・議案資料](https://www.city.abiko.chiba.jp/shisei/shigikai/teirei_rinji/r8dai3kai9gatsu/r8-9-gian.html)、[9月2日本会議](https://www.city.abiko.chiba.jp/shisei/shigikai/teirei_rinji/r8dai3kai9gatsu/R8_3kaigirokuzantei.files/R80902honkaigi.pdf#page=14) |
| 議案の可決・認定・同意、請願の採択、意見書の可決、議員別賛否 | [議員別採決結果（PDF）](https://www.city.abiko.chiba.jp/shisei/shigikai/teirei_rinji/r8dai3kai9gatsu/index.files/saiketsukekkaR8.9.pdf)、[9月29日本会議（暫定版）](https://www.city.abiko.chiba.jp/shisei/shigikai/teirei_rinji/r8dai3kai9gatsu/R8_3kaigirokuzantei.files/R80929honkaigi.pdf)、[議員名簿](https://www.city.abiko.chiba.jp/shisei/shigikai/giinmeibo/index.html) |
| 請願・陳情4件の件名と内容、意見書4件の件名・本文・提出先 | [請願・陳情一覧と文書表](https://www.city.abiko.chiba.jp/shisei/shigikai/teirei_rinji/r8dai3kai9gatsu/r8-3seiganchinjo.html)、[発議案資料（PDF）](https://www.city.abiko.chiba.jp/shisei/shigikai/teirei_rinji/r8dai3kai9gatsu/index.files/R8.9hatsugian1-4.pdf)、[提出した意見書](https://www.city.abiko.chiba.jp/shisei/shigikai/kaigi_unei/ikensyo.html) |
| 一般質問12人の氏名、日程、通告、記事に載せた発言と答弁 | [一般質問日程・要項](https://www.city.abiko.chiba.jp/shisei/shigikai/teirei_rinji/r8dai3kai9gatsu/r8-9ippanshitsumon.html)、[9月9日・10日・11日の本会議録（暫定版）](https://www.city.abiko.chiba.jp/shisei/shigikai/teirei_rinji/r8dai3kai9gatsu/R8_3kaigirokuzantei.html) |
| 介護保険補正予算、認定調査の質疑、給食費の公会計化、湖北台市民センターなど | [議案等委員会付託表](https://www.city.abiko.chiba.jp/shisei/shigikai/teirei_rinji/r8dai3kai9gatsu/r8-9giantoufutaku.html)、[9月15日総務企画常任委員会](https://www.city.abiko.chiba.jp/shisei/shigikai/teirei_rinji/r8dai3kai9gatsu/R8_3kaigirokuzantei.files/R80915soumukikaku.pdf#page=10)、[9月16日教育福祉常任委員会 p.23–26](https://www.city.abiko.chiba.jp/shisei/shigikai/teirei_rinji/r8dai3kai9gatsu/R8_3kaigirokuzantei.files/R80916kyouikufukusi.pdf#page=23)、[9月17日環境都市常任委員会](https://www.city.abiko.chiba.jp/shisei/shigikai/teirei_rinji/r8dai3kai9gatsu/R8_3kaigirokuzantei.files/R80917kankyoutosi.pdf) |
| 9月2日の市政一般報告8項目の正式見出し・説明 | [市政一般報告全文](https://www.city.abiko.chiba.jp/shisei/shiseihoushin/r8_ippan/20260902shiseiippan.html) |
| 9月会期日程と12月議会の招集予定 | [9月定例会・会期日程](https://www.city.abiko.chiba.jp/shisei/shigikai/teirei_rinji/r8dai3kai9gatsu/r8-3kaikinittei.html)、[12月定例会・11月18日の案内](https://www.city.abiko.chiba.jp/shisei/shigikai/teirei_rinji/r8dai4kai12gatsu/index.html)、[定例会・臨時会情報](https://www.city.abiko.chiba.jp/shisei/shigikai/teirei_rinji/index.html) |

- 提出議案一覧の見出しに「報告第19号」とある案件は、採決表・提案説明に従い「議案第19号」としました。第21・22号は本会議録で剰余金の処分の可決と決算の認定を確認しました。
- 陳情第11号では採決表の「退」を表示し、議会選出の監査委員であった早川真議員が採決に加わっていないとの公式注記を添えました。票を投じた人数は賛成・反対票の合計です。
- 記事の質疑は原資料の要約です。一般質問は12人全員について確認できたやりとりを掲載し、議案は委員会録で確認した箇所を掲載しました。全議員の発言、全論点・全討論の書き起こしは収録範囲外です。
- 11月18日時点で市が公開していた会議録PDFは暫定版です。市は正式版を11月25日に掲載予定と案内しています。正式版が出たら、該当箇所を再照合し、PDFのページ参照を更新してください。[会議録の掲載案内](https://www.city.abiko.chiba.jp/shisei/shigikai/teirei_rinji/r8dai3kai9gatsu/R8_3kaigirokuzantei.html)

## 次の会期を追加する

1. `assets/data/data-YYYY-MM.json` を作り、`meta` に会期ID、名称、会期、状態、確認日、収録件数を入力します。最初に割り当てた会期IDと記事IDは維持します。同じ月に複数の会期がある場合は、会期IDに `2027-03-extra-1` のような識別子を付けます。
2. `sources` に原資料を登録します。会議録には `edition`（`provisional` または `final`）、`date`、`venue` を入れます。記事と質疑は `id` で原資料を参照し、PDFの該当ページは `page` と必要に応じて `endPage` に物理ページ番号を記録します。
3. `records` に正式名称、見出し、リード、種別、日付、テーマ、状態、本文、根拠資料を登録します。質疑は `exchanges` に議員名、質問、答弁した役職、答弁、発言の根拠を組で入れます。答弁を確認できないときは `answer` を空にします。委員会での意見や討論の要約は `remarks` に発言者・立場・根拠を記録します。関連記録の `related` は記事ID、会期をまたぐ場合は `会期ID/記事ID` の形式です。
4. 公式の議員別採決があれば、当時の `members` と各案件の `voting` を入力します。既定の区分に当たらない議員を `exceptions` に列挙します。議長、欠席、退席を含め、公式表の対象と投票数を確認します。
5. `assets/data/council-sessions.json` の `sessions` に会期ファイルを追加します。ピックアップと検索には、新しい会期の記録も自動的に加わります。次回予定は `nextMeeting`、年間の定例会は `yearMeetings`、臨時会がある場合は `extraMeetings` に記録します。会期の終わりが公表されていれば `end`、詳細日程を収録済みなら `session` に会期IDを記録します。公式資料の確認日は `yearMeetingsCheckedOn` に記録します。招集・審議・採決は公式発表に基づき更新します。予定が未公表の場合は `nextMeeting` を `null` にすると公式案内へのリンクが表示されます。
6. 表示用の通常スクリプトを生成し、元のJSONと一緒にコミットします。GitHub Pagesで動作する静的構成なので、閲覧時のビルドや外部APIは不要です。

```bash
python3 scripts/sync_council_data.py
python3 scripts/sync_council_data.py --check
python3 tests/check_integrity.py
python3 tests/check_council_data.py
python3 tests/council_browser.py --baseline ../abiko-baseline
```

画面比較は `python3 tests/visual_regression.py --baseline ../abiko-baseline` で実行できます。改修前のコミットを比較元に使う場合、`gikai.html` とその転送先を表示する `council.html` に意図した差が出ます。確認結果をPRに記録し、運営者の承認を得てから公開します。

## ピックアップ・写真・図解

- ピックアップは読み込み時に全記録の順序をシャッフルし、最初の15件の中にできるだけ多くの種別と会期が入るようにします。テーマの切り替えと15件ずつの追加表示にも同じ順序を使います。詳細検索と個別記事は同じ会期別JSONを読みます。
- 写真は [写真台帳](../assets/data/photo-sources.json) で管理します。個別の写真は `council.byRecord` に `会期ID/記事ID` をキーとして指定します。指定がなければ、記事のテーマ順で最初に対応する `council.byTheme` の写真を使います。カード本文の下にある「写真はイメージです」から撮影者とライセンスを確認できます。[写真の更新方法](DATA_POLICY.md#写真の管理)
- 見出し横の9月定例会一覧と会期内の縦の日程表示は、コミット `31e03a5` を参照しました。会期名・種別ごとの件数・検索リンクは `legacySession` の会期データから直接生成します。
- 年間日程には会期別の開催日、状況、資料へのリンクを掲載します。2026年11月19日に公式資料を確認しました。[3月日程](https://www.city.abiko.chiba.jp/shisei/shigikai/teirei_rinji/r8dai1kai3gatsu/r8-3kaikinittei.html) · [6月日程](https://www.city.abiko.chiba.jp/shisei/shigikai/teirei_rinji/r8dai2kai6gatsu/r8-2kaikinittei.html) · [9月日程](https://www.city.abiko.chiba.jp/shisei/shigikai/teirei_rinji/r8dai3kai9gatsu/r8-3kaikinittei.html) · [12月の開会予定](https://www.city.abiko.chiba.jp/shisei/shigikai/teirei_rinji/r8dai4kai12gatsu/index.html) · [第1回臨時会](https://www.city.abiko.chiba.jp/shisei/shigikai/teirei_rinji/r8dai1kai_rinji/index.html)
- 「市議会のしくみ」の関係図・手順図・年間図・記録の比較はHTMLで編集できます。変更時に参照する我孫子市の公式資料と、図解を作る際に比較した国内外9件は調査記録にまとめています。[図解の調査記録](COUNCIL_GUIDE_RESEARCH.md)
