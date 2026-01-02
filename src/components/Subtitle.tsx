import React from "react";
import { interpolate, useCurrentFrame, spring, useVideoConfig } from "remotion";

interface SubtitleProps {
  text: string;
  style?: "youtube" | "short" | "presentation";
  position?: "bottom" | "center" | "top";
  fontSize?: number;
  fadeIn?: boolean;
  fadeOut?: boolean;
  startFrame?: number;
  endFrame?: number;
}

export const Subtitle: React.FC<SubtitleProps> = ({
  text,
  style = "youtube",
  position = "bottom",
  fontSize = 48,
  fadeIn = true,
  fadeOut = true,
  startFrame = 0,
  endFrame = Infinity,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // 表示範囲外なら非表示
  if (frame < startFrame || frame > endFrame) {
    return null;
  }

  // フレーム範囲内での相対フレーム
  const relativeFrame = frame - startFrame;

  // springアニメーション（TikTokスタイル）
  const enter = spring({
    frame: relativeFrame,
    fps,
    config: {
      damping: 200,
    },
    durationInFrames: 5,
  });

  // スケールアニメーション（0.8 → 1.0）
  const scale = interpolate(enter, [0, 1], [0.8, 1.0]);

  // 垂直移動アニメーション（50px → 0）
  const translateY = interpolate(enter, [0, 1], [50, 0]);

  // フェードアウトの計算
  const fadeOutDuration = 10;
  let opacity = 1;
  if (fadeOut && frame > endFrame - fadeOutDuration) {
    opacity = interpolate(frame, [endFrame - fadeOutDuration, endFrame], [1, 0], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
  }

  // スタイル別の設定
  const styles = {
    youtube: {
      container: {
        backgroundColor: "rgba(0, 0, 0, 0.75)",
        padding: "12px 24px",
        borderRadius: "8px",
      },
      text: {
        color: "#FFFFFF",
        textShadow: "none",
      },
    },
    short: {
      container: {
        backgroundColor: "#FFFFFF",
        padding: "20px 35px",
        borderRadius: "0px",
        border: "none",
      },
      text: {
        color: "#000000",
        textShadow: "none",
        fontWeight: "bold" as const,
        WebkitTextStroke: "0px",
        paintOrder: "fill",
      },
    },
    presentation: {
      container: {
        backgroundColor: "rgba(30, 64, 175, 0.9)",
        padding: "16px 32px",
        borderRadius: "4px",
      },
      text: {
        color: "#FFFFFF",
        textShadow: "none",
      },
    },
  };

  // 位置の設定（画像解析に基づく正確な配置）
  const positionStyles = {
    bottom: { bottom: "15%", left: "50%", transform: "translateX(-50%)" },
    center: { top: "50%", left: "50%", transform: "translate(-50%, -50%)" },
    top: { top: "15%", left: "50%", transform: "translateX(-50%)" },
  };

  const currentStyle = styles[style];
  const currentPosition = positionStyles[position];

  return (
    <div
      style={{
        position: "absolute",
        ...currentPosition,
        opacity,
        zIndex: 100,
        transform: `${currentPosition.transform} scale(${scale}) translateY(${translateY}px)`,
        ...currentStyle.container,
      }}
    >
      <p
        style={{
          fontSize,
          fontFamily: "'Noto Sans JP', sans-serif",
          margin: 0,
          textAlign: "center",
          lineHeight: 1.5,
          maxWidth: "71vw",
          wordBreak: "keep-all",
          overflowWrap: "break-word",
          whiteSpace: "normal",
          ...currentStyle.text,
        }}
      >
        {text}
      </p>
    </div>
  );
};
