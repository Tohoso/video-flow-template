import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, Audio, staticFile } from "remotion";
import { Subtitle } from "../components/Subtitle";
import { PresentationBackground } from "../components/Background";
import { Transition, SceneTransition } from "../components/Transition";
import { getCurrentSceneIndex, getSceneProgress, getSceneStartFrame, getSceneDurationInFrames } from "../utils/timing";
import { presentationColors } from "../utils/colors";
import type { ScriptProps } from "../utils/schema";

export const PresentationStyle: React.FC<ScriptProps> = ({ script }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const scenes = script.scenes;

  // 現在のシーンを取得
  const currentSceneIndex = getCurrentSceneIndex(scenes, frame, fps);
  const currentScene = scenes[currentSceneIndex];
  const sceneProgress = getSceneProgress(scenes, frame, currentSceneIndex, fps);
  const sceneStartFrame = getSceneStartFrame(scenes, currentSceneIndex, fps);
  const sceneDuration = getSceneDurationInFrames(currentScene, fps);

  return (
    <AbsoluteFill>
      {/* 背景 */}
      <PresentationBackground />

      {/* ヘッダー */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 80,
          backgroundColor: presentationColors.primary,
          display: "flex",
          alignItems: "center",
          paddingLeft: 40,
          paddingRight: 40,
          justifyContent: "space-between",
        }}
      >
        <h2
          style={{
            color: "#FFFFFF",
            fontSize: 28,
            fontFamily: "'Noto Sans JP', sans-serif",
            fontWeight: "bold",
            margin: 0,
          }}
        >
          {script.meta.title}
        </h2>
        <span
          style={{
            color: "rgba(255, 255, 255, 0.8)",
            fontSize: 20,
            fontFamily: "'Noto Sans JP', sans-serif",
          }}
        >
          {currentSceneIndex + 1} / {scenes.length}
        </span>
      </div>

      {/* メインコンテンツエリア */}
      <AbsoluteFill
        style={{
          top: 80,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          padding: "5%",
        }}
      >
        <SceneTransition progress={sceneProgress}>
          {/* テキストコンテンツ */}
          {currentScene.visual?.type === "text" && (
            <Transition type="slide" direction="right" delay={5}>
              <div
                style={{
                  backgroundColor: "#FFFFFF",
                  padding: "60px 80px",
                  borderRadius: 16,
                  boxShadow: "0 10px 40px rgba(0, 0, 0, 0.1)",
                  maxWidth: "80%",
                }}
              >
                <h1
                  style={{
                    color: presentationColors.text,
                    fontSize: 56,
                    fontFamily: "'Noto Sans JP', sans-serif",
                    fontWeight: "bold",
                    textAlign: "center",
                    margin: 0,
                    lineHeight: 1.4,
                  }}
                >
                  {currentScene.visual.content || currentScene.narration}
                </h1>
              </div>
            </Transition>
          )}

          {/* 画像表示 */}
          {currentScene.visual?.type === "image" && currentScene.visual.src && (
            <Transition type="fade">
              <div
                style={{
                  backgroundColor: "#FFFFFF",
                  padding: 20,
                  borderRadius: 16,
                  boxShadow: "0 10px 40px rgba(0, 0, 0, 0.1)",
                }}
              >
                <img
                  src={currentScene.visual.src.startsWith("http")
                    ? currentScene.visual.src
                    : staticFile(currentScene.visual.src)}
                  style={{
                    maxWidth: "70vw",
                    maxHeight: "50vh",
                    objectFit: "contain",
                    borderRadius: 8,
                  }}
                  alt=""
                />
              </div>
            </Transition>
          )}
        </SceneTransition>
      </AbsoluteFill>

      {/* テロップ（プレゼンテーションスタイル） */}
      {currentScene.subtitle && (
        <Subtitle
          text={currentScene.subtitle}
          style="presentation"
          position="bottom"
          fontSize={36}
          startFrame={sceneStartFrame}
          endFrame={sceneStartFrame + sceneDuration}
        />
      )}

      {/* フッター（プログレスバー） */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          width: "100%",
          height: 8,
          backgroundColor: "#E2E8F0",
        }}
      >
        <div
          style={{
            width: `${((currentSceneIndex + sceneProgress) / scenes.length) * 100}%`,
            height: "100%",
            backgroundColor: presentationColors.accent,
            transition: "width 0.1s linear",
          }}
        />
      </div>

      {/* BGM */}
      {currentScene.audio?.bgm && (
        <Audio
          src={currentScene.audio.bgm.startsWith("http")
            ? currentScene.audio.bgm
            : staticFile(currentScene.audio.bgm)}
          volume={currentScene.audio.bgmVolume || 0.2}
          startFrom={sceneStartFrame}
        />
      )}
    </AbsoluteFill>
  );
};
