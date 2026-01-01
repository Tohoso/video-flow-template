# Video Flow Template

AI駆動の動画自動生成テンプレートリポジトリ。Claude FlowとRemotionを使用して、テキストから動画を自動生成します。

## 概要

このテンプレートは、以下のワークフローを実現します：

```
テキスト入力 → Claude Flow Swarm → スクリプトJSON → Remotion → 動画出力
```

### 特徴

- **AI駆動**: Claude Flow Swarmによる自動台本解析・構成
- **複数テンプレート**: YouTube風、ショート動画風、プレゼンテーション風
- **GitHub Actions統合**: Issue作成で自動動画生成
- **カスタマイズ可能**: コンポーネントベースの設計

## クイックスタート

### 1. テンプレートから新規リポジトリを作成

「Use this template」ボタンをクリックして新規リポジトリを作成

### 2. Secretsを設定

Settings → Secrets and variables → Actions で以下を設定：

| Secret名 | 説明 |
|:---|:---|
| `ANTHROPIC_API_KEY` | Anthropic APIキー |

### 3. 動画を生成

**方法A: Issue経由（自動）**

1. Issues → New Issue → 「🎬 Video Request」を選択
2. フォームに記入して作成
3. `video-request`ラベルで自動生成開始
4. 完了後、Artifactsから動画をダウンロード

**方法B: 手動トリガー**

1. Actions → 「Render Video (Manual)」を選択
2. 「Run workflow」をクリック
3. パラメータを入力して実行

## プロジェクト構造

```
video-flow-template/
├── .github/
│   ├── workflows/
│   │   ├── auto-generate-video.yml  # Issue→動画自動生成
│   │   ├── render-video.yml         # 手動レンダリング
│   │   └── preview.yml              # PRプレビュー
│   └── ISSUE_TEMPLATE/
│       └── video-request.yml        # 動画リクエストフォーム
├── .claude-flow/
│   ├── config.json                  # Claude Flow設定
│   ├── agents/                      # Swarm Agents定義
│   │   ├── script-analyzer.json     # 台本分析
│   │   ├── subtitle-generator.json  # テロップ生成
│   │   ├── visual-composer.json     # 映像構成
│   │   ├── audio-manager.json       # 音声管理
│   │   └── final-assembler.json     # 最終統合
│   └── workflows/
│       └── video-generation.json    # 生成ワークフロー
├── src/
│   ├── index.ts                     # エントリーポイント
│   ├── Root.tsx                     # Remotion Root
│   ├── components/                  # 再利用可能コンポーネント
│   │   ├── Subtitle.tsx
│   │   ├── Background.tsx
│   │   └── Transition.tsx
│   ├── compositions/                # 動画テンプレート
│   │   ├── YouTubeStyle.tsx
│   │   ├── ShortStyle.tsx
│   │   └── PresentationStyle.tsx
│   └── utils/
│       ├── schema.ts                # 型定義
│       ├── timing.ts                # タイミング計算
│       └── colors.ts                # カラーパレット
├── scripts/
│   ├── schema.json                  # スクリプトJSONスキーマ
│   └── input/                       # 入力スクリプト
│       └── example.json
├── public/                          # 静的アセット
└── output/                          # 出力ディレクトリ
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

## ローカル開発

```bash
# 依存関係インストール
npm install

# プレビュー起動
npm run dev

# レンダリング
npm run render

# 特定のテンプレートでレンダリング
npx remotion render src/index.ts YouTubeStyle output/video.mp4
```

## Swarm Agents

### script-analyzer
台本テキストを解析し、シーン構成を決定

### subtitle-generator
テロップのテキストとタイミングを生成

### visual-composer
映像素材の配置とアニメーションを決定

### audio-manager
BGMと音声のミキシング設定を管理

### final-assembler
全エージェントの出力を統合し、最終JSONを生成

## カスタマイズ

### 新しいテンプレートを追加

1. `src/compositions/`に新しいコンポーネントを作成
2. `src/Root.tsx`でCompositionを登録
3. `src/utils/colors.ts`にカラーパレットを追加

### 新しいAgentを追加

1. `.claude-flow/agents/`にJSON定義を作成
2. `.claude-flow/workflows/video-generation.json`にステージを追加

## ライセンス

MIT License
