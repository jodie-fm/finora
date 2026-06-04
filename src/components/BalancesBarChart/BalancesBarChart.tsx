import { BarChart } from "react-native-gifted-charts";
import { useChartStyle } from "../../hooks/useChartStyle";
import { View } from "react-native";
import { useMemo, useState } from "react";
import { useExpenseEvents } from "../../hooks/useExpenseEventHandler";
import Label from "../Label/Label";
import currency from "../../helpers/numberCurrency";
import styled, { css, useTheme } from "styled-components/native";
import RowView from "../RowView/RowView";
import DotLight from "../DotLight/DotLight";
import getBalancesEndOfMonth from "../../helpers/getBalancesEndOfMonth";

const Style_GapContainer = styled.View`
  ${({ theme }) => css`
    gap: ${theme.size.s.px};
  `}
`;

const BalancesBarChart = () => {
  const theme = useTheme();
  const [parentWidth, setParentWidth] = useState<number>(0);
  const chartStyle = useChartStyle();

  const expenseEvents = useExpenseEvents();
  const monthFormatter = useMemo(
    () =>
      Intl.DateTimeFormat(undefined, {
        month: "2-digit",
        year: "2-digit",
      }),
    [],
  );

  const balancesEndOfMonth = useMemo(
    () => getBalancesEndOfMonth(expenseEvents),
    [expenseEvents],
  );

  const stackData = useMemo(
    () =>
      balancesEndOfMonth.map((entry) => ({
        stacks: [
          {
            value: entry.remainingBalance || 0,
            gradientColor: theme.color.primary,
          },
        ],
        label: monthFormatter.format(entry.date),
        color: "transparent",
        labelTextStyle: chartStyle.xAxisLabelTextStyle,
        topLabelComponent: () => (
          <Label size="s" color="textSecondary">
            {currency(entry.remainingBalance)}
          </Label>
        ),
      })),
    [balancesEndOfMonth, chartStyle.xAxisLabelTextStyle, monthFormatter, theme.color.primary],
  );

  return (
    <Style_GapContainer>
      <View onLayout={(e) => setParentWidth(e.nativeEvent.layout.width)}>
        <BarChart
          {...chartStyle}
          // visualize the remaining balance of the end of each occuring month in the data
          width={parentWidth - 60}
          height={200}
          parentWidth={parentWidth - 20}
          yAxisExtraHeight={40}
          stackData={stackData}
          barWidth={70}
          yAxisLabelSuffix={" €"}
          pointerConfig={undefined}
          showGradient
          isAnimated
          scrollToEnd
          noOfSections={6}
        />
      </View>

      <RowView gap="s" justifyContent="center">
        <DotLight color="primary" />
        <Label size="s" color="textSecondary">
          Restsaldo
        </Label>
      </RowView>
    </Style_GapContainer>
  );
};
export default BalancesBarChart;
