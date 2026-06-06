import React from "react";
import Animated, {
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import styled, { css, useTheme } from "styled-components/native";

type StepsProps = {
  count: number;
  currentCount?: number;
};

type StepProps = {
  active: boolean;
  current?: boolean;
};

const Style_StepsContainer = styled.View`
  display: flex;
  flex-direction: row;
  align-items: center;
  ${({ theme }) => css`
    gap: ${theme.size.s.px};
  `}
`;

const Style_Step = styled(Animated.View)`
  ${({ theme }) => css`
    min-width: 4px;
    height: 4px;
    border-radius: ${theme.size.s.px};
  `}
`;

const Step = ({ active, current }: StepProps) => {
  const theme = useTheme();
  const animatedStyle = useAnimatedStyle(() => {
    return {
      backgroundColor: withTiming(
        current
          ? theme.color.primary
          : active
            ? theme.color.textSecondary
            : theme.color.lightTransparency,
        { duration: 300 },
      ),
      flex: withTiming(current ? 1 : 0.25, { duration: 300 }),
    };
  });
  return <Style_Step style={animatedStyle} />;
};

const Steps = ({ count, currentCount }: StepsProps) => {
  return (
    <Style_StepsContainer>
      {Array.from({ length: count }, (_, i) => (
        <Step
          key={i}
          active={currentCount ? i < currentCount : false}
          current={currentCount ? i === currentCount - 1 : false}
        />
      ))}
    </Style_StepsContainer>
  );
};

export default Steps;
