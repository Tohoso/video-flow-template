import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  Audio,
  Video,
  staticFile,
  Sequence,
  interpolate,
} from "remotion";
import { PopupTelop, AutoCaption } from "../components/PopupTelop";
import { GradientOverlay, ProgressBar, Blackout } from "../components/SceneEffects";
import {
  getCurrentSceneIndex,
  getSceneProgress,
  getSceneStartFrame,
  getSceneDurationInFrames,
  getTotalDurationInFrames,
} from "../utils/timing";
import type { ScriptProps, Scene } from "../utils/schema";

/**
 * トークリール風スタイル
 * - 話者が中央に配置
 * - 強調テロップがポップアップで表示
 * - 自動字幕が上部に表示
 * - シーン切り替え時に短い暗転
 */
export const TalkReelStyle: React.FC<ScriptProps> = ({ script }) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const scenes = script.scenes;

  // 現在のシーンを取得
  const currentSceneIndex = getCurrentSceneIndex(scenes, frame, fps);
  const currentScene = scenes[currentSceneIndex];
  const sceneProgress = getSceneProgress(scenes, frame, currentSceneIndex, fps);
  const sceneStartFrame = getSceneStartFrame(scenes, currentSceneIndex, fps);
  const sceneDuration = getSceneDurationInFrames(currentScene, fps);
  const totalDuration = getTotalDurationInFrames(scenes, fps);

  // 全体の進行度
  const overallProgress = frame / totalDuration;

  // アバター動画のパス
  const avatarSrc = script.meta.avatarVideo || "avatar/presenter.mp4";
  const bgmSrc = script.meta.bgm || "bgm/background.mp3";
  const narrationSrc = script.meta.narration || "audio/narration.mp3";

  return (
    <AbsoluteFill style={{ backgroundColor: "#000000" }}>
      {/* アバター動画（背景として全画面表示） */}
      <AbsoluteFill>
        <Video
          src={staticFile(avatarSrc)}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />
      </AbsoluteFill>

      {/* グラデーションオーバーレイ（テロップの視認性向上） */}
      <GradientOverlay topIntensity={0.4} bottomIntensity={0.6} />

      {/* 自動字幕風テロップ（上部） */}
      {currentScene.narration && (
        <AutoCaption
          text={currentScene.narration}
          startFrame={sceneStartFrame}
          endFrame={sceneStartFrame + sceneDuration}
        />
      )}

      {/* メインテロップ（強調） */}
      {currentScene.subtitle && (
        <PopupTelop
          text={parseHighlightText(currentScene.subtitle)}
          fontSize={getFontSize(currentScene.subtitle, width)}
          position="bottom"
          animation="popup"
          startFrame={sceneStartFrame + 5} // 少し遅れて表示
          endFrame={sceneStartFrame + sceneDuration - 5}
          glow={currentScene.visual?.type === "highlight"}
        />
      )}

      {/* シーン切り替え時の暗転 */}
      {scenes.map((scene, index) => {
        if (index === 0) return null;
        const transitionFrame = getSceneStartFrame(scenes, index, fps);
        return (
          <Blackout
            key={`blackout-${index}`}
            startFrame={transitionFrame - 3}
            duration={6}
          />
        );
      })}

      {/* プログレスバー */}
      <ProgressBar
        progress={overallProgress}
        color="linear-gradient(90deg, #ff6b6b 0%, #feca57 100%)"
        height={4}
        position="bottom"
      />

      {/* BGM */}
      <Audio
        src={staticFile(bgmSrc)}
        volume={0.15}
        loop
      />

      {/* ナレーション */}
      <Audio
        src={staticFile(narrationSrc)}
        volume={1}
      />
    </AbsoluteFill>
  );
};

/**
 * テキストから強調部分を解析
 * 例: "これは{重要}なポイントです" → [{text: "これは"}, {text: "重要", color: "#FFFF00"}, {text: "なポイントです"}]
 */
function parseHighlightText(text: string): string | { text: string; color?: string }[] {
  const regex = /\{([^}]+)\}/g;
  const parts: { text: string; color?: string }[] = [];
  let lastIndex = 0;
  let match;

  while ((match = regex.exec(text)) !== null) {
    // マッチ前のテキスト
    if (match.index > lastIndex) {
      parts.push({ text: text.slice(lastIndex, match.index) });
    }
    // 強調テキスト
    parts.push({ text: match[1], color: "#FFFF00" });
    lastIndex = regex.lastIndex;
  }

  // 残りのテキスト
  if (lastIndex < text.length) {
    parts.push({ text: text.slice(lastIndex) });
  }

  // 強調がなければ元のテキストを返す
  if (parts.length === 0 || (parts.length === 1 && !parts[0].color)) {
    return text;
  }

  return parts;
}

/**
 * テキストの長さに応じてフォントサイズを調整
 */
function getFontSize(text: string, screenWidth: number): number {
  const baseSize = 72;
  const textLength = text.replace(/\{|\}/g, "").length;

  if (textLength > 20) {
    return Math.max(48, baseSize - (textLength - 20) * 2);
  }
  if (textLength < 10) {
    return Math.min(96, baseSize + (10 - textLength) * 4);
  }
  return baseSize;
}

/**
 * カットイン付きトークリールスタイル
 * ストック映像を挿入するバージョン
 */
export const TalkReelWithCutins: React.FC<ScriptProps> = ({ script }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const scenes = script.scenes;

  const currentSceneIndex = getCurrentSceneIndex(scenes, frame, fps);
  const currentScene = scenes[currentSceneIndex];
  const sceneStartFrame = getSceneStartFrame(scenes, currentSceneIndex, fps);
  const sceneDuration = getSceneDurationInFrames(currentScene, fps);
  const totalDuration = getTotalDurationInFrames(scenes, fps);
  const overallProgress = frame / totalDuration;

  const avatarSrc = script.meta.avatarVideo || "avatar/presenter.mp4";
  const bgmSrc = script.meta.bgm || "bgm/background.mp3";
  const narrationSrc = script.meta.narration || "audio/narration.mp3";

  // カットインがあるかどうか
  const hasCutin = currentScene.visual?.type === "image" && currentScene.visual.src;

  return (
    <AbsoluteFill style={{ backgroundColor: "#000000" }}>
      {/* メイン映像（アバターまたはカットイン） */}
      {hasCutin ? (
        // カットイン映像
        <AbsoluteFill>
          <img
            src={staticFile(currentScene.visual!.src!)}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
            alt=""
          />
        </AbsoluteFill>
      ) : (
        // アバター映像
        <AbsoluteFill>
          <Video
            src={staticFile(avatarSrc)}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
        </AbsoluteFill>
      )}

      {/* グラデーションオーバーレイ */}
      <GradientOverlay topIntensity={0.4} bottomIntensity={0.6} />

      {/* 自動字幕 */}
      {currentScene.narration && (
        <AutoCaption
          text={currentScene.narration}
          startFrame={sceneStartFrame}
          endFrame={sceneStartFrame + sceneDuration}
        />
      )}

      {/* メインテロップ */}
      {currentScene.subtitle && (
        <PopupTelop
          text={parseHighlightText(currentScene.subtitle)}
          fontSize={72}
          position="bottom"
          animation="popup"
          startFrame={sceneStartFrame + 5}
          endFrame={sceneStartFrame + sceneDuration - 5}
        />
      )}

      {/* シーン切り替え時の暗転 */}
      {scenes.map((scene, index) => {
        if (index === 0) return null;
        const transitionFrame = getSceneStartFrame(scenes, index, fps);
        return (
          <Blackout
            key={`blackout-${index}`}
            startFrame={transitionFrame - 3}
            duration={6}
          />
        );
      })}

      {/* プログレスバー */}
      <ProgressBar
        progress={overallProgress}
        color="linear-gradient(90deg, #ff6b6b 0%, #feca57 100%)"
        height={4}
        position="bottom"
      />

      {/* BGM */}
      <Audio src={staticFile(bgmSrc)} volume={0.15} loop />

      {/* ナレーション */}
      <Audio src={staticFile(narrationSrc)} volume={1} />
    </AbsoluteFill>
  );
};
