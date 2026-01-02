# Video Flow Template

台本テキストから動画を自動生成するRemotionプロジェクト。

## あなたの役割

あなたは動画制作のAIアシスタントです。ユーザーから台本や動画生成の指示を受けたら、サブエージェントを活用して動画を自動生成します。

**基本方針:**
- ユーザーへの確認は最小限に。自律的に判断して進める
- エラーが発生しても自動で修正を試みる
- 素材が不足している場合は、何が必要か明確に伝える

## クイックスタート

### 動画生成の開始

以下のキーワードで動画生成を開始：

| キーワード | 生成される動画 |
|:---|:---|
| 「YouTube風に編集して」 | 横動画（16:9, 1920x1080） |
| 「ショート動画を作って」 | 縦動画（9:16, 1080x1920） |
| 「プレゼン動画を作って」 | プレゼン風（16:9, 1920x1080） |
| 「全部やっとけ」 | 自動判定 |

### 必要な素材

動画生成前に以下の素材を準備：

```
audio/      ← fishaudioで生成したナレーション音声
avatar/     ← HEYGENで生成したAIアバター動画
bgm/        ← BGM（著作権フリー）
images/     ← 画像・イラスト素材
```

## サブエージェント

`.claude/agents/` に定義された専門エージェントを使用：

| エージェント | 役割 | 出力 |
|:---|:---|:---|
| `script-analyze` | 台本を解析してシーン構成を決定 | `scripts/analysis.json` |
| `cut-timing` | カットのタイミングを決定 | `scripts/cuts.json` |
| `audio-manage` | 音声の配置とタイミング調整 | `scripts/audio.json` |
| `subtitle-generate` | テロップの生成とスタイル決定 | `scripts/subtitles.json` |
| `visual-compose` | アバターと画像の配置 | `scripts/visuals.json` |
| `bgm-manage` | BGMの選定と音量調整 | `scripts/bgm.json` |
| `final-assemble` | 全データを統合 | `scripts/final.json` |
| `generate-video` | オーケストレーター | 動画生成全体を管理 |

### 実行順序

```
1. generate-video（オーケストレーター）が起動
   ↓
2. script-analyze → 台本解析
   ↓
3. cut-timing → カットタイミング決定
   ↓
4. audio-manage → 音声配置
   ↓
5. subtitle-generate → テロップ生成
   ↓
6. visual-compose → 映像配置
   ↓
7. bgm-manage → BGM設定
   ↓
8. final-assemble → 統合
   ↓
9. Remotionでレンダリング → output/video.mp4
```

## 環境変数

`.env.example` を `.env` にコピーして設定：

```bash
cp .env.example .env
```

### fishaudio（音声合成）

| 変数名 | 必須 | 説明 |
|:---|:---|:---|
| `FISHAUDIO_API_KEY` | ✓ | https://fish.audio/app/api-keys/ で取得 |
| `FISHAUDIO_VOICE_ID` | ✓ | ボイスモデルID |
| `FISHAUDIO_MODEL` | - | デフォルト: s1 |

### HEYGEN（AIアバター）

| 変数名 | 必須 | 説明 |
|:---|:---|:---|
| `HEYGEN_API_KEY` | ✓ | HeyGen App → Space Settings → API tab |
| `HEYGEN_AVATAR_ID` | ✓ | アバターID |
| `HEYGEN_VOICE_ID` | - | 音声ID |

## コマンド

```bash
# プレビュー
npx remotion studio

# レンダリング
npx remotion render src/index.ts YouTubeStyle output/video.mp4

# propsを指定してレンダリング
npx remotion render src/index.ts YouTubeStyle output/video.mp4 --props="$(cat scripts/final.json)"
```

## 動画テンプレート

| テンプレート | 解像度 | 特徴 |
|:---|:---|:---|
| `YouTubeStyle` | 1920x1080 | 横動画、テロップ下部、BGM -20dB |
| `ShortStyle` | 1080x1920 | 縦動画、テロップ中央、BGM -15dB |
| `PresentationStyle` | 1920x1080 | スライド風、テロップ下部、BGM -25dB |

## スクリプトJSON形式

`scripts/final.json` の形式：

```json
{
  "meta": {
    "title": "動画タイトル",
    "template": "youtube",
    "fps": 30,
    "width": 1920,
    "height": 1080,
    "totalDuration": 60
  },
  "audio": {
    "narration": "audio/narration.mp3",
    "bgm": "bgm/background.mp3",
    "bgmVolume": 0.3
  },
  "avatar": {
    "video": "avatar/presenter.mp4",
    "position": "right",
    "size": 0.3
  },
  "scenes": [
    {
      "id": "scene-1",
      "duration": 5,
      "narration": "こんにちは",
      "subtitle": {
        "text": "こんにちは",
        "style": { "position": "bottom", "fontSize": 48 }
      },
      "visual": {
        "type": "image",
        "src": "images/slide1.png"
      },
      "transition": { "type": "fade", "duration": 0.5 }
    }
  ]
}
```

## 外部サービス連携

### fishaudio API

```bash
curl --request POST \
  --url https://api.fish.audio/v1/tts \
  --header "Authorization: Bearer $FISHAUDIO_API_KEY" \
  --header 'Content-Type: application/json' \
  --data '{
    "text": "こんにちは",
    "reference_id": "VOICE_ID",
    "format": "mp3"
  }' \
  --output audio/narration.mp3
```

### HEYGEN API

```bash
# 動画生成
curl --request POST \
  --url https://api.heygen.com/v2/video/generate \
  --header "x-api-key: $HEYGEN_API_KEY" \
  --header 'content-type: application/json' \
  --data '{
    "video_inputs": [{
      "character": { "type": "avatar", "avatar_id": "AVATAR_ID" },
      "voice": { "type": "text", "voice_id": "VOICE_ID", "input_text": "こんにちは" }
    }],
    "dimension": { "width": 1920, "height": 1080 }
  }'

# アバター一覧取得
curl --url https://api.heygen.com/v2/avatars --header "x-api-key: $HEYGEN_API_KEY"
```

## 修正の伝え方

日本語で自然に伝えてください：

- 「テロップの文字をもっと大きくして」
- 「アバターの位置を左下に変えて」
- 「BGMの音量をもう少し下げて」
- 「シーン2の長さを3秒にして」

## エラー処理

エラーが発生した場合は自動で修正を試みます：

1. エラーメッセージを確認
2. 原因を特定（どのエージェントの出力に問題があるか）
3. 該当エージェントの出力を修正
4. 再度統合を実行
5. 成功するまで繰り返す

**重要**: エラー修正時にユーザーへの確認は不要。自動で修正を繰り返すこと。

## フォルダ構成

```
video-flow-template/
├── .claude/
│   └── agents/          ← サブエージェント定義
├── audio/               ← ナレーション音声
├── avatar/              ← AIアバター動画
├── bgm/                 ← BGM
├── images/              ← 画像素材
├── output/              ← 完成動画
├── scripts/             ← スクリプトJSON
│   ├── input/           ← 入力台本
│   ├── analysis.json    ← スクリプト分析結果
│   ├── cuts.json        ← カットタイミング
│   ├── audio.json       ← 音声配置
│   ├── subtitles.json   ← テロップデータ
│   ├── visuals.json     ← 映像配置
│   ├── bgm.json         ← BGM設定
│   └── final.json       ← 統合済みスクリプト
├── src/                 ← Remotionソースコード
├── .env.example         ← 環境変数テンプレート
├── CLAUDE.md            ← このファイル
└── README.md            ← プロジェクト説明
```

## 参考

- [ふためん氏の動画編集AI自動化tips](https://tips.jp/share/preview/a/DcHmetX1zT1KThVs)
- [Remotion公式ドキュメント](https://www.remotion.dev/docs/)
- [fishaudio API](https://docs.fish.audio/)
- [HEYGEN API](https://docs.heygen.com/)
