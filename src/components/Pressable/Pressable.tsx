import styled from 'styled-components/native';
import * as Haptics from "expo-haptics";

const Pressable = styled.Pressable.attrs(({ theme, onPress }) => ({
  android_ripple: {
    color: theme.color.lightTransparency,
  },
  hitSlop: theme.size.s.value * 16,
  onPress: (ev) => {
    void Haptics.selectionAsync();
    onPress && onPress(ev);
  }
}))``;

export default Pressable;