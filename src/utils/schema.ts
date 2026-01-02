import { z } from "zod";

// シーンのビジュアル設定スキーマ
const VisualSchema = z.object({
  type: z.enum(["image", "video", "avatar", "text", "highlight"]),
  src: z.string().optional(),
  content: z.string().optional(),
  position: z.enum(["center", "left", "right", "fullscreen", "top", "bottom"]).default("center"),
});

// シーンの音声設定スキーマ
const AudioSchema = z.object({
  narration: z.string().optional(),
  bgm: z.string().optional(),
  bgmVolume: z.number().min(0).max(1).default(0.3),
});

// シーンスキーマ
const SceneSchema = z.object({
  id: z.string(),
  duration: z.number().min(0.1).default(5),
  narration: z.string().optional(),
  subtitle: z.string().optional(),
  visual: VisualSchema.optional(),
  audio: AudioSchema.optional(),
});

// メタデータスキーマ
const MetaSchema = z.object({
  title: z.string().default("Untitled Video"),
  template: z.enum(["youtube", "short", "presentation", "talkreel"]).default("youtube"),
  fps: z.number().min(1).max(120).default(30),
  width: z.number().min(100).max(7680).default(1920),
  height: z.number().min(100).max(4320).default(1080),
  // トークリール用の追加フィールド
  avatarVideo: z.string().optional(), // アバター動画のパス
  narration: z.string().optional(),   // ナレーション音声のパス
  bgm: z.string().optional(),         // BGMのパス
  bgmVolume: z.number().min(0).max(1).default(0.15).optional(),
});

// 台本全体のスキーマ
export const ScriptSchema = z.object({
  script: z.object({
    meta: MetaSchema,
    scenes: z.array(SceneSchema).min(1),
  }),
});

// 型定義のエクスポート
export type Visual = z.infer<typeof VisualSchema>;
export type Audio = z.infer<typeof AudioSchema>;
export type Scene = z.infer<typeof SceneSchema>;
export type Meta = z.infer<typeof MetaSchema>;
export type ScriptData = {
  meta: Meta;
  scenes: Scene[];
};
export type ScriptProps = z.infer<typeof ScriptSchema>;
