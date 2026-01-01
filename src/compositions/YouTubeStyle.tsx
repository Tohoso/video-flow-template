import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, Audio, staticFile } from "remotion";
import { Subtitle } from "../components/Subtitle";
import { YouTubeBackground } from "../components/Background";
import { Transition, SceneTransition } from "../components/Transition";
import { getCurrentSceneIndex, getSceneProgress, getSceneStartFrame, getSceneDurationInFrames } from "../utils/timing";
import type { ScriptProps } from "../utils/schema";

export const YouTubeStyle: React.FC<ScriptProps> = ({ script }) => {
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
      <YouTubeBackground />

      {/* メインコンテンツエリア */}
      <AbsoluteFill
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          padding: "5%",
        }}
      >
        <SceneTransition progress={sceneProgress}>
          {/* ビジュアルコンテンツ */}
          {currentScene.visual?.type === "text" && (
            <Transition type="slide" direction="up" delay={5}>
              <h1
                style={{
                  color: "#FFFFFF",
                  fontSize: 72,
                  fontFamily: "'Noto Sans JP', sans-serif",
                  fontWeight: "bold",
                  textAlign: "center",
                  margin: 0,
                }}
              >
                {currentScene.visual.content || currentScene.narration}
              </h1>
            </Transition>
          )}

          {/* 画像表示 */}
          {currentScene.visual?.type === "image" && currentScene.visual.src && (
            <Transition type="fade">
              <img
                src={currentScene.visual.src.startsWith("http") 
                  ? currentScene.visual.src 
                  : staticFile(currentScene.visual.src)}
                style={{
                  maxWidth: "80%",
                  maxHeight: "60%",
                  objectFit: "contain",
                  borderRadius: 12,
                  boxShadow: "0 20px 60px rgba(0, 0, 0, 0.5)",
                }}
                alt=""
              />
            </Transition>
          )}
        </SceneTransition>
      </AbsoluteFill>

      {/* テロップ */}
      {currentScene.subtitle && (
        <Subtitle
          text={currentScene.subtitle}
          style="youtube"
          position="bottom"
          fontSize={48}
          startFrame={sceneStartFrame}
          endFrame={sceneStartFrame + sceneDuration}
        />
      )}

      {/* タイトル表示（最初のシーンのみ） */}
      {currentSceneIndex === 0 && frame < fps * 3 && (
        <div
          style={{
            position: "absolute",
            top: "5%",
            left: "5%",
            zIndex: 50,
          }}
        >
          <Transition type="slide" direction="left">
            <h2
              style={{
                color: "#FFFFFF",
                fontSize: 36,
                fontFamily: "'Noto Sans JP', sans-serif",
                fontWeight: "bold",
                margin: 0,
                opacity: 0.9,
              }}
            >
              {script.meta.title}
            </h2>
          </Transition>
        </div>
      )}

      {/* BGM */}
      {currentScene.audio?.bgm && (
        <Audio
          src={currentScene.audio.bgm.startsWith("http")
            ? currentScene.audio.bgm
            : staticFile(currentScene.audio.bgm)}
          volume={currentScene.audio.bgmVolume || 0.3}
          startFrom={sceneStartFrame}
        />
      )}
    </AbsoluteFill>
  );
};
