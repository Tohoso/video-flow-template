import { Config } from "@remotion/cli/config";

Config.setVideoImageFormat("jpeg");
Config.setOverwriteOutput(true);
Config.setConcurrency(4);

// 出力品質設定
Config.setJpegQuality(80);

// キャッシュ設定
Config.setCachingEnabled(true);
