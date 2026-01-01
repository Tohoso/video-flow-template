# Video Flow Template

Remotion + Claude Code による動画自動生成テンプレート

## 概要

このテンプレートは、Claude Code（またはAntigravity）を使って、台本テキストから自動的に動画を生成するためのプロジェクトです。

**参考**: [ふためん氏の動画編集AI自動化tips](https://tips.jp/share/preview/a/DcHmetX1zT1KThVs)

## 特徴

- **1分で動画1本**: 素材を入れ替えるだけで量産可能
- **サブエージェント**: 役割ごとに専門AIが分担
- **トリガーキーワード**: 「YouTube風に編集して」で自動実行

## フォルダ構成

```
video-flow-template/
├── audio/              -- 音声データ（fishaudioで生成）
├── avatar/             -- 動画素材（HEYGENで生成）
├── bgm/                -- BGM
├── images/             -- 画像・イラスト
├── output/             -- 完成動画
├── scripts/            -- スクリプトJSON
│   └── input/          -- 入力用スクリプト
├── src/                -- Remotionソースコード
│   ├── compositions/   -- 動画テンプレート
│   ├── components/     -- UIコンポーネント
│   └── utils/          -- ユーティリティ
├── .claude/            -- Claude Code設定
│   └── commands/       -- サブエージェントコマンド
├── .env.example        -- 環境変数テンプレート
├── CLAUDE.md           -- Claude Code用設定
└── prompts/            -- プロンプトテンプレート
```

## 使用するAIサービス

| サービス | 用途 | 出力先 |
|:---|:---|:---|
| **fishaudio** | 合成音声（ナレーション） | `audio/` |
| **HEYGEN** | AIアバター（人物映像） | `avatar/` |
| **Remotion** | 動画編集・合成 | `output/` |

## セットアップ

### 1. 環境変数の設定

```bash
# .env.example を .env にコピー
cp .env.example .env

# .env を編集して各APIキーを設定
```

### 2. 必要なAPIキーの取得

#### fishaudio（音声合成）

| 変数名 | 説明 | 取得方法 |
|:---|:---|:---|
| `FISHAUDIO_API_KEY` | APIキー | [fish.audio/app/api-keys](https://fish.audio/app/api-keys/) で生成 |
| `FISHAUDIO_VOICE_ID` | ボイスモデルID | [fish.audio](https://fish.audio/) でボイスを選択し、URLからIDを取得 |
| `FISHAUDIO_MODEL` | 使用モデル | `s1`（推奨）、`speech-1.6`、`speech-1.5` |

**ボイスIDの取得方法:**
1. [fish.audio](https://fish.audio/) にアクセス
2. 使用したいボイスを選択
3. URLの `https://fish.audio/model/xxx-xxx-xxx` の `xxx-xxx-xxx` 部分がボイスID

#### HEYGEN（AIアバター）

| 変数名 | 説明 | 取得方法 |
|:---|:---|:---|
| `HEYGEN_API_KEY` | APIキー | HeyGen App → Space Settings → API tab |
| `HEYGEN_AVATAR_ID` | アバターID | API経由またはHeyGen Appで確認 |
| `HEYGEN_VOICE_ID` | 音声ID（オプション） | API経由で取得 |

**アバターID/音声IDの取得方法:**

```bash
# アバター一覧を取得
curl --request GET \
  --url https://api.heygen.com/v2/avatars \
  --header 'accept: application/json' \
  --header 'x-api-key: YOUR_API_KEY'

# 音声一覧を取得
curl --request GET \
  --url https://api.heygen.com/v2/voices \
  --header 'accept: application/json' \
  --header 'x-api-key: YOUR_API_KEY'
```

### 3. 依存関係のインストール

```bash
npm install
```

## クイックスタート

### 1. 素材を準備

```bash
# 音声（fishaudioで生成）
audio/narration.mp3

# アバター（HEYGENで生成）
avatar/presenter.mp4

# BGM
bgm/background.mp3

# 画像
images/slide1.png
images/slide2.png
```

### 2. Claude Codeを起動

```bash
claude
```

### 3. トリガーキーワードで動画生成

```
YouTube風に編集して

タイトル: AIの基礎知識

台本:
こんにちは、今日はAIについて解説します。
まず、AIとは人工知能のことです。
最近では様々な分野で活用されています。
```

### 4. 完成動画を確認
```bash
ls output/
# output.mp4
```

## トリガーキーワード

| キーワード | 動作 |
|:---|:---|
| `YouTube風に編集して` | 横動画（16:9）を生成 |
| `ショート動画を作って` | 縦動画（9:16）を生成 |
| `プレゼン動画を作って` | プレゼン風動画を生成 |
| `全部やっとけ` | 自動判定して生成 |

## サブエージェント

役割ごとに専門のAIが分担して作業します：

| エージェント | 役割 |
|:---|:---|
| スクリプト分析 | 台本を読んで構成を決める |
| カット担当 | カットのタイミングや間の取り方を決める |
| 音声担当 | 音声ファイルの分析、タイミング調整 |
| テロップ担当 | テロップの生成とタイミング調整 |
| 映像担当 | アバターや画像の配置 |
| BGM担当 | BGMの選定と音量調整 |

## API使用例

### fishaudio で音声生成

```bash
curl --request POST \
  --url https://api.fish.audio/v1/tts \
  --header 'Authorization: Bearer YOUR_API_KEY' \
  --header 'Content-Type: application/json' \
  --header 'model: s1' \
  --data '{
    "text": "こんにちは、今日はAIについて解説します。",
    "reference_id": "YOUR_VOICE_ID",
    "format": "mp3"
  }' \
  --output audio/narration.mp3
```

### HEYGEN でアバター動画生成

```bash
curl --request POST \
  --url https://api.heygen.com/v2/video/generate \
  --header 'accept: application/json' \
  --header 'content-type: application/json' \
  --header 'x-api-key: YOUR_API_KEY' \
  --data '{
    "video_inputs": [{
      "character": {
        "type": "avatar",
        "avatar_id": "YOUR_AVATAR_ID"
      },
      "voice": {
        "type": "text",
        "voice_id": "YOUR_VOICE_ID",
        "input_text": "こんにちは、今日はAIについて解説します。"
      }
    }],
    "dimension": {
      "width": 1920,
      "height": 1080
    }
  }'
```

## 開発

### プレビュー

```bash
npx remotion studio
```

### レンダリング

```bash
npx remotion render src/index.ts Main out/output.mp4
```

## テンプレート

### YouTube風 (16:9)

- 解像度: 1920x1080
- 情報量多め、テキスト中心
- 下部テロップ

### ショート動画風 (9:16)

- 解像度: 1080x1920
- インパクト重視、大きな文字
- 中央テロップ

### プレゼンテーション風 (16:9)

- 解像度: 1920x1080
- 整理された情報、スライド形式
- ヘッダー付き

## スクリプトJSON形式


```json
{
  "meta": {
    "title": "動画タイトル",
    "template": "youtube",
    "fps": 30,
    "width": 1920,
    "height": 1080
  },
  "scenes": [
    {
      "id": "scene-1",
      "duration": 5,
      "narration": "ナレーションテキスト",
      "subtitle": "テロップテキスト",
      "visual": {
        "type": "text",
        "content": "表示テキスト"
      },
      "transition": {
        "type": "fade",
        "duration": 0.5
      }
    }
  ]
}
```

## ライセンス

MIT License
