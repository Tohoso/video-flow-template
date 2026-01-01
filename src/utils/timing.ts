import type { Scene } from "./schema";

/**
 * シーンの開始フレームを計算
 */
export function getSceneStartFrame(scenes: Scene[], sceneIndex: number, fps: number): number {
  let startFrame = 0;
  for (let i = 0; i < sceneIndex; i++) {
    startFrame += Math.ceil((scenes[i]?.duration || 5) * fps);
  }
  return startFrame;
}

/**
 * シーンのフレーム数を計算
 */
export function getSceneDurationInFrames(scene: Scene, fps: number): number {
  return Math.ceil((scene.duration || 5) * fps);
}

/**
 * 現在のフレームがどのシーンに属するかを判定
 */
export function getCurrentSceneIndex(
  scenes: Scene[],
  currentFrame: number,
  fps: number
): number {
  let accumulatedFrames = 0;
  for (let i = 0; i < scenes.length; i++) {
    const sceneDuration = getSceneDurationInFrames(scenes[i], fps);
    if (currentFrame < accumulatedFrames + sceneDuration) {
      return i;
    }
    accumulatedFrames += sceneDuration;
  }
  return scenes.length - 1;
}

/**
 * シーン内での相対フレーム位置を取得
 */
export function getRelativeFrame(
  scenes: Scene[],
  currentFrame: number,
  sceneIndex: number,
  fps: number
): number {
  const startFrame = getSceneStartFrame(scenes, sceneIndex, fps);
  return currentFrame - startFrame;
}

/**
 * シーン内での進行度（0-1）を取得
 */
export function getSceneProgress(
  scenes: Scene[],
  currentFrame: number,
  sceneIndex: number,
  fps: number
): number {
  const relativeFrame = getRelativeFrame(scenes, currentFrame, sceneIndex, fps);
  const sceneDuration = getSceneDurationInFrames(scenes[sceneIndex], fps);
  return Math.min(1, Math.max(0, relativeFrame / sceneDuration));
}

/**
 * イージング関数: easeInOut
 */
export function easeInOut(t: number): number {
  return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
}

/**
 * イージング関数: easeOut
 */
export function easeOut(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}

/**
 * フェードイン/アウトの不透明度を計算
 */
export function getFadeOpacity(
  progress: number,
  fadeInDuration: number = 0.1,
  fadeOutDuration: number = 0.1
): number {
  if (progress < fadeInDuration) {
    return easeOut(progress / fadeInDuration);
  }
  if (progress > 1 - fadeOutDuration) {
    return easeOut((1 - progress) / fadeOutDuration);
  }
  return 1;
}
