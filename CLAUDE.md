# Claude Code Instructions

このプロジェクトは、Remotionを使用したAI駆動の動画生成テンプレートです。

## プロジェクト概要

- **目的**: テキストから動画を自動生成
- **技術スタック**: Remotion, React, TypeScript, Claude Flow
- **出力形式**: MP4動画

## ディレクトリ構造

```
src/
├── components/    # 再利用可能なUIコンポーネント
├── compositions/  # 動画テンプレート（YouTube風、ショート風、プレゼン風）
└── utils/         # ユーティリティ関数

scripts/
├── schema.json    # スクリプトJSONスキーマ
└── input/         # 入力スクリプトファイル

.claude-flow/
├── agents/        # Swarm Agent定義
└── workflows/     # ワークフロー定義
```

## 主要タスク

### 動画スクリプト生成

ユーザーからテキストを受け取り、`scripts/schema.json`に準拠したJSONを生成してください。

出力先: `scripts/input/generated.json`

### コンポーネント修正

`src/components/`内のコンポーネントを修正する際は、以下を確認：
- Remotion APIの正しい使用
- TypeScript型の整合性
- アニメーションのパフォーマンス

### テンプレート追加

新しいテンプレートを追加する場合：
1. `src/compositions/`に新ファイル作成
2. `src/Root.tsx`でComposition登録
3. `src/utils/colors.ts`にカラーパレット追加

## コマンド

```bash
# 開発サーバー起動
npm run dev

# 動画レンダリング
npm run render

# 特定テンプレートでレンダリング
npx remotion render src/index.ts YouTubeStyle output/video.mp4 --props="$(cat scripts/input/example.json)"
```

## 注意事項

- 動画レンダリングは重い処理のため、GitHub Actionsでは60分のタイムアウトを設定
- 大きな画像/動画素材は`public/`に配置し、`staticFile()`で参照
- フォントは`@remotion/google-fonts`を使用推奨
