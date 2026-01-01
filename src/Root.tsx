import { Composition, getInputProps } from "remotion";
import { YouTubeStyle } from "./compositions/YouTubeStyle";
import { ShortStyle } from "./compositions/ShortStyle";
import { PresentationStyle } from "./compositions/PresentationStyle";
import { ScriptSchema, type ScriptData } from "./utils/schema";

// デフォルトのスクリプトデータ
const defaultScript: ScriptData = {
  meta: {
    title: "Sample Video",
    template: "youtube",
    fps: 30,
    width: 1920,
    height: 1080,
  },
  scenes: [
    {
      id: "scene-1",
      duration: 5,
      narration: "こんにちは、今日は素晴らしい一日ですね。",
      subtitle: "こんにちは、今日は素晴らしい一日ですね。",
      visual: {
        type: "text",
        content: "Welcome",
        position: "center",
      },
    },
  ],
};

export const Root: React.FC = () => {
  // 入力propsから台本データを取得
  const inputProps = getInputProps();
  const script = inputProps?.script || defaultScript;

  // FPSとサイズの計算
  const fps = script.meta?.fps || 30;
  const width = script.meta?.width || 1920;
  const height = script.meta?.height || 1080;

  // 総フレーム数の計算
  const totalDuration = script.scenes?.reduce(
    (acc: number, scene: { duration?: number }) => acc + (scene.duration || 5),
    0
  ) || 10;
  const durationInFrames = Math.ceil(totalDuration * fps);

  return (
    <>
      {/* YouTube風テンプレート (16:9) */}
      <Composition
        id="YouTubeStyle"
        component={YouTubeStyle}
        durationInFrames={durationInFrames}
        fps={fps}
        width={1920}
        height={1080}
        defaultProps={{ script }}
        schema={ScriptSchema}
      />

      {/* ショート動画テンプレート (9:16) */}
      <Composition
        id="ShortStyle"
        component={ShortStyle}
        durationInFrames={durationInFrames}
        fps={fps}
        width={1080}
        height={1920}
        defaultProps={{ script }}
        schema={ScriptSchema}
      />

      {/* プレゼンテーション風テンプレート (16:9) */}
      <Composition
        id="PresentationStyle"
        component={PresentationStyle}
        durationInFrames={durationInFrames}
        fps={fps}
        width={1920}
        height={1080}
        defaultProps={{ script }}
        schema={ScriptSchema}
      />

      {/* メインコンポジション（動的テンプレート選択） */}
      <Composition
        id="Main"
        component={
          script.meta?.template === "short"
            ? ShortStyle
            : script.meta?.template === "presentation"
            ? PresentationStyle
            : YouTubeStyle
        }
        durationInFrames={durationInFrames}
        fps={fps}
        width={script.meta?.template === "short" ? 1080 : width}
        height={script.meta?.template === "short" ? 1920 : height}
        defaultProps={{ script }}
        schema={ScriptSchema}
      />
    </>
  );
};
