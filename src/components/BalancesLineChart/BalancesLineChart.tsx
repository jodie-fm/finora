import {
  CurveType,
  LineChart,
  lineDataItem,
  yAxisSides,
} from "react-native-gifted-charts";
import { Key, useEffect, useMemo, useState } from "react";
import listLastExpenseByDay from "../../helpers/listLastExpenseByDay";
import {
  useExpenseEvents,
  useExpenseState,
} from "../../hooks/useExpenseEventHandler";
import { useChartStyle } from "../../hooks/useChartStyle";
import Label from "../Label/Label";
import Presets from "../Presets/Presets";
import { View } from "react-native";
import RowView from "../RowView/RowView";
import currency from "../../helpers/numberCurrency";
import DotLight from "../DotLight/DotLight";
import Checkbox from "../Checkbox/Checkbox";
import styled, { css } from "styled-components/native";
import { useIsFocused } from "@react-navigation/native";

const Style_GapContainer = styled.View`
  ${({ theme }) => css`
    gap: ${theme.size.s.px};
  `}
`;

type ChartLineDataItem = lineDataItem & {
  pointDate: string;
};

type ChartPointData = {
  remainingBalanceLineData: ChartLineDataItem;
  balanceLineData: lineDataItem;
};

const BalancesLineChart = () => {
  const isFocused = useIsFocused();
  const state = useExpenseState();
  const expenseEvents = useExpenseEvents();
  const presetItems = [
    {
      label: "Derzeit",
      key: 0,
    },
    {
      label: "3M",
      key: 3,
    },
    {
      label: "6M",
      key: 6,
    },
    {
      label: "Zu Beginn",
      key: expenseEvents
        ? Math.ceil(
            (new Date().getTime() - new Date(expenseEvents[0].date).getTime()) /
              (1000 * 60 * 60 * 24 * 30),
          )
        : 0,
    },
  ];
  const [selectedPreset, setSelectedPreset] = useState<Key>(presetItems[0].key);
  const [currentPointDatas, setCurrentPointDatas] = useState<ChartPointData>();
  const [parentWidth, setParentWidth] = useState<number>(0);
  const [isParentWidth, setIsParentWidth] = useState<boolean>(false);

  const linechartStyle = useChartStyle();
  const { lastEvents, startDate, today } = useMemo(
    () => listLastExpenseByDay(expenseEvents, Number(selectedPreset)),
    [expenseEvents, selectedPreset],
  );

  const averageDailyVariableExpense = useMemo(
    () =>
      expenseEvents &&
      expenseEvents
        ?.filter(
          (event) =>
            event.expense?.type === "variable" && event.action === "added",
        )
        ?.reduce((acc, event) => acc + event.expense!.amount, 0) /
        today.getDate(),
    [expenseEvents, today],
  );
  const daysUntilNegative = useMemo(
    () =>
      state?.remainingBalance &&
      averageDailyVariableExpense &&
      state.remainingBalance / averageDailyVariableExpense,
    [averageDailyVariableExpense, state?.remainingBalance],
  );
  const dateUntilNegative = new Date(today);
  daysUntilNegative &&
    dateUntilNegative.setDate(today.getDate() + daysUntilNegative);

  const axisDateFormatter = useMemo(
    () =>
      Intl.DateTimeFormat(undefined, {
        day: "2-digit",
        month: "2-digit",
      }),
    [],
  );
  const mediumDateFormatter = useMemo(
    () => Intl.DateTimeFormat(undefined, { dateStyle: "medium" }),
    [],
  );

  const currentPointDate = currentPointDatas?.remainingBalanceLineData.pointDate;

  const remainingBalanceLineData = useMemo<ChartLineDataItem[]>(
    () =>
      lastEvents.map(({ remainingBalance }, index) => {
        const indexDate = new Date(startDate);
        indexDate.setDate(startDate.getDate() + index);
        const pointDate = indexDate.toISOString();
        const isCurrentStrip = currentPointDate === pointDate;
        const showLabel =
          indexDate.getDate() === 1 ||
          indexDate.getDate() % (6 * (Number(selectedPreset) + 1)) === 0;

        return {
          value: remainingBalance,
          pointDate,
          verticalLineThickness: 1,
          showVerticalLine: isCurrentStrip,
          labelTextStyle: {
            ...linechartStyle.xAxisLabelTextStyle,
            display: showLabel || isCurrentStrip ? "flex" : "none",
            transform: [{ translateY: isCurrentStrip ? "100%" : 0 }],
          },
          label:
            showLabel || isCurrentStrip
              ? axisDateFormatter.format(indexDate)
              : undefined,
        };
      }),
    [
      axisDateFormatter,
      currentPointDate,
      lastEvents,
      linechartStyle.xAxisLabelTextStyle,
      selectedPreset,
      startDate,
    ],
  );

  const balanceLineData = useMemo<lineDataItem[]>(
    () =>
      lastEvents.map(({ balance }) => ({
        value: balance?.amount,
      })),
    [lastEvents],
  );

  const chartBounds = useMemo(() => {
    const values = [
      ...balanceLineData.map((data) => data.value || 0),
      ...remainingBalanceLineData.map((data) => data.value || 0),
    ];

    return {
      maxValue: Math.max(...values, 0),
      mostNegativeValue: Math.min(...values, 0),
    };
  }, [balanceLineData, remainingBalanceLineData]);

  useEffect(() => {
    if (isFocused) return;
    setIsParentWidth(false);
  }, [isFocused]);

  return (
    <Style_GapContainer>
      <Label size="s" color="textSecondary" align="center">
        {axisDateFormatter.format(startDate)}{" "}
        -{" "}
        {mediumDateFormatter.format(today)}
      </Label>
      <Presets
        items={presetItems}
        selectedKey={selectedPreset}
        setSelectedKey={setSelectedPreset}
      />
      {currentPointDatas?.remainingBalanceLineData &&
        currentPointDatas.balanceLineData && (
          <View>
            <Label>Datenpunkt</Label>
            <RowView justifyContent="space-between">
              <Label size="s" color="textSecondary">
                Datum
              </Label>
              <Label size="s" weight="bold">
                {axisDateFormatter.format(
                  new Date(currentPointDatas.remainingBalanceLineData.pointDate),
                )}
              </Label>
            </RowView>
            <RowView justifyContent="space-between">
              <Label size="s" color="textSecondary">
                Aktueller Saldo
              </Label>
              <Label size="s" color="textSecondary" weight="bold">
                {currency(currentPointDatas.balanceLineData.value)}
              </Label>
            </RowView>
            <RowView justifyContent="space-between">
              <Label size="s" color="textSecondary">
                Restsaldo
              </Label>
              <Label size="s" color="primary" weight="bold">
                {currency(currentPointDatas?.remainingBalanceLineData?.value)}
              </Label>
            </RowView>
          </View>
        )}
      <View
        style={{ overflow: "hidden" }}
        onLayout={(e) => setParentWidth(e.nativeEvent.layout.width)}
      >
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
          maxValue={chartBounds.maxValue}
          mostNegativeValue={chartBounds.mostNegativeValue}
          height={200}
          curveType={CurveType.QUADRATIC}
          areaChart
          hideDataPoints
          scrollToEnd
          labelsExtraHeight={25}
          getPointerProps={({ pointerIndex }: { pointerIndex: number }) => {
            const remainingBalancePoint = remainingBalanceLineData[pointerIndex];
            const balancePoint = balanceLineData[pointerIndex];

            if (!remainingBalancePoint || !balancePoint) return;

            setCurrentPointDatas({
              remainingBalanceLineData: remainingBalancePoint,
              balanceLineData: balancePoint,
            });
          }}
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
        <DotLight color="lightTransparency" />
        <Label size="s" color="textSecondary">
          Saldo
        </Label>
        <DotLight color="primary" />
        <Label size="s" color="textSecondary">
          Restsaldo
        </Label>
      </RowView>
      <Checkbox isActive={isParentWidth} setIsActive={setIsParentWidth}>
        <Label size="s">Graph minimieren</Label>
      </Checkbox>
    </Style_GapContainer>
  );
};

export default BalancesLineChart;
