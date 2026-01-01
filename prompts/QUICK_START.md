# クイックスタートガイド

最短で動画を生成する方法を説明します。

---

## 最短ルート（素材なし）

### ステップ1: Claude Codeを開く

プロジェクトディレクトリでClaude Codeを起動します。

### ステップ2: 台本を伝える

```
YouTube風に編集して

タイトル: AIの基礎知識

台本:
こんにちは、今日はAIについて解説します。

AIとは人工知能のことで、人間の知能を模倣したシステムです。

最近では、ChatGPTやClaudeなど、対話型AIが注目されています。

ぜひ、AIを活用してみてください。
```

### ステップ3: 待つ

Claude Codeが自動で：
1. 台本を分析
2. テロップを生成
3. 映像を配置
4. 音声を設定
5. 動画をレンダリング

### ステップ4: 完成

`out/output.mp4` に動画が保存されます。

---

## 素材ありルート

### ステップ1: 素材を配置

```bash
# 画像を配置
cp your_logo.png public/images/

# BGMを配置
cp your_bgm.mp3 public/bgm/

# ナレーションを配置
cp your_narration.mp3 public/audio/
```

### ステップ2: 台本を伝える

```
YouTube風に編集して

タイトル: 会社紹介動画

使用素材:
- 画像: logo.png
- BGM: bgm.mp3
- ナレーション: narration.mp3

台本:
[ナレーションの内容に合わせた台本]
```

### ステップ3: 完成

---

## スタイル別コマンド

### YouTube風（16:9）
```
YouTube風に編集して
```

### ショート風（9:16）
```
ショート動画を作って
```

### プレゼン風（16:9）
```
プレゼン動画を作って
```

---

## トラブルシューティング

### エラーが出た場合

Claude Codeは自動でエラーを修正しようとします。
それでも解決しない場合は：

1. エラーメッセージを確認
2. 素材ファイルの形式を確認（MP3, PNG, MP4）
3. ファイルパスが正しいか確認

### 動画が生成されない場合

```bash
# 手動でレンダリングを試す
npx remotion render src/index.ts YouTubeStyle out/test.mp4
```

### プレビューで確認したい場合

```bash
# Remotion Studioを起動
npx remotion studio
```

---

## 次のステップ

- [VIDEO_REQUEST_TEMPLATE.md](./VIDEO_REQUEST_TEMPLATE.md) - 詳細なリクエストテンプレート
- [../CLAUDE.md](../CLAUDE.md) - 技術的な詳細
- [../.claude/commands/](../.claude/commands/) - サブエージェントの設定
