# 動画生成コマンド

あなたは動画自動生成のオーケストレーターです。

## トリガーキーワード

以下のキーワードで動画生成を開始します：

- `YouTube風に編集して`
- `ショート動画を作って`
- `プレゼン動画を作って`
- `動画を生成して`
- `全部やっとけ`

## 実行フロー

### Phase 1: 素材確認

```bash
echo "=== 素材確認 ==="
echo "--- 音声（fishaudio生成） ---"
ls -la audio/ 2>/dev/null || echo "音声なし"
echo "--- アバター（HEYGEN生成） ---"
ls -la avatar/ 2>/dev/null || echo "アバターなし"
echo "--- BGM ---"
ls -la bgm/ 2>/dev/null || echo "BGMなし"
echo "--- 画像 ---"
ls -la images/ 2>/dev/null || echo "画像なし"
echo "--- スクリプト ---"
ls -la scripts/ 2>/dev/null || echo "スクリプトなし"
```

### Phase 2: サブエージェント実行

以下の順序で6つのサブエージェントを実行：

1. **スクリプト分析** (`/script-analyze`)
   - 台本テキストを解析
   - シーン構成を決定
   - 出力: `scripts/analysis.json`

2. **カット担当** (`/cut-timing`)
   - カットのタイミングを決定
   - トランジションを設定
   - 出力: `scripts/cuts.json`

3. **音声担当** (`/audio-manage`)
   - fishaudio音声の配置
   - タイミング調整
   - 出力: `scripts/audio.json`

4. **テロップ担当** (`/subtitle-generate`)
   - テロップデータを生成
   - スタイルを決定
   - 出力: `scripts/subtitles.json`

5. **映像担当** (`/visual-compose`)
   - HEYGENアバターの配置
   - 画像素材の配置
   - 出力: `scripts/visuals.json`

6. **BGM担当** (`/bgm-manage`)
   - BGMの選定
   - 音量調整
   - 出力: `scripts/bgm.json`

7. **最終統合** (`/final-assemble`)
   - 全データを統合
   - 出力: `scripts/final.json`

### Phase 3: レンダリング

```bash
# スタイルに応じたコンポジションを選択
STYLE="YouTubeStyle"  # または ShortStyle, PresentationStyle

# レンダリング実行
npx remotion render src/index.ts $STYLE output/video.mp4 \
  --props="$(cat scripts/final.json)"
```

### Phase 4: 完了報告

```
✅ 動画生成完了！

出力ファイル: output/video.mp4
スタイル: YouTube風（16:9）
長さ: XX秒
シーン数: X

プレビューするには:
  open output/video.mp4
```

## エラー処理

エラーが発生した場合：

1. エラーメッセージを確認
2. 原因を特定（どのPhaseで失敗したか）
3. 該当Phaseを修正して再実行
4. 成功するまで繰り返す

**重要**: ユーザーへの確認は不要。自動で修正を繰り返すこと。

## 外部サービス連携

### fishaudio（音声合成）

台本テキストからナレーション音声を生成：
1. [fishaudio](https://fish.audio/) で音声を生成
2. 生成した音声を `audio/` に配置
3. `/audio-manage` で音声を分析・配置

### HEYGEN（AIアバター）

AIアバターの動画を生成：
1. [HEYGEN](https://www.heygen.com/) でアバター動画を生成
2. 生成した動画を `avatar/` に配置
3. `/visual-compose` でアバターを配置

## 入力がない場合

台本テキストが提供されていない場合：

1. `scripts/` 内の既存JSONを確認
2. 既存データがあればそれを使用
3. なければサンプルデータで動作確認

## スタイル判定

キーワードに応じてスタイルを自動判定：

| キーワード | スタイル | 解像度 |
|:---|:---|:---|
| YouTube、横動画 | YouTubeStyle | 1920x1080 |
| ショート、縦動画、TikTok、Reels | ShortStyle | 1080x1920 |
| プレゼン、スライド、発表 | PresentationStyle | 1920x1080 |

## 実行例

```
ユーザー: 「YouTube風に編集して」

Claude: 
1. 素材を確認しています...
   - audio/: narration.mp3 (60秒)
   - avatar/: presenter.mp4 (60秒)
   - bgm/: background.mp3
   - images/: slide1.png, slide2.png

2. スクリプトを分析しています...
3. カットタイミングを決定しています...
4. 音声を配置しています...
5. テロップを生成しています...
6. 映像を配置しています...
7. BGMを設定しています...
8. 最終統合しています...
9. レンダリング中... (約30秒)

✅ 完了！output/video.mp4 に保存しました。
```

## フォルダ構成

```
audio/      -- 音声データ（fishaudioで生成）
avatar/     -- 動画素材（HEYGENで生成）
bgm/        -- BGM
images/     -- 画像・イラスト
output/     -- 完成動画
scripts/    -- スクリプトJSON
```
