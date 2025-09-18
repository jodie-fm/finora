import React, { ReactNode } from 'react';
import styled, { css, DefaultTheme } from 'styled-components/native';
import { PressableProps } from 'react-native';
import theme from '../../assets/style/theme';
import Pressable from "../Pressable/Pressable";
import * as Haptics from "expo-haptics";

type ButtonProps = PressableProps & {
  children?: ReactNode;
  type?: 'default' | 'primary' | 'danger';
  padding?: keyof typeof theme.size;
  size?: keyof typeof theme.size;
  isFullWidth?: boolean;
  onPress?: PressableProps['onPress'];
};

type Style_ButtonProps = {
  $type: ButtonProps['type'];
  $padding: NonNullable<ButtonProps['padding']>;
  $size: NonNullable<ButtonProps['padding']>;
  $isPressed: boolean;
}

type Style_ButtonContainerProps = {
  $isFullWidth: ButtonProps['isFullWidth'];
}

const handleButtonType = (type: ButtonProps['type'], theme: DefaultTheme, pressed: boolean) => {
  switch (type) {
    case 'primary':
      return css`
        background-color: ${pressed ? theme.color.primaryActive : theme.color.primary};
      `;
    case 'danger':
      return css`
        border: 1px ${theme.color.danger};
        background-color: #0000;
        elevation: 0.1;
        box-shadow: 0 0 10px ${pressed ? theme.color.danger : 'transparent'};
      `;
    default:
      return css`
        background-color: ${pressed ? theme.color.surfaceActive :theme.color.surface};
      `;
  }
};

const Style_ButtonContainer = styled.View<Style_ButtonContainerProps>`
  border-radius: 999px;
  overflow: hidden;
  ${({ $isFullWidth }) => $isFullWidth && css`
    flex: 1;
  `}
`;

const Style_Button = styled.View<Style_ButtonProps>`
  flex-direction: row;
  border-radius: 999px;
  align-items: center;
  justify-content: center;
  ${({
    theme,
    $type,
    $padding,
    $size,
    $isPressed
  }) => css`
    ${handleButtonType($type, theme, $isPressed)};
    font-size: ${theme.size[$size].px};
    padding: ${theme.size[$padding].px};
    gap: ${theme.size.s.value * 8}px;
  `}
`;

const Button = ({
  children,
  type = 'default',
  padding = 'm',
  size = 'xl',
  isFullWidth = false,
  onPress,
  ...rest
}: ButtonProps) => {
  return (<Style_ButtonContainer $isFullWidth={isFullWidth}>
    <Pressable hitSlop={0} onPress={async (ev) => {
      void Haptics.selectionAsync()
      onPress && onPress(ev);
    }} {...rest}>
      {({ pressed }) => (<Style_Button
        $type={type}
        $padding={padding}
        $size={size}
        $isPressed={pressed}
      >{children}</Style_Button>)}
    </Pressable>
  </Style_ButtonContainer>);
};

export default Button;