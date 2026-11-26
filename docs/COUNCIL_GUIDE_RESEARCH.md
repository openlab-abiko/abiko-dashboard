# 市議会のしくみを図解するための調査

2026年11月19日に公開資料を確認しました。初心者への伝わり方とスマートフォンでの読みやすさは、図・文章の構成と公開HTMLの表示指定に基づく評価です。

| 先行例と運営主体 | 図解の内容・構成 | 初心者・小さい画面での見やすさ | 我孫子で採用した考え方 |
| --- | --- | --- | --- |
| 我孫子市議会 [市議会の会議と運営](https://www.city.abiko.chiba.jp/shisei/shigikai/kaigi_unei/kaigi_unei.html) | 本会議と委員会を流れ図で整理し、それぞれの役割を本文で補足 | 会議の種類を追いやすい。一枚の画像は幅が狭くなると図中の文字も縮む | 会議の種類をステップごとに示し、解説テキストはHTMLで表示 |
| 横浜市会 [市会と市長](https://www.city.yokohama.lg.jp/shikai/shikumi/shigoto/shikumi12.html) | 市会と市長の異なる役割と、市民との関係を一枚の図にまとめる | 役割を一度に見渡せる。横並びの文字がスマートフォンでは小さくなりやすい | 選挙を起点に二方向へ分け、市役所の仕事を市長側の下に示す |
| 札幌市議会 [なるほどギカイ・会議の流れ](https://www.city.sapporo.jp/ncms/gikai/naruhodo/structure/flow.html) | 本会議・委員会・本会議の場面を順番に紹介し、写真と振り仮名を添える | 一段ずつ読めて、用語を思い出しやすい。縦に追える構成は狭い画面でも理解しやすい | 簡潔な動詞と番号で工程を示し、狭い画面では上から下へ並べる |
| 名古屋市 [市会ってなんだろう?](https://www.city.nagoya.jp/kids/learning/1026847/1026848.html) | 公園を例に、市民の希望から話し合い、工事・完成までを場面ごとに絵と文章で紹介 | 生活の中で市会の役割を想像しやすい。各絵と短い説明が縦に続く | 「案を出す」「調べる」「決める」のように、先にすることを示す |
| 千葉市議会 [キッズページ](https://www.city.chiba.jp/shigikai/kids.html) | 市長と市議会、本会議と委員会などを質問ごとの章に分け、イラストを添える | 知りたい疑問から読める。説明がHTMLなので文字拡大でも読みやすい | 4つの図を目次から選べるようにし、詳しい質問は後段で読める構成 |
| 英国議会 [How does a bill become a law?](https://www.parliament.uk/making-laws/) | 法案が始まる院ごとに手順をたどる案内。最初に法案の定義を説明 | 読む経路が明確。主要な説明と進む先が通常のテキストとリンクで示される | 工程に入る前に「議案」を説明し、委員会付託の例外を工程のそばに置く |
| オーストラリア議会教育局 [Making a law](https://peo.gov.au/understand-our-parliament/how-parliament-works/bills-and-laws/making-a-law) | 法案から法律になる順序を短い映像と書き起こしで説明 | 順番を動きでつかめる。画面が狭い場合や映像を再生しない場合も書き起こしから追える | 矢印と番号だけを穏やかに順次強調し、本文は常に読める状態にする |
| ニュージーランド議会 [How a bill becomes law](https://www3.parliament.nz/en/visit-and-learn/resources-about-new-zealand-parliament/resources-about-parliament/how-a-bill-becomes-law/) | 中央の手順に公共からの働きかけと、閲覧できる資料を左右の列で対応させたポスター | 参加の入口と手順を見比べやすい。三列のPDFはスマートフォンで拡大が必要になりやすい | 請願・陳情や一般質問を議決の手順と区別し、誰がどう関わるかを並べて示す |
| ニューヨーク市議会 [Legislation](https://council.nyc.gov/legislation/) | 提出、公聴会、採決などを番号付きの段階として縦に説明 | 現在の段階を見失いにくい。縦に続く短い見出しが狭い画面でも読める | 全体の工程を5段階にし、各段階に短い説明を置く |

## 制度の確認

- 選挙で選ばれる市議会と市長の関係、本会議と委員会、年4回の定例会、当初予算・決算の特別委員会は我孫子市の説明に合わせました。[市議会の会議と運営](https://www.city.abiko.chiba.jp/shisei/shigikai/kaigi_unei/kaigi_unei.html)
- 議決・検査・意見書の根拠は地方自治法第96条・第98条・第99条です。議員による議案提出は第112条の要件に従い、予算の提出は市長が担います。請願には第124条に基づく紹介議員が必要です。[地方自治法](https://laws.e-gov.go.jp/law/322AC0000000067)
- 陳情の扱いは提出方法や提出者と市の関係で異なるため、仕組みの図から受付条件へ案内します。[請願・陳情の提出方法](https://www.city.abiko.chiba.jp/shisei/shigikai/shimin_shigikai.html)
