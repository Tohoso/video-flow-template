import React from "react";
import { useCurrentFrame, interpolate, Easing } from "remotion";

interface TransitionProps {
  children: React.ReactNode;
  type?: "fade" | "slide" | "scale" | "none";
  direction?: "left" | "right" | "up" | "down";
  duration?: number;
  delay?: number;
}

export const Transition: React.FC<TransitionProps> = ({
  children,
  type = "fade",
  direction = "up",
  duration = 15,
  delay = 0,
}) => {
  const frame = useCurrentFrame();
  const adjustedFrame = Math.max(0, frame - delay);

  // 不透明度の計算
  const opacity = interpolate(adjustedFrame, [0, duration], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  if (type === "none") {
    return <>{children}</>;
  }

  if (type === "fade") {
    return <div style={{ opacity }}>{children}</div>;
  }

  if (type === "scale") {
    const scale = interpolate(adjustedFrame, [0, duration], [0.8, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.out(Easing.back(1.5)),
    });

    return (
      <div style={{ opacity, transform: `scale(${scale})` }}>
        {children}
      </div>
    );
  }

  if (type === "slide") {
    const slideDistance = 50;
    const translations = {
      left: { x: -slideDistance, y: 0 },
      right: { x: slideDistance, y: 0 },
      up: { x: 0, y: slideDistance },
      down: { x: 0, y: -slideDistance },
    };

    const { x: startX, y: startY } = translations[direction];

    const translateX = interpolate(adjustedFrame, [0, duration], [startX, 0], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.out(Easing.cubic),
    });

    const translateY = interpolate(adjustedFrame, [0, duration], [startY, 0], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.out(Easing.cubic),
    });

    return (
      <div
        style={{
          opacity,
          transform: `translate(${translateX}px, ${translateY}px)`,
        }}
      >
        {children}
      </div>
    );
  }

  return <>{children}</>;
};

/**
 * シーン間のトランジション（フェード）
 */
interface SceneTransitionProps {
  progress: number; // 0-1
  fadeInDuration?: number; // 0-1
  fadeOutDuration?: number; // 0-1
  children: React.ReactNode;
}

export const SceneTransition: React.FC<SceneTransitionProps> = ({
  progress,
  fadeInDuration = 0.1,
  fadeOutDuration = 0.1,
  children,
}) => {
  let opacity = 1;

  if (progress < fadeInDuration) {
    opacity = progress / fadeInDuration;
  } else if (progress > 1 - fadeOutDuration) {
    opacity = (1 - progress) / fadeOutDuration;
  }

  return <div style={{ opacity: Math.min(1, Math.max(0, opacity)) }}>{children}</div>;
};
