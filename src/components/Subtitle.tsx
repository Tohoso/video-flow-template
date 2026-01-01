import React from "react";
import { interpolate, useCurrentFrame } from "remotion";

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

  // フェードイン/アウトの計算
  const fadeInDuration = 10;
  const fadeOutDuration = 10;

  let opacity = 1;
  if (fadeIn && frame < startFrame + fadeInDuration) {
    opacity = interpolate(frame, [startFrame, startFrame + fadeInDuration], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
  }
  if (fadeOut && frame > endFrame - fadeOutDuration) {
    opacity = interpolate(frame, [endFrame - fadeOutDuration, endFrame], [1, 0], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
  }

  // 表示範囲外なら非表示
  if (frame < startFrame || frame > endFrame) {
    return null;
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
        backgroundColor: "transparent",
        padding: "12px 24px",
      },
      text: {
        color: "#FFFFFF",
        textShadow: "2px 2px 8px rgba(0, 0, 0, 0.9), -2px -2px 8px rgba(0, 0, 0, 0.9)",
        fontWeight: "bold" as const,
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

  // 位置の設定
  const positionStyles = {
    bottom: { bottom: "10%", left: "50%", transform: "translateX(-50%)" },
    center: { top: "50%", left: "50%", transform: "translate(-50%, -50%)" },
    top: { top: "10%", left: "50%", transform: "translateX(-50%)" },
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
        ...currentStyle.container,
      }}
    >
      <p
        style={{
          fontSize,
          fontFamily: "'Noto Sans JP', sans-serif",
          margin: 0,
          textAlign: "center",
          lineHeight: 1.4,
          maxWidth: "80vw",
          ...currentStyle.text,
        }}
      >
        {text}
      </p>
    </div>
  );
};
