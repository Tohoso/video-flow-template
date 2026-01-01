# Video Flow Template - Claude Code 設定

このプロジェクトは、Claude Codeを使って台本テキストから動画を自動生成するためのRemotionプロジェクトです。

**参考**: [ふためん氏の動画編集AI自動化tips](https://tips.jp/share/preview/a/DcHmetX1zT1KThVs)

## プロジェクト概要

- **目的**: 台本テキストから動画を自動生成
- **技術スタック**: Remotion, TypeScript, React
- **外部サービス**: fishaudio（音声合成）, HEYGEN（AIアバター）

## フォルダ構成

```
audio/      -- 音声データ（fishaudioで生成したナレーション）
avatar/     -- 動画素材（HEYGENで生成したAIアバター）
bgm/        -- BGM
images/     -- 画像・イラスト
output/     -- 完成動画
scripts/    -- スクリプトJSON
src/        -- Remotionソースコード
```

## トリガーキーワード

以下のキーワードで動画生成を開始します：

### 「YouTube風に編集して」

横動画（16:9, 1920x1080）を生成します。
素材を確認した後、動画編集を実行し、MP4で書き出します。

### 「ショート動画を作って」

縦動画（9:16, 1080x1920）を生成します。
TikTok/YouTube Shorts向けの短尺動画を作成します。

### 「プレゼン動画を作って」

プレゼンテーション風の動画を生成します。
スライド形式で整理された情報を表示します。

### 「全部やっとけ」

台本の内容から最適なテンプレートを自動判定して生成します。

## サブエージェント

動画編集の作業を分担するサブエージェントを使用します。
各担当ごとに専門のエージェントが作業を行い、編集の精度を高めます。

### スクリプト分析担当

台本を読んで構成を決めます。
- シーンの分割
- 各シーンの長さ
- 全体の流れ

コマンド: `/script-analyze`

### カット担当

カットのタイミングや間の取り方を決めます。
- シーン間のトランジション
- テンポの調整
- 間の演出

コマンド: `/cut-timing`

### 音声担当

音声ファイルの分析、タイミング調整を行います。
- fishaudioで生成した音声の配置
- 音声の長さに合わせたシーン調整
- 音量の正規化

コマンド: `/audio-manage`

### テロップ担当

テロップの生成とタイミング調整を行います。
- 字幕テキストの生成
- 表示タイミングの計算
- スタイルの決定

コマンド: `/subtitle-generate`

### 映像担当

アバターや画像の配置を行います。
- HEYGENで生成したアバターの配置
- 画像素材の配置
- アニメーション効果

コマンド: `/visual-compose`

### BGM担当

BGMの選定と音量調整を行います。
- BGMの選択
- 音量バランスの調整
- フェードイン/アウト

コマンド: `/bgm-manage`

## 動画生成の流れ

1. **素材確認**: audio/, avatar/, bgm/, images/ の素材を確認
2. **スクリプト分析**: 台本を解析してシーン構成を決定
3. **各担当の処理**: サブエージェントが並列で処理
4. **統合**: 全ての出力を統合してスクリプトJSONを生成
5. **レンダリング**: Remotionで動画をレンダリング
6. **出力**: output/ に完成動画を書き出し

## 外部サービス連携

### fishaudio（音声合成）

台本テキストからナレーション音声を生成します。

```bash
# 環境変数
FISHAUDIO_API_KEY=your_api_key

# 出力先
audio/narration.mp3
```

使い方:
1. [fishaudio](https://fish.audio/) でアカウント作成
2. 台本テキストを入力して音声を生成
3. 生成した音声を `audio/` に配置

### HEYGEN（AIアバター）

AIアバターの動画を生成します。

```bash
# 環境変数
HEYGEN_API_KEY=your_api_key

# 出力先
avatar/presenter.mp4
```

使い方:
1. [HEYGEN](https://www.heygen.com/) でアカウント作成
2. アバターと台本を設定して動画を生成
3. 生成した動画を `avatar/` に配置

## コマンド

### プレビュー

```bash
npx remotion studio
```

### レンダリング

```bash
npx remotion render src/index.ts Main output/video.mp4
```

### 特定のテンプレートでレンダリング

```bash
# YouTube風
npx remotion render src/index.ts YouTubeStyle output/youtube.mp4

# ショート動画風
npx remotion render src/index.ts ShortStyle output/short.mp4

# プレゼン風
npx remotion render src/index.ts PresentationStyle output/presentation.mp4
```

## 動画テンプレート

### YouTubeStyle（16:9）
- 解像度: 1920x1080
- FPS: 30
- テロップ位置: 画面下部中央
- テーマテロップ: 左上
- BGM音量: -20dB

### ShortStyle（9:16）
- 解像度: 1080x1920
- FPS: 30
- テロップ位置: 画面中央
- 大きめのフォント
- BGM音量: -15dB

### PresentationStyle（16:9）
- 解像度: 1920x1080
- FPS: 30
- テロップ位置: 画面下部
- スライド風の背景
- BGM音量: -25dB

## スクリプトJSON形式

動画生成に使用するJSONの形式：

```json
{
  "meta": {
    "title": "動画タイトル",
    "template": "youtube",
    "fps": 30,
    "width": 1920,
    "height": 1080
  },
  "audio": {
    "narration": "audio/narration.mp3",
    "bgm": "bgm/background.mp3",
    "bgmVolume": 0.3
  },
  "avatar": {
    "video": "avatar/presenter.mp4",
    "position": "left",
    "size": 0.3
  },
  "scenes": [
    {
      "id": "scene-1",
      "duration": 5,
      "narration": "こんにちは",
      "subtitle": "こんにちは",
      "visual": {
        "type": "image",
        "src": "images/slide1.png"
      },
      "transition": {
        "type": "fade",
        "duration": 0.5
      }
    }
  ]
}
```

## 修正の伝え方

動画の調整は日本語で伝えてください：

- 「テロップの文字をもっと大きくして」
- 「アバターの位置を左下に変えて」
- 「BGMの音量をもう少し下げて」
- 「シーン2の長さを3秒にして」

## エラー処理

エラーが発生した場合は、以下の手順で自動修正を行う：

1. エラーメッセージを確認
2. 原因を特定（どのエージェントの出力に問題があるか）
3. 該当エージェントの出力を修正
4. 再度統合を実行
5. エラーがなくなるまで繰り返す

**重要**: エラー修正時にユーザーへの確認は不要。自動で修正を繰り返すこと。

## 注意事項

- 素材は事前に audio/, avatar/, bgm/, images/ に配置してください
- fishaudio と HEYGEN の API キーは環境変数で設定してください
- レンダリング時間はPCスペックに依存します（目安: 5秒動画で約20秒）
- 出力動画は output/ ディレクトリに保存されます
- 音声ファイルは MP3 または WAV 形式
- 画像ファイルは PNG または JPG 形式
- 動画ファイルは MP4 形式
