import { useTheme } from 'styled-components/native';

export const useChartStyle = () => {
  const theme = useTheme();
  return {
    dataPointsColor1: theme.color.primary,
    color1: theme.color.primary,
    color2: theme.color.lightTransparency,
    startOpacity2: 0,
    strokeDashArray2: [ 6, 6 ],
    dataPointsColor2: theme.color.primary,
    focusedDataPointColor: theme.color.primary,
    startFillColor: theme.color.primary,
    endFillColor: theme.color.background,
    endOpacity: 0,
    yAxisColor: theme.color.lightTransparency,
    xAxisColor: theme.color.lightTransparency,
    rulesColor: theme.color.lightTransparency,
    verticalLinesColor: theme.color.lightTransparency,
    yAxisTextStyle: {
      color: theme.color.textSecondary,
      fontSize: theme.size.s.value * 12,
    },
    xAxisLabelTextStyle: {
      color: theme.color.textSecondary,
      fontSize: theme.size.s.value * 12,
    },
    pointerConfig: {
      pointerColor: theme.color.primary,
    },


    capColor: theme.color.danger,
    //gradientColor: theme.color.primaryActive
  };
};