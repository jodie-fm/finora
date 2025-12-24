import { BarChart } from 'react-native-gifted-charts';
import { useChartStyle } from '../../hooks/useChartStyle';
import { View } from 'react-native';
import { useMemo, useState } from 'react';
import { useExpenseEventHandler } from '../../hooks/useExpenseEventHandler';
import { ExpenseEvent } from '../../types/expenses.type';
import Label from '../Label/Label';
import numberCurrency from '../../helpers/numberCurrency';
import styled, { css, useTheme } from 'styled-components/native';
import Checkbox from '../Checkbox/Checkbox';
import RowView from '../RowView/RowView';
import DotLight from '../DotLight/DotLight';

const Style_GapContainer = styled.View`
  ${({ theme }) => css`
    gap: ${theme.size.s.px};
  `}
`;

const BalancesBarChart = () => {
  const theme = useTheme();
  const [ parentWidth, setParentWidth ] = useState<number>(0);
  const [ isBalance, setIsBalance ] = useState<boolean>(false);
  const chartStyle = useChartStyle();

  const {
    expenseEvents
  } = useExpenseEventHandler();

  const balancesEndOfMonth = useMemo(() => {
    if (!expenseEvents?.length) return [];

    const latestPerMonth = new Map<string, ExpenseEvent>();

    for (const event of expenseEvents) {
      if (!event.date) continue;

      const date = new Date(event.date);
      const key = `${date.getFullYear()}-${date.getMonth()}`;

      const existing = latestPerMonth.get(key);

      if (!existing || new Date(existing.date) < date) {
        latestPerMonth.set(key, event);
      }
    }

    return Array.from(latestPerMonth.values())
    .sort((a, b) => +new Date(a.date) - +new Date(b.date))
    .map(event => ({
      date: new Date(event.date), balance: event.balance, remainingBalance: event.remainingBalance,
    }));
  }, [ expenseEvents ]);

  return <Style_GapContainer><View onLayout={e => setParentWidth(e.nativeEvent.layout.width)}>
    <BarChart
      {...chartStyle}
      // visualize the remaining balance of the end of each occuring month in the data
      width={parentWidth - 60}
      height={200}
      parentWidth={parentWidth - 20}
      yAxisExtraHeight={40}
      stackData={balancesEndOfMonth.map((entry) => ({
        stacks: [ {
          value: entry.remainingBalance || 0, gradientColor: theme.color.primary,
        }, ...(isBalance ? [ {
          value: (entry.balance?.amount || 0) - (entry.remainingBalance || 0),
          gradientColor: theme.color.lightTransparency,
          marginBottom: 2
        } ] : []) ],
        label: Intl.DateTimeFormat(undefined, {
          month: '2-digit', year: '2-digit'
        })
        .format(entry.date),
        color: 'transparent',
        labelTextStyle: chartStyle.xAxisLabelTextStyle,
        topLabelComponent: () => <Label
          size="s"
          color="textSecondary"
        >{numberCurrency(isBalance ? entry.balance?.amount : entry.remainingBalance)}</Label>
      }))}
      barWidth={70}
      capThickness={4}
      yAxisLabelSuffix={' €'}
      frontColor="transparent"
      pointerConfig={undefined}
      cappedBars
      showGradient
      isAnimated
      scrollToEnd
      noOfSections={6}
    /></View>

    <RowView gap="s" justifyContent="center">
      {isBalance && <><DotLight color="lightTransparency" /><Label size="s" color="textSecondary">Saldo</Label></>}
      <DotLight color="primary" /><Label size="s" color="textSecondary">Restsaldo</Label>
    </RowView>
    <Checkbox isActive={isBalance} setIsActive={setIsBalance}>
      <Label size="s">Saldo darstellen</Label>
    </Checkbox></Style_GapContainer>;
};
export default BalancesBarChart;