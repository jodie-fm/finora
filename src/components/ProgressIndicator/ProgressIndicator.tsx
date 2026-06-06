import { Host } from "@expo/ui";
import { LinearProgressIndicator } from "@expo/ui/jetpack-compose";
import { ProgressView } from "@expo/ui/swift-ui";
import { tint } from "@expo/ui/swift-ui/modifiers";
import { Platform } from "react-native";
import styled, { DefaultTheme } from "styled-components/native";

type ProgressIndicatorProps = {
  /** The progress value, ranging from 0 to 1. If undefined, the progress indicator will be indeterminate. */
  progress?: number;
  /** The color of the progress indicator. */
  color?: keyof DefaultTheme["color"];
  /** The color of the track (background) of the progress indicator. (Android only) */
  trackColor?: keyof DefaultTheme["color"];
  /** Configuration for drawing a stop indicator. (Android only) */
  drawStopIndicator?: {
    stopSize: number;
  };
};

type Style_ProgressProps = {
  $color?: keyof DefaultTheme["color"];
  $trackColor?: keyof DefaultTheme["color"];
  $drawStopIndicator?: {
    stopSize: number;
  };
};

const Style_ProgressJetpack = styled(
  LinearProgressIndicator,
).attrs<Style_ProgressProps>(
  ({ theme, $color, $trackColor, $drawStopIndicator }) => {
    return {
      color: $color ? theme.color[$color] : theme.color.primary,
      trackColor: $trackColor
        ? theme.color[$trackColor]
        : theme.color.lightTransparency,
      drawStopIndicator: $drawStopIndicator || {
        stopSize: 0,
      },
    };
  },
)``;

const Style_ProgressSwift = styled(ProgressView).attrs<Style_ProgressProps>(
  ({ theme, $color: color }) => {
    return {
      modifiers: [tint(color ? theme.color[color] : theme.color.primary)],
    };
  },
)``;

const ProgressIndicator = ({
  progress,
  color,
  trackColor,
  drawStopIndicator,
}: ProgressIndicatorProps) => {
  return Platform.OS === "android" ? (
    <Host matchContents={{ vertical: true }}>
      <Style_ProgressJetpack
        progress={progress}
        $color={color}
        $trackColor={trackColor}
        $drawStopIndicator={drawStopIndicator}
      />
    </Host>
  ) : (
    <Host style={{ flex: 1 }}>
      <Style_ProgressSwift value={progress} $color={color} />
    </Host>
  );
};

export default ProgressIndicator;
