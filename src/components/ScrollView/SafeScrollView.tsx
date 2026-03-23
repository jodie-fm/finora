import styled, { css } from "styled-components/native";

const SafeScrollView = styled.ScrollView.attrs(({ theme }) => {
  return {
    contentContainerStyle: {
      gap: theme.size.l.value * 16,
    },
  };
})`
  display: flex;
  flex: 1;
  flex-direction: column;
  ${({ theme }) => css`
    padding-inline: ${theme.size.l.px};
  `}
`;

export default SafeScrollView;
