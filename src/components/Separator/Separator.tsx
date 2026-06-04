import styled, { css, DefaultTheme } from "styled-components/native";

type SeparatorProps = {
  space?: keyof DefaultTheme["size"] | "none";
  isFullWidth?: boolean;
};

type Style_SeparatorProps = {
  $space: NonNullable<SeparatorProps["space"]>;
  $isFullWidth: NonNullable<SeparatorProps["isFullWidth"]>;
};

const Style_Separator = styled.View<Style_SeparatorProps>`
  height: 1px;
  ${({ theme, $space, $isFullWidth }) => css`
    background-color: ${theme.color.lightTransparency};
    ${$space !== "none" &&
    css`
      margin-block: ${theme.size[$space].px};
    `};
    ${$isFullWidth &&
    css`
      flex: 1;
    `};
  `}
`;

const Separator = ({ space = "m", isFullWidth = false }: SeparatorProps) => {
  return <Style_Separator $space={space} $isFullWidth={isFullWidth} />;
};

export default Separator;
