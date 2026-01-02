import { Composition, getInputProps } from "remotion";
import { YouTubeStyle } from "./compositions/YouTubeStyle";
import { ShortStyle } from "./compositions/ShortStyle";
import { PresentationStyle } from "./compositions/PresentationStyle";
import { TalkReelStyle, TalkReelWithCutins } from "./compositions/TalkReelStyle";
import { ScriptSchema, type ScriptData, type ScriptProps } from "./utils/schema";

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

// トークリール用のデフォルトスクリプト
const defaultTalkReelScript: ScriptData = {
  meta: {
    title: "トークリール",
    template: "talkreel",
    fps: 30,
    width: 1080,
    height: 1920,
    avatarVideo: "avatar/presenter.mp4",
    narration: "audio/narration.mp3",
    bgm: "bgm/background.mp3",
    bgmVolume: 0.15,
  },
  scenes: [
    {
      id: "scene-1",
      duration: 3,
      narration: "本当は言いたくないんだけど",
      subtitle: "本当は{言いたくない}んだけど",
    },
    {
      id: "scene-2",
      duration: 4,
      narration: "伸びるリールの共通点を教えます",
      subtitle: "{伸びるリール}の共通点",
    },
  ],
};

// デフォルトのprops（ScriptPropsの形式）
const defaultProps: ScriptProps = {
  script: defaultScript,
};

const defaultTalkReelProps: ScriptProps = {
  script: defaultTalkReelScript,
};

export const Root: React.FC = () => {
  // 入力propsから台本データを取得
  const inputProps = getInputProps() as Partial<ScriptProps>;
  const script: ScriptData = inputProps?.script || defaultScript;

  // FPSとサイズの計算
  const fps = script.meta?.fps || 30;
  const width = script.meta?.width || 1920;
  const height = script.meta?.height || 1080;

  // 総フレーム数の計算
  const totalDuration = script.scenes?.reduce(
    (acc, scene) => acc + (scene.duration || 5),
    0
  ) || 10;
  const durationInFrames = Math.ceil(totalDuration * fps);

  // 現在のprops
  const currentProps: ScriptProps = { script };

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
        defaultProps={currentProps}
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
        defaultProps={currentProps}
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
        defaultProps={currentProps}
        schema={ScriptSchema}
      />

      {/* トークリール風テンプレート (9:16) */}
      <Composition
        id="TalkReelStyle"
        component={TalkReelStyle}
        durationInFrames={durationInFrames}
        fps={fps}
        width={1080}
        height={1920}
        defaultProps={currentProps}
        schema={ScriptSchema}
      />

      {/* トークリール（カットイン付き）テンプレート (9:16) */}
      <Composition
        id="TalkReelWithCutins"
        component={TalkReelWithCutins}
        durationInFrames={durationInFrames}
        fps={fps}
        width={1080}
        height={1920}
        defaultProps={currentProps}
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
            : script.meta?.template === "talkreel"
            ? TalkReelStyle
            : YouTubeStyle
        }
        durationInFrames={durationInFrames}
        fps={fps}
        width={script.meta?.template === "short" || script.meta?.template === "talkreel" ? 1080 : width}
        height={script.meta?.template === "short" || script.meta?.template === "talkreel" ? 1920 : height}
        defaultProps={currentProps}
        schema={ScriptSchema}
      />
    </>
  );
};
