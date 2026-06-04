import styled, { css } from "styled-components/native";
import { Expense } from "../../types/expenses.type";
import React, { memo, useRef } from "react";
import Label from "../Label/Label";
import FontAwesomeIcon from "../FontAwesomeIcon/FontAwesomeIcon";
import Animated, {
  runOnJS,
  useAnimatedReaction,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import Pressable from "../Pressable/Pressable";
import Swipeable, {
  SwipeableMethods,
  SwipeableProps,
} from "react-native-gesture-handler/ReanimatedSwipeable";
import { Platform, View } from "react-native";
import currency from "../../helpers/numberCurrency";
import * as Haptics from "expo-haptics";
import { useSetIsScrollEnabled } from "../../hooks/useAppStore";

type ItemProps = {
  item: {
    id: Expense["id"];
    description: React.ReactNode;
    amount: Expense["amount"];
    progressPaid: React.ReactNode;
  };
  type: Expense["type"];
  onDeletePress: (id: Expense["id"]) => void;
  setExpenseId: React.Dispatch<React.SetStateAction<Expense["id"] | undefined>>;
  setEditExpenseModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
  setInfoModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
};

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const Style_Item = styled(AnimatedPressable)`
  overflow: hidden;
  ${({ theme }) => css`
    padding-block: ${theme.size.m.px};
    background-color: ${theme.color.surface};
    border-radius: ${(theme.size.s.value / 2) * 16}px;
  `}
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const Style_DeleteAction = styled(Animated.View)`
  justify-content: center;
  align-items: center;
  width: 100%;
  ${({ theme }) => css`
    background-color: ${theme.color.danger};
    padding-inline: ${theme.size.xxl.px};
    border-radius: ${(theme.size.s.value / 2) * 16}px;
  `}
`;

const Style_EditAction = styled(Style_DeleteAction)`
  ${({ theme }) => css`
    background-color: ${theme.color.textSecondary};
    padding-inline: ${theme.size.xxl.px};
    border-radius: ${(theme.size.s.value / 2) * 16}px;
  `}
`;

const Item = ({
  item: { id, description, amount, progressPaid },
  type,
  onDeletePress,
  setExpenseId,
  setEditExpenseModalVisible,
  setInfoModalVisible,
}: ItemProps) => {
  const threshold = 200;
  const ref = useRef<SwipeableMethods>(null);
  const height = useSharedValue<number | undefined>(undefined);
  const setIsScrollEnabled = useSetIsScrollEnabled();

  const renderRightActions: SwipeableProps["renderRightActions"] = (
    progress,
    translation,
  ) => {
    useAnimatedReaction(
      () => translation.value,
      (prepared, previous) => {
        if (prepared > 0) return;
        if (
          previous &&
          Math.abs(previous) < threshold &&
          Math.abs(prepared) >= threshold
        ) {
          Platform.OS === "android"
            ? runOnJS(Haptics.performAndroidHapticsAsync)(
                Haptics.AndroidHaptics.Confirm,
              )
            : runOnJS(Haptics.impactAsync)(Haptics.ImpactFeedbackStyle.Light);
        }
      },
      [],
    );
    return (
      <Style_DeleteAction>
        <FontAwesomeIcon icon="trash" color="surface" />
      </Style_DeleteAction>
    );
  };

  const renderLeftActions: SwipeableProps["renderLeftActions"] = (
    progress,
    translation,
  ) => {
    useAnimatedReaction(
      () => translation.value,
      (prepared, previous) => {
        if (prepared < 0) return;
        if (
          previous &&
          Math.abs(previous) < threshold &&
          Math.abs(prepared) >= threshold
        ) {
          Platform.OS === "android"
            ? runOnJS(Haptics.performAndroidHapticsAsync)(
                Haptics.AndroidHaptics.Confirm,
              )
            : runOnJS(Haptics.impactAsync)(Haptics.ImpactFeedbackStyle.Light);
        }
      },
      [],
    );
    return (
      <Style_EditAction>
        <FontAwesomeIcon icon="pen" color="surface" />
      </Style_EditAction>
    );
  };

  const onDelete = () => {
    onDeletePress(id);
    setEditExpenseModalVisible(false);
    setIsScrollEnabled(true);
  };

  const onPressItem = (id: string) => {
    setExpenseId(id);
    setEditExpenseModalVisible(true);
  };

  const onInfoPress = (id?: Expense["id"]) => {
    if (!id) return;
    setExpenseId(id);
    setInfoModalVisible(true);
  };

  const animatedStyle = useAnimatedStyle(() => ({
    height: withTiming(
      height.value!,
      {
        duration: 250,
      },
      () => {
        if (height.value === 0) runOnJS(onDelete)();
      },
    ),
  }));

  return (
    <Swipeable
      ref={ref}
      renderRightActions={type === "variable" ? renderRightActions : undefined}
      renderLeftActions={renderLeftActions}
      overshootRight={false}
      overshootLeft={false}
      rightThreshold={threshold}
      leftThreshold={threshold}
      containerStyle={[{ overflow: "hidden" }, animatedStyle]}
      onSwipeableOpenStartDrag={() => setIsScrollEnabled(false)}
      onSwipeableWillClose={() => setIsScrollEnabled(true)}
      onSwipeableWillOpen={(direction) => {
        if (direction === "left") {
          height.value = 0;
        } else if (direction === "right") {
          onPressItem(id);
          ref.current?.close();
        }
      }}
    >
      <Style_Item
        onLayout={(e) => {
          if (height.value !== 0) height.value = e.nativeEvent.layout.height;
        }}
        onPress={() => onInfoPress(id)}
      >
        <View style={{ flex: 1 }}>
          {description}
          <Label weight="bold">{currency(amount)}</Label>
        </View>
        {type === "fixed" && progressPaid}
      </Style_Item>
    </Swipeable>
  );
};

export default memo(Item);
