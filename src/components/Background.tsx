import React from "react";
import { Img, staticFile, useCurrentFrame, interpolate } from "remotion";
import { colors } from "../utils/colors";

interface BackgroundProps {
  type?: "solid" | "gradient" | "image" | "video";
  color?: string;
  gradient?: string;
  imageSrc?: string;
  animate?: boolean;
}

export const Background: React.FC<BackgroundProps> = ({
  type = "gradient",
  color = colors.background.dark,
  gradient = colors.gradients.dark,
  imageSrc,
  animate = false,
}) => {
  const frame = useCurrentFrame();

  // アニメーション用のスケール計算
  const scale = animate
    ? interpolate(frame, [0, 300], [1, 1.1], {
        extrapolateRight: "clamp",
      })
    : 1;

  const baseStyle: React.CSSProperties = {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    zIndex: 0,
  };

  if (type === "solid") {
    return <div style={{ ...baseStyle, backgroundColor: color }} />;
  }

  if (type === "gradient") {
    return <div style={{ ...baseStyle, background: gradient }} />;
  }

  if (type === "image" && imageSrc) {
    return (
      <div style={{ ...baseStyle, overflow: "hidden" }}>
        <Img
          src={imageSrc.startsWith("http") ? imageSrc : staticFile(imageSrc)}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            transform: `scale(${scale})`,
          }}
        />
      </div>
    );
  }

  // デフォルトはグラデーション
  return <div style={{ ...baseStyle, background: gradient }} />;
};

/**
 * YouTube風の背景
 */
export const YouTubeBackground: React.FC = () => (
  <Background type="solid" color="#0F0F0F" />
);

/**
 * ショート動画風の背景
 */
export const ShortBackground: React.FC = () => (
  <Background type="solid" color="#000000" />
);

/**
 * プレゼンテーション風の背景
 */
export const PresentationBackground: React.FC = () => (
  <Background type="gradient" gradient="linear-gradient(180deg, #F8FAFC 0%, #E2E8F0 100%)" />
);
