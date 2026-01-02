import React from "react";
import { useCurrentFrame, interpolate, Easing, AbsoluteFill } from "remotion";

/**
 * 暗転トランジション
 */
interface BlackoutProps {
  /** 開始フレーム */
  startFrame: number;
  /** 暗転の長さ（フレーム数） */
  duration?: number;
  /** 暗転の色 */
  color?: string;
}

export const Blackout: React.FC<BlackoutProps> = ({
  startFrame,
  duration = 6,
  color = "#000000",
}) => {
  const frame = useCurrentFrame();

  // 暗転範囲外なら非表示
  if (frame < startFrame || frame > startFrame + duration) {
    return null;
  }

  const progress = (frame - startFrame) / duration;

  // 0→0.5で暗転、0.5→1で明転
  const opacity =
    progress < 0.5
      ? interpolate(progress, [0, 0.5], [0, 1])
      : interpolate(progress, [0.5, 1], [1, 0]);

  return (
    <AbsoluteFill
      style={{
        backgroundColor: color,
        opacity,
        zIndex: 1000,
      }}
    />
  );
};

/**
 * フラッシュ効果
 */
interface FlashProps {
  startFrame: number;
  duration?: number;
  color?: string;
}

export const Flash: React.FC<FlashProps> = ({
  startFrame,
  duration = 4,
  color = "#FFFFFF",
}) => {
  const frame = useCurrentFrame();

  if (frame < startFrame || frame > startFrame + duration) {
    return null;
  }

  const progress = (frame - startFrame) / duration;
  const opacity = interpolate(progress, [0, 1], [0.8, 0], {
    easing: Easing.out(Easing.cubic),
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: color,
        opacity,
        zIndex: 1000,
      }}
    />
  );
};

/**
 * ズームイン効果（画面全体）
 */
interface ZoomEffectProps {
  children: React.ReactNode;
  startFrame: number;
  duration?: number;
  startScale?: number;
  endScale?: number;
}

export const ZoomEffect: React.FC<ZoomEffectProps> = ({
  children,
  startFrame,
  duration = 30,
  startScale = 1,
  endScale = 1.1,
}) => {
  const frame = useCurrentFrame();

  const scale = interpolate(
    frame,
    [startFrame, startFrame + duration],
    [startScale, endScale],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.out(Easing.cubic),
    }
  );

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        transform: `scale(${scale})`,
        transformOrigin: "center center",
      }}
    >
      {children}
    </div>
  );
};

/**
 * シェイク効果
 */
interface ShakeEffectProps {
  children: React.ReactNode;
  startFrame: number;
  duration?: number;
  intensity?: number;
}

export const ShakeEffect: React.FC<ShakeEffectProps> = ({
  children,
  startFrame,
  duration = 10,
  intensity = 5,
}) => {
  const frame = useCurrentFrame();

  if (frame < startFrame || frame > startFrame + duration) {
    return <>{children}</>;
  }

  const progress = (frame - startFrame) / duration;
  const decay = 1 - progress;

  // ランダムっぽい動きを生成（フレームベースで決定的）
  const offsetX = Math.sin(frame * 50) * intensity * decay;
  const offsetY = Math.cos(frame * 50) * intensity * decay;

  return (
    <div
      style={{
        transform: `translate(${offsetX}px, ${offsetY}px)`,
      }}
    >
      {children}
    </div>
  );
};

/**
 * パルス効果（強調時に使用）
 */
interface PulseEffectProps {
  children: React.ReactNode;
  startFrame: number;
  pulseCount?: number;
  pulseDuration?: number;
}

export const PulseEffect: React.FC<PulseEffectProps> = ({
  children,
  startFrame,
  pulseCount = 2,
  pulseDuration = 8,
}) => {
  const frame = useCurrentFrame();
  const totalDuration = pulseCount * pulseDuration;

  if (frame < startFrame || frame > startFrame + totalDuration) {
    return <>{children}</>;
  }

  const relativeFrame = frame - startFrame;
  const pulseProgress = (relativeFrame % pulseDuration) / pulseDuration;

  // サイン波でスケールを変化
  const scale = 1 + Math.sin(pulseProgress * Math.PI) * 0.05;

  return (
    <div
      style={{
        transform: `scale(${scale})`,
        transformOrigin: "center center",
      }}
    >
      {children}
    </div>
  );
};

/**
 * グラデーションオーバーレイ（上下に暗くする）
 */
interface GradientOverlayProps {
  /** 上部のグラデーション強度（0-1） */
  topIntensity?: number;
  /** 下部のグラデーション強度（0-1） */
  bottomIntensity?: number;
}

export const GradientOverlay: React.FC<GradientOverlayProps> = ({
  topIntensity = 0.3,
  bottomIntensity = 0.5,
}) => {
  return (
    <>
      {/* 上部グラデーション */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "30%",
          background: `linear-gradient(to bottom, rgba(0,0,0,${topIntensity}), transparent)`,
          zIndex: 50,
          pointerEvents: "none",
        }}
      />
      {/* 下部グラデーション */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: "40%",
          background: `linear-gradient(to top, rgba(0,0,0,${bottomIntensity}), transparent)`,
          zIndex: 50,
          pointerEvents: "none",
        }}
      />
    </>
  );
};

/**
 * プログレスバー（動画の進行状況）
 */
interface ProgressBarProps {
  progress: number; // 0-1
  color?: string;
  height?: number;
  position?: "top" | "bottom";
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  color = "linear-gradient(90deg, #667eea 0%, #764ba2 100%)",
  height = 4,
  position = "bottom",
}) => {
  const positionStyle = position === "top" ? { top: 0 } : { bottom: 0 };

  return (
    <div
      style={{
        position: "absolute",
        ...positionStyle,
        left: 0,
        width: "100%",
        height,
        backgroundColor: "rgba(255, 255, 255, 0.2)",
        zIndex: 200,
      }}
    >
      <div
        style={{
          width: `${progress * 100}%`,
          height: "100%",
          background: color,
        }}
      />
    </div>
  );
};
