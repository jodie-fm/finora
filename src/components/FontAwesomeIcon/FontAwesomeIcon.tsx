import styled, { css, DefaultTheme } from "styled-components/native";
import { FontAwesomeIcon as RNFontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { ComponentProps } from "react";

type FontAwesomeIconProps = Omit<
  ComponentProps<typeof RNFontAwesomeIcon>,
  "color" | "size"
> & {
  color?: keyof DefaultTheme["color"];
  size?: keyof DefaultTheme["size"];
  translateY?: number;
};

type StyleFontAwesomeIconProps = {
  $color: NonNullable<FontAwesomeIconProps["color"]>;
  $size: NonNullable<FontAwesomeIconProps["size"]>;
  $translateY: FontAwesomeIconProps["translateY"];
};

const Style_FontAwesomeIcon = styled(
  RNFontAwesomeIcon,
).attrs<StyleFontAwesomeIconProps>(({ theme, $color, $size }) => ({
  color: theme.color[$color],
  size: theme.size[$size].value * 16,
}))`
  ${({ $translateY }) =>
    $translateY &&
    css`
      transform: translateY(3px);
    `}
`;

const FontAwesomeIcon = ({
  color = "textPrimary",
  size = "m",
  translateY,
  ...rest
}: FontAwesomeIconProps) => {
  return (
    <Style_FontAwesomeIcon
      $color={color}
      $size={size}
      $translateY={translateY}
      {...rest}
      mask="360-degrees"
    />
  );
};

export default FontAwesomeIcon;
