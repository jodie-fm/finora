import { CurveType, LineChart, lineDataItem, yAxisSides } from 'react-native-gifted-charts';
import { Key, useEffect, useMemo, useState } from 'react';
import listLastExpenseByDay from '../../helpers/listLastExpenseByDay';
import { useExpenseEventHandler } from '../../hooks/useExpenseEventHandler';
import { useChartStyle } from '../../hooks/useChartStyle';
import Label from '../Label/Label';
import Presets from '../Presets/Presets';
import { View } from 'react-native';
import RowView from '../RowView/RowView';
import numberCurrency from '../../helpers/numberCurrency';
import DotLight from '../DotLight/DotLight';
import Checkbox from '../Checkbox/Checkbox';
import styled, { css } from 'styled-components/native';
import { useIsFocused } from '@react-navigation/native';

const Style_GapContainer = styled.View`
  ${({ theme }) => css`
    gap: ${theme.size.s.px};
  `}
`;

const BalancesLineChart = () => {
  const isFocused = useIsFocused();
  const presetItems = [ {
    label: 'Aktueller Monat', key: 0
  }, {
    label: '2 Monate', key: 1
  }, {
    label: '3 Monate', key: 2
  } ];
  const [ selectedPreset, setSelectedPreset ] = useState<Key>(presetItems[0].key);
  const [ currentPointDatas, setCurrentPointDatas ] = useState<{
    remainingBalanceLineData: lineDataItem; balanceLineData: lineDataItem
  } | undefined>();
  const [ remainingBalanceLineData, setRemainingBalanceLineData ] = useState<lineDataItem[]>([]);
  const [ balanceLineData, setBalanceLineData ] = useState<lineDataItem[]>([]);
  const [ parentWidth, setParentWidth ] = useState<number>(0);
  const [ isParentWidth, setIsParentWidth ] = useState<boolean>(false);

  const linechartStyle = useChartStyle();
  const { state, expenseEvents } = useExpenseEventHandler();
  const {
    lastEvents, startDate, today
  } = useMemo(() => listLastExpenseByDay(expenseEvents, Number(selectedPreset)), [ expenseEvents, selectedPreset ]);

  const averageDailyVariableExpense = useMemo(() => expenseEvents && expenseEvents
  ?.filter(event => event.expense?.type === 'variable' && event.action === 'added')
  ?.reduce((acc, event) => acc + event.expense!.amount, 0) / today.getDate(), [ expenseEvents, today ]);
  const daysUntilNegative = useMemo(() => state?.remainingBalance && averageDailyVariableExpense && state.remainingBalance / averageDailyVariableExpense, [ averageDailyVariableExpense, state?.remainingBalance ]);
  const dateUntilNegative = new Date(today);
  daysUntilNegative && dateUntilNegative.setDate(today.getDate() + daysUntilNegative);

  // Set visual line data (remainingbalance data vs. currentbalance data)
  useEffect(() => {
    setRemainingBalanceLineData(lastEvents.map(({ remainingBalance }, i) => {
      const indexDate = new Date(startDate);
      indexDate.setDate(startDate.getDate() + i);
      // @ts-ignore
      const isCurrentStrip = currentPointDatas?.remainingBalanceLineData?.date === indexDate.toISOString();
      const showLabel = indexDate.getDate() === 1 || indexDate.getDate() % (6 * (Number(selectedPreset) + 1)) === 0;

      return {
        value: remainingBalance,
        date: indexDate.toISOString(),
        verticalLineThickness: 1,
        showVerticalLine: isCurrentStrip,
        labelTextStyle: {
          ...linechartStyle.xAxisLabelTextStyle, display: showLabel || isCurrentStrip ? 'flex' : 'none',
          transform: [{translateY: isCurrentStrip ? '100%' : 0}],
        },
        label: showLabel || isCurrentStrip ? Intl.DateTimeFormat(undefined, {
          day: '2-digit', month: '2-digit'
        })
        .format(indexDate) : undefined
      };
    }));
    setBalanceLineData(lastEvents.map(({ balance }) => ({
      value: balance?.amount,
    })));
  }, [ isParentWidth, lastEvents, currentPointDatas ]);

  useEffect(() => {
    if (isFocused) return;
    setIsParentWidth(false);
  }, [ isFocused ]);

  return <Style_GapContainer>
    <Label size="s" color="textSecondary" align="center">{Intl.DateTimeFormat(undefined, {
      day: '2-digit', month: '2-digit'
    })
    .format(startDate)} - {Intl.DateTimeFormat(undefined, { dateStyle: 'medium' })
    .format(today)}</Label>
    <Presets items={presetItems} selectedKey={selectedPreset} setSelectedKey={setSelectedPreset} />
    {currentPointDatas?.remainingBalanceLineData && currentPointDatas.balanceLineData && <View>
      <Label>Datenpunkt</Label>
      <RowView justifyContent="space-between">
        <Label size="s" color="textSecondary">Datum</Label>
        <Label
          size="s"
          weight="bold"
        >{Intl.DateTimeFormat(undefined, {
          day: '2-digit', month: '2-digit'
        })
        // @ts-ignore
        .format(new Date(currentPointDatas.remainingBalanceLineData.date))}</Label>
      </RowView>
      <RowView justifyContent="space-between">
        <Label size="s" color="textSecondary">Aktueller Saldo</Label>
        <Label size="s" color="textSecondary" weight="bold">{numberCurrency(currentPointDatas.balanceLineData.value)}</Label>
      </RowView>
      <RowView justifyContent="space-between">
        <Label size="s" color="textSecondary">Restsaldo</Label>
        <Label
          size="s"
          color="primary"
          weight="bold"
        >{numberCurrency(currentPointDatas?.remainingBalanceLineData?.value)}</Label>
      </RowView></View>}
    <View style={{ overflow: 'hidden' }} onLayout={e => setParentWidth(e.nativeEvent.layout.width)}>
      <LineChart
        {...linechartStyle}
        data={remainingBalanceLineData}
        data2={balanceLineData}
        width={parentWidth - 60}
        parentWidth={parentWidth - 20}
        adjustToWidth={isParentWidth}
        noOfSections={5}
        yAxisLabelSuffix=" €"
        endSpacing={!isParentWidth ? 10 : 0}
        initialSpacing={2}
        yAxisSide={yAxisSides.LEFT}
        disableScroll={isParentWidth}
        maxValue={Math.max(...balanceLineData.map(d => d.value || 0), ...remainingBalanceLineData.map(d => d.value || 0))}
        mostNegativeValue={Math.min(...balanceLineData.map(d => d.value || 0), ...remainingBalanceLineData.map(d => d.value || 0))}
        height={200}
        curveType={CurveType.QUADRATIC}
        areaChart
        hideDataPoints
        scrollToEnd
        labelsExtraHeight={25}
        getPointerProps={({ pointerIndex }: { pointerIndex: number }) => setCurrentPointDatas({
          remainingBalanceLineData: remainingBalanceLineData[pointerIndex],
          balanceLineData: balanceLineData[pointerIndex],
        })}
        pointerConfig={{
          ...linechartStyle.pointerConfig,
          activatePointersOnLongPress: true,
          persistPointer: true,
          showPointerStrip: false,
          radius: 4,
        }}
      />
    </View>
    <RowView gap="s" justifyContent="center">
      <DotLight color="lightTransparency" /><Label size="s" color="textSecondary">Saldo</Label>
      <DotLight color="primary" /><Label size="s" color="textSecondary">Restsaldo</Label>
    </RowView>
    <Checkbox isActive={isParentWidth} setIsActive={setIsParentWidth}><Label size="s">Graph
      minimieren</Label></Checkbox>
  </Style_GapContainer>;
};

export default BalancesLineChart;