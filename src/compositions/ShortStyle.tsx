import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, Audio, staticFile } from "remotion";
import { Subtitle } from "../components/Subtitle";
import { ShortBackground } from "../components/Background";
import { Transition, SceneTransition } from "../components/Transition";
import { getCurrentSceneIndex, getSceneProgress, getSceneStartFrame, getSceneDurationInFrames } from "../utils/timing";
import type { ScriptProps } from "../utils/schema";

export const ShortStyle: React.FC<ScriptProps> = ({ script }) => {
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
      {/* 黒背景 */}
      <AbsoluteFill
        style={{
          backgroundColor: "#000000",
        }}
      />

      {/* メインコンテンツエリア（縦長） */}
      <AbsoluteFill
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          padding: "10%",
        }}
      >
        <SceneTransition progress={sceneProgress}>
          {/* テキストコンテンツ */}
          {currentScene.visual?.type === "text" && (
            <Transition type="scale" delay={3}>
              <h1
                style={{
                  color: "#FFFFFF",
                  fontSize: 64,
                  fontFamily: "'Noto Sans JP', sans-serif",
                  fontWeight: "bold",
                  textAlign: "center",
                  margin: 0,
                  textShadow: "2px 2px 10px rgba(0, 0, 0, 0.8)",
                  lineHeight: 1.3,
                }}
              >
                {currentScene.visual.content || currentScene.narration}
              </h1>
            </Transition>
          )}

          {/* 画像表示（縦長に最適化） */}
          {currentScene.visual?.type === "image" && currentScene.visual.src && (
            <Transition type="fade">
              <img
                src={currentScene.visual.src.startsWith("http")
                  ? currentScene.visual.src
                  : staticFile(currentScene.visual.src)}
                style={{
                  maxWidth: "90%",
                  maxHeight: "70%",
                  objectFit: "contain",
                  borderRadius: 16,
                }}
                alt=""
              />
            </Transition>
          )}
        </SceneTransition>
      </AbsoluteFill>

      {/* テロップ（画像解析に基づく正確なスタイル） */}
      {currentScene.subtitle && (
        <Subtitle
          text={currentScene.subtitle}
          style="short"
          position="bottom"
          fontSize={55}
          startFrame={sceneStartFrame}
          endFrame={sceneStartFrame + sceneDuration}
        />
      )}

      {/* プログレスバー（下部） */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          width: "100%",
          height: 6,
          backgroundColor: "rgba(255, 255, 255, 0.2)",
        }}
      >
        <div
          style={{
            width: `${sceneProgress * 100}%`,
            height: "100%",
            background: "linear-gradient(90deg, #667eea 0%, #764ba2 100%)",
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
          volume={currentScene.audio.bgmVolume || 0.3}
          startFrom={sceneStartFrame}
        />
      )}

      {/* ナレーション音声（全シーン通して再生） */}
      <Audio
        src={staticFile("audio/demo_narration.mp3")}
        volume={1}
      />

      {/* アバター動画（中央に配置 - 画像解析に基づく正確な配置） */}
      <div
        style={{
          position: "absolute",
          top: "17.5%",
          left: "0%",
          width: "100%",
          height: "60%",
          zIndex: 1,
        }}
      >
        <video
          src={staticFile("avatar/heygen_avatar.mp4")}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
          muted
          playsInline
          autoPlay
          loop
        />
      </div>
    </AbsoluteFill>
  );
};
