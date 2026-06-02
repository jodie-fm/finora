import styled from "styled-components/native";
import * as Haptics from "expo-haptics";
import { Platform } from "react-native";

const Pressable = styled.Pressable.attrs(({ theme, onPress }) => ({
  android_ripple: {
    color: theme.color.lightTransparency,
  },
  hitSlop: theme.size.s.value * 16,
  onPress: async (ev) => {
    if (Platform.OS === "android") {
      await Haptics.performAndroidHapticsAsync(Haptics.AndroidHaptics.Confirm);
    } else {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    onPress && onPress(ev);
  },
}))``;

export default Pressable;
