import React, { memo, useEffect, useRef, useState } from "react";
import { Animated, View } from "react-native";
import BaseCard from "../../components/BaseCard/BaseCard";
import ProgressIndicator from "../../components/ProgressIndicator/ProgressIndicator";
import styled, { css } from "styled-components/native";
import Label from "../../components/Label/Label";
import { Keys } from "./slides/Slides.type";

type MockUpdatesProps = {
  /** Index associated with the current slide */
  index: Keys;
  /** Key of the currently active slide */
  activeKey: Keys;
};

const Style_Gap = styled.View`
  ${({ theme }) => css`
    gap: ${theme.size.m.px};
  `}
`;

const MockUpdates = ({ index, activeKey }: MockUpdatesProps) => {
  const animatedExpenseProgress = useRef(new Animated.Value(0.75)).current;
  const animatedRemainingProgress = useRef(new Animated.Value(0.25)).current;
  const [expense, setExpense] = useState(0.75);
  const [remaining, setRemaining] = useState(0.25);

  const percentFormat = Intl.NumberFormat(undefined, {
    style: "percent",
    maximumFractionDigits: 0,
  });

  const startAnimationExpense = (toValue: number) => {
    Animated.timing(animatedExpenseProgress, {
      toValue: toValue,
      delay: 500,
      duration: 1000,
      useNativeDriver: false,
    }).start();
  };
  const startAnimationRemaining = (toValue: number) => {
    Animated.timing(animatedRemainingProgress, {
      toValue: toValue,
      delay: 500,
      duration: 1000,
      useNativeDriver: false,
    }).start();
  };

  useEffect(() => {
    const listenerId = animatedExpenseProgress.addListener(({ value }) =>
      setExpense(value),
    );
    const remainingListenerId = animatedRemainingProgress.addListener(
      ({ value }) => setRemaining(value),
    );

    return () => {
      animatedExpenseProgress.removeListener(listenerId);
      animatedRemainingProgress.removeListener(remainingListenerId);
    };
  }, [animatedExpenseProgress, animatedRemainingProgress]);

  useEffect(() => {
    if (activeKey === index) {
      startAnimationExpense(0.25);
    } else {
      startAnimationExpense(0.75);
      startAnimationRemaining(0.25);
    }
  }, [activeKey, index]);

  useEffect(() => {
    if (expense !== 0.25) return;
    startAnimationRemaining(0.75);
  }, [expense]);

  return (
    <BaseCard>
      <Style_Gap>
        <View>
          <Label size="m" weight="bold">
            Kosten
          </Label>
          <ProgressIndicator
            progress={expense}
            color="danger"
            trackColor="background"
          />
          <Label size="s" color="textSecondary">
            Deine Kosten betragen {percentFormat.format(expense)} deines
            aktuellen Saldos.
          </Label>
        </View>
        <View>
          <Label size="m" weight="bold">
            Restsaldo
          </Label>
          <ProgressIndicator
            progress={remaining}
            color="success"
            trackColor="background"
          />
          <Label size="s" color="textSecondary">
            Dein Restsaldo beträgt {percentFormat.format(remaining)} deines
            aktuellen Saldos.
          </Label>
        </View>
      </Style_Gap>
    </BaseCard>
  );
};

export default memo(MockUpdates);
