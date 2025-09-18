import React from 'react';
import styled, { css, DefaultTheme, useTheme } from 'styled-components/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ParamListBase, useNavigation } from '@react-navigation/native';
import Button from '../components/Button/Button';
import FontAwesomeIcon from '../components/FontAwesomeIcon/FontAwesomeIcon'
import Label from "../components/Label/Label";
import { View } from "react-native";
import { Screens } from "../constants/Screens";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

type Layout01Props = {
  children?: React.ReactNode; title?: string; onCTAClick?: () => void;
}

const Style_SafeView = styled.View`
  display: flex;
  flex: 1;
  ${({ theme }) => css`
    background-color: ${theme.color.background};
  `}
`;

const Style_Layout01 = styled.View`
  display: flex;
  flex: 1;
  flex-direction: column;
  ${({ theme }) => css`
    gap: ${theme.size.l.px};
    padding-bottom: 0;
  `}
`;

const Style_TopActions = styled.View`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  ${({ theme }) => css`
    padding: ${theme.size.l.px};
    padding-bottom: 0;
  `}
`;

const Style_BottomBar = styled.View`
  display: grid;
  flex-direction: row;
  justify-content: stretch;
  align-items: center;
  ${({ theme }) => css`
    background-color: ${theme.color.surface};
    margin-top: -${theme.size.l.px};
    border-top-left-radius: ${theme.size.l.px};
    border-top-right-radius: ${theme.size.l.px};
  `}
`;

const Style_BottomBarNavItem = styled.Pressable`
  flex: 1;
  align-items: center;
  justify-content: center;
  ${({ theme }) => css`
    padding-inline: ${theme.size.s.px};
    padding-block: ${theme.size.l.px};
    gap: ${theme.size.s.px};
  `}
`
const Style_CTAButton = styled.View`
  bottom: 75%;
  height: 1px;
`

const Layout01 = ({
  children,
  title,
  onCTAClick
}: Layout01Props) => {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();

  const onHomePress = () => {
    navigation.navigate('Home', undefined,{ pop: true});
  }

  const onLoanFundsPress = () => {
    navigation.navigate('LoanFunds', undefined,{ pop: title !== Screens.HOME })
  }

  const onAnalyticsPress = () => {
    navigation.navigate('Analytics', undefined,{ pop: title === Screens.SETTINGS });
  }

  const onSettingsPress = () => {
    navigation.navigate('Settings')
  }

  const getColor = (routeName: string): keyof DefaultTheme['color'] => title === routeName ?
    'primary' :
    'textSecondary';

  const Style_BottomBarLeft = <>
    <Style_BottomBarNavItem onPress={onHomePress}>
      <FontAwesomeIcon
        color={getColor(Screens.HOME)}
        icon="home"
      />
    </Style_BottomBarNavItem>
    <Style_BottomBarNavItem onPress={onLoanFundsPress}>
      <FontAwesomeIcon
        color={getColor(Screens.LOANFUNDS)}
        icon="hand-holding-dollar"
      />
    </Style_BottomBarNavItem>
  </>;

  const Style_BottomBarRight = <>
    <Style_BottomBarNavItem onPress={onAnalyticsPress}>
      <FontAwesomeIcon
        color={getColor(Screens.ANALYTICS)}
        icon="chart-line"
      />
    </Style_BottomBarNavItem>
    <Style_BottomBarNavItem onPress={onSettingsPress}>
      <FontAwesomeIcon
        color={getColor(Screens.SETTINGS)}
        icon="cog"
      />
    </Style_BottomBarNavItem>
  </>;

  return (<Style_SafeView
    style={{
      paddingTop: insets.top,
      paddingLeft: insets.left,
      paddingRight: insets.right,
    }}
  >
    <Style_Layout01>
      <Style_TopActions>
        <View>
          {title && <Label size="l" weight="bold">{title}</Label>}
        </View>
      </Style_TopActions>
      {children}
      <Style_BottomBar
        style={{
          paddingBottom: insets.bottom,
          boxShadow: [
            {
              color: theme.color.textSecondary,
              offsetX: 0,
              offsetY: 10,
              blurRadius: 20,
              spreadDistance: -5,
            }
          ]
        }}
      >
        {Style_BottomBarLeft}
        {onCTAClick && <Style_CTAButton>
          <Button type="primary" padding="l" onPress={onCTAClick}>
            <FontAwesomeIcon
              color="surface"
              size="l"
              icon="plus"
            />
          </Button>
        </Style_CTAButton>}
        {Style_BottomBarRight}
      </Style_BottomBar>
    </Style_Layout01>
  </Style_SafeView>);
};

export default Layout01;