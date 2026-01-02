import React from "react";
import { useCurrentFrame, spring, useVideoConfig, interpolate } from "remotion";

interface HighlightWord {
  text: string;
  color?: string;
}

interface PopupTelopProps {
  /** テキスト（文字列または強調ワード配列） */
  text: string | HighlightWord[];
  /** フォントサイズ（デフォルト: 72） */
  fontSize?: number;
  /** 位置（デフォルト: center） */
  position?: "top" | "center" | "bottom";
  /** 背景色（デフォルト: 半透明黒） */
  backgroundColor?: string;
  /** 文字色（デフォルト: 白） */
  textColor?: string;
  /** 強調色（デフォルト: 黄色） */
  highlightColor?: string;
  /** 開始フレーム */
  startFrame?: number;
  /** 終了フレーム */
  endFrame?: number;
  /** アニメーションタイプ */
  animation?: "popup" | "slide" | "fade" | "bounce";
  /** グロー効果 */
  glow?: boolean;
}

/**
 * ポップアップテロップコンポーネント
 * YouTube Shorts風の強調テロップを表示
 */
export const PopupTelop: React.FC<PopupTelopProps> = ({
  text,
  fontSize = 72,
  position = "center",
  backgroundColor = "rgba(0, 0, 0, 0.75)",
  textColor = "#FFFFFF",
  highlightColor = "#FFFF00",
  startFrame = 0,
  endFrame = Infinity,
  animation = "popup",
  glow = false,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // 表示範囲外なら非表示
  if (frame < startFrame || frame > endFrame) {
    return null;
  }

  const relativeFrame = frame - startFrame;

  // ポップアップアニメーション（spring）
  const popupProgress = spring({
    frame: relativeFrame,
    fps,
    config: {
      damping: 12,
      stiffness: 200,
      mass: 0.5,
    },
    durationInFrames: 15,
  });

  // アニメーションタイプ別の計算
  let scale = 1;
  let translateY = 0;
  let opacity = 1;

  switch (animation) {
    case "popup":
      scale = interpolate(popupProgress, [0, 1], [0, 1]);
      opacity = popupProgress;
      break;
    case "slide":
      translateY = interpolate(popupProgress, [0, 1], [100, 0]);
      opacity = popupProgress;
      break;
    case "fade":
      opacity = popupProgress;
      break;
    case "bounce":
      scale = interpolate(popupProgress, [0, 0.6, 0.8, 1], [0, 1.2, 0.9, 1]);
      opacity = popupProgress;
      break;
  }

  // フェードアウト
  const fadeOutDuration = 10;
  if (frame > endFrame - fadeOutDuration) {
    opacity = interpolate(
      frame,
      [endFrame - fadeOutDuration, endFrame],
      [opacity, 0],
      { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
    );
  }

  // 位置の設定
  const positionStyles: Record<string, React.CSSProperties> = {
    top: { top: "15%", left: "50%", transform: `translateX(-50%) scale(${scale}) translateY(${translateY}px)` },
    center: { top: "50%", left: "50%", transform: `translate(-50%, -50%) scale(${scale}) translateY(${translateY}px)` },
    bottom: { bottom: "20%", left: "50%", transform: `translateX(-50%) scale(${scale}) translateY(${translateY}px)` },
  };

  // グロー効果
  const glowStyle = glow
    ? {
        textShadow: `0 0 20px ${highlightColor}, 0 0 40px ${highlightColor}, 0 0 60px ${highlightColor}`,
      }
    : {};

  // テキストのレンダリング
  const renderText = () => {
    if (typeof text === "string") {
      return text;
    }

    return text.map((word, index) => (
      <span
        key={index}
        style={{
          color: word.color || textColor,
          ...(word.color ? glowStyle : {}),
        }}
      >
        {word.text}
      </span>
    ));
  };

  return (
    <div
      style={{
        position: "absolute",
        ...positionStyles[position],
        opacity,
        zIndex: 100,
        backgroundColor,
        padding: "16px 32px",
        borderRadius: 12,
        maxWidth: "85%",
      }}
    >
      <p
        style={{
          fontSize,
          fontFamily: "'Noto Sans JP', sans-serif",
          fontWeight: 900,
          color: textColor,
          margin: 0,
          textAlign: "center",
          lineHeight: 1.4,
          // 縁取り効果
          textShadow: `
            3px 3px 0 #000,
            -3px -3px 0 #000,
            3px -3px 0 #000,
            -3px 3px 0 #000,
            3px 0 0 #000,
            -3px 0 0 #000,
            0 3px 0 #000,
            0 -3px 0 #000
          `,
          ...glowStyle,
        }}
      >
        {renderText()}
      </p>
    </div>
  );
};

/**
 * 自動字幕風テロップ（画面上部）
 */
interface AutoCaptionProps {
  text: string;
  startFrame?: number;
  endFrame?: number;
}

export const AutoCaption: React.FC<AutoCaptionProps> = ({
  text,
  startFrame = 0,
  endFrame = Infinity,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  if (frame < startFrame || frame > endFrame) {
    return null;
  }

  const relativeFrame = frame - startFrame;

  // フェードイン
  const fadeIn = spring({
    frame: relativeFrame,
    fps,
    config: { damping: 200 },
    durationInFrames: 5,
  });

  // フェードアウト
  let opacity = fadeIn;
  const fadeOutDuration = 5;
  if (frame > endFrame - fadeOutDuration) {
    opacity = interpolate(
      frame,
      [endFrame - fadeOutDuration, endFrame],
      [fadeIn, 0],
      { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
    );
  }

  return (
    <div
      style={{
        position: "absolute",
        top: "10%",
        left: "50%",
        transform: "translateX(-50%)",
        opacity,
        zIndex: 90,
        backgroundColor: "rgba(0, 0, 0, 0.6)",
        padding: "10px 20px",
        borderRadius: 6,
        maxWidth: "90%",
      }}
    >
      <p
        style={{
          fontSize: 28,
          fontFamily: "'Noto Sans JP', sans-serif",
          fontWeight: 500,
          color: "#FFFFFF",
          margin: 0,
          textAlign: "center",
          lineHeight: 1.5,
        }}
      >
        {text}
      </p>
    </div>
  );
};
