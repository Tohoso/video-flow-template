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
echo "--- 画像 ---"
ls -la public/images/ 2>/dev/null || echo "画像なし"
echo "--- アバター ---"
ls -la public/avatar/ 2>/dev/null || echo "アバターなし"
echo "--- BGM ---"
ls -la public/bgm/ 2>/dev/null || echo "BGMなし"
echo "--- 音声 ---"
ls -la public/audio/ 2>/dev/null || echo "音声なし"
echo "--- スクリプト ---"
ls -la scripts/input/ 2>/dev/null || echo "スクリプトなし"
```

### Phase 2: サブエージェント実行

以下の順序でサブエージェントを実行：

1. **スクリプト分析** (`/script-analyze`)
   - 台本テキストを解析
   - 出力: `scripts/input/analysis.json`

2. **テロップ生成** (`/subtitle-generate`)
   - テロップデータを生成
   - 出力: `scripts/input/subtitles.json`

3. **映像配置** (`/visual-compose`)
   - 映像構成を決定
   - 出力: `scripts/input/visuals.json`

4. **音声管理** (`/audio-manage`)
   - 音声ミキシングを設定
   - 出力: `scripts/input/audio.json`

5. **最終統合** (`/final-assemble`)
   - 全データを統合
   - 出力: `scripts/input/final.json`

### Phase 3: レンダリング

```bash
# スタイルに応じたコンポジションを選択
STYLE="YouTubeStyle"  # または ShortStyle, PresentationStyle

# レンダリング実行
npx remotion render src/index.ts $STYLE out/output.mp4 \
  --props="$(cat scripts/input/final.json)"
```

### Phase 4: 完了報告

```
✅ 動画生成完了！

出力ファイル: out/output.mp4
スタイル: YouTube風（16:9）
長さ: XX秒
シーン数: X

プレビューするには:
  open out/output.mp4
```

## エラー処理

エラーが発生した場合：

1. エラーメッセージを確認
2. 原因を特定（どのPhaseで失敗したか）
3. 該当Phaseを修正して再実行
4. 成功するまで繰り返す

**重要**: ユーザーへの確認は不要。自動で修正を繰り返すこと。

## 入力がない場合

台本テキストが提供されていない場合：

1. `scripts/input/` 内の既存JSONを確認
2. 既存データがあればそれを使用
3. なければサンプルデータで動作確認

## スタイル判定

キーワードに応じてスタイルを自動判定：

| キーワード | スタイル |
|:---|:---|
| YouTube、横動画 | YouTubeStyle |
| ショート、縦動画、TikTok、Reels | ShortStyle |
| プレゼン、スライド、発表 | PresentationStyle |

## 実行例

```
ユーザー: 「YouTube風に編集して」

Claude: 
1. 素材を確認しています...
2. スクリプトを分析しています...
3. テロップを生成しています...
4. 映像を配置しています...
5. 音声を設定しています...
6. 最終統合しています...
7. レンダリング中... (約30秒)

✅ 完了！out/output.mp4 に保存しました。
```
