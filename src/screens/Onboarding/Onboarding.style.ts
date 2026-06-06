import styled, { css } from "styled-components/native";

export const Style_Gap = styled.View`
  ${({ theme }) => css`
    gap: ${theme.size.m.px};
  `}
`;

export const Style_Features = styled(Style_Gap)`
  flex: 1;
  ${({ theme }) => css`
    gap: ${theme.size.m.px};
  `}
`;

export const Style_Hero = styled(Style_Features)`
  flex: 1;
  justify-content: center;
`;
