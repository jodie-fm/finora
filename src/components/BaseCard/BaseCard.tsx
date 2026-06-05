import React from "react";
import styled, { css } from "styled-components/native";

type BaseCardProps = {
  children?: React.ReactNode;
  padding?: string;
};

const Style_BaseCard = styled.View<{ $padding?: BaseCardProps["padding"] }>`
  display: flex;
  position: relative;
  ${({ theme, $padding }) => css`
    background-color: ${theme.color.surface};
    padding: ${$padding ? $padding : theme.size.l.px};
    border-radius: ${theme.size.s.px};
  `}
`;

const BaseCard = ({ children, padding }: BaseCardProps) => {
  return <Style_BaseCard $padding={padding}>{children}</Style_BaseCard>;
};

export default BaseCard;
