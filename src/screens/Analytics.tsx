import Layout01 from "../layouts/Layout01";
import Label from "../components/Label/Label";
import SafeScrollView from "../components/ScrollView/SafeScrollView";
import styled, { css } from "styled-components/native";
import {
  useExpenseEvents,
  useExpenseState,
} from "../hooks/useExpenseEventHandler";
import { useMemo } from "react";
import { View } from "react-native";
import currency from "../helpers/numberCurrency";
import BaseCard from "../components/BaseCard/BaseCard";
import RowView from "../components/RowView/RowView";
import listLastExpenseByDay from "../helpers/listLastExpenseByDay";
import Separator from "../components/Separator/Separator";
import { useIsFocused } from "@react-navigation/native";
import Pressable from "../components/Pressable/Pressable";
import FontAwesomeIcon from "../components/FontAwesomeIcon/FontAwesomeIcon";
import { Screens } from "../constants/Screens";
import BalancesLineChart from "../components/BalancesLineChart/BalancesLineChart";
import BalancesBarChart from "../components/BalancesBarChart/BalancesBarChart";

const Style_GapContainer = styled.View`
  ${({ theme }) => css`
    gap: ${theme.size.s.px};
  `}
`;

const Style_PaddedView = styled.View`
  ${({ theme }) => css`
    padding-left: ${theme.size.s.px};
    gap: ${theme.size.s.px};
  `}
`;

const Analytics = () => {
  const isFocused = useIsFocused();
  const state = useExpenseState();
  const expenseEvents = useExpenseEvents();

  const { today } = useMemo(
    () => listLastExpenseByDay(expenseEvents),
    [expenseEvents],
  );

  const lastDay = new Date(today);
  lastDay.setMonth(today.getMonth() + 1);
  lastDay.setDate(0);

  const remainingDays = lastDay.getDate() - today.getDate();
  const averageRemainingExpense = useMemo(
    () =>
      state?.remainingBalance &&
      Math.max(state?.remainingBalance / remainingDays, 0),
    [state?.remainingBalance, remainingDays],
  );
  const variableExpenses = useMemo(
    () =>
      expenseEvents &&
      expenseEvents
        .filter(
          (event) =>
            event.expense?.type === "variable" && event.action === "added",
        )
        .filter((event) => {
          const eventDate = new Date(event.date);
          const sevenDaysAgo = new Date(today);
          sevenDaysAgo.setDate(today.getDate() - 7);
          return eventDate >= sevenDaysAgo && eventDate <= today;
        }),
    [expenseEvents, today],
  );
  const averageDailyVariableExpense = useMemo(
    () =>
      variableExpenses &&
      variableExpenses.reduce((acc, event) => acc + event.expense!.amount, 0) /
        today.getDate(),
    [variableExpenses, today],
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

  const remainingBalanceMap = useMemo(
    () => ({
      default: <></>,
      warning: (
        <Pressable>
          <Label size="s" color="warning">
            Anhand Ihrer variablen Ausgaben könnte Ihr Restsaldo im Minus
            fallen!
          </Label>
          <Style_PaddedView>
            <RowView
              justifyContent="space-between"
              alignItems="flex-end"
              flexWrap="nowrap"
            >
              <Label size="s" color="textSecondary">
                Ø Tagesausgabe der letzten 7 Tage:
              </Label>
              <Label size="s" weight="bold" shrink={false}>
                {currency(averageDailyVariableExpense)}
              </Label>
            </RowView>
            <RowView
              justifyContent="space-between"
              alignItems="flex-end"
              flexWrap="nowrap"
            >
              <Label size="s" color="textSecondary">
                Heutiges Datum:
              </Label>
              <Label size="s" weight="bold" shrink={false}>
                {Intl.DateTimeFormat(undefined, { dateStyle: "long" }).format(
                  today,
                )}
              </Label>
            </RowView>
          </Style_PaddedView>
          <Style_PaddedView>
            <RowView
              justifyContent="space-between"
              flexWrap="nowrap"
              alignItems="flex-end"
            >
              <Label size="s" color="textSecondary">
                Mögliches Datum für{" "}
                <FontAwesomeIcon
                  icon="less-than-equal"
                  size="xs"
                  color="textSecondary"
                />{" "}
                {currency(0, 0)}:
              </Label>
              <Label size="s" weight="bold" shrink={false}>
                {Intl.DateTimeFormat(undefined, { dateStyle: "long" }).format(
                  dateUntilNegative,
                )}
              </Label>
            </RowView>
            <RowView gap="s" flexWrap="nowrap">
              <FontAwesomeIcon
                icon="arrow-right"
                size="s"
                color="textSecondary"
              />
              <Label size="s" color="textSecondary">
                Beachten Sie die max. durchschnittliche Tagesausgabe, um am Ende
                des Monats positiv zu bleiben.
              </Label>
            </RowView>
          </Style_PaddedView>
        </Pressable>
      ),
      error: (
        <Pressable>
          <Label size="s" color="danger">
            Ihr Restsaldo liegt im Minus!
          </Label>
          <RowView flexWrap="nowrap">
            <FontAwesomeIcon
              icon="arrow-right"
              size="s"
              color="textSecondary"
            />
            <Label size="s" color="textSecondary">
              Können fixe Kosten verringert werden?
            </Label>
          </RowView>
          <RowView flexWrap="nowrap">
            <FontAwesomeIcon
              icon="arrow-right"
              size="s"
              color="textSecondary"
            />
            <Label size="s" color="textSecondary">
              Benötigen/Nutzen Sie wirklich alle Abonnements zurzeit?
            </Label>
          </RowView>
        </Pressable>
      ),
    }),
    [],
  );

  return (
    isFocused && (
      <Layout01 title={Screens.ANALYTICS}>
        <SafeScrollView>
          <BaseCard>
            <Style_GapContainer>
              <Label weight="bold">Restsaldo Monate</Label>
              <BalancesBarChart />
            </Style_GapContainer>
          </BaseCard>
          <BaseCard>
            <BalancesLineChart />
          </BaseCard>
          <BaseCard>
            <Style_GapContainer>
              <Label weight="bold">Aktueller Stand</Label>
              <RowView justifyContent="space-between">
                <Label size="s" color="textSecondary">
                  Aktueller Saldo
                </Label>
                <Label size="s" weight="bold">
                  {currency(state?.currentBalance?.amount)}
                </Label>
              </RowView>
              <RowView justifyContent="space-between">
                <Label size="s" color="textSecondary">
                  Restsaldo
                </Label>
                <Label
                  size="s"
                  color={
                    state?.remainingBalance && state.remainingBalance < 0
                      ? "danger"
                      : daysUntilNegative && daysUntilNegative < remainingDays
                        ? "warning"
                        : "primary"
                  }
                  weight="bold"
                >
                  {currency(state?.remainingBalance)}
                </Label>
              </RowView>
              <Separator space="none" />
              <Label weight="bold">Empfehlungen / Maßnahmen</Label>
              {
                remainingBalanceMap[
                  Boolean(
                    state?.remainingBalance && state?.remainingBalance < 0,
                  )
                    ? "error"
                    : Boolean(
                          daysUntilNegative &&
                          daysUntilNegative < remainingDays,
                        )
                      ? "warning"
                      : "default"
                ]
              }
              <Label size="s" color="primary">
                Um im positiven Ergebnis zu bleiben, können Sie folgendes
                berücksichtigen:
              </Label>
              <Style_PaddedView>
                <Pressable>
                  <RowView justifyContent="space-between">
                    <Label size="s">Ø Tagesausgabe:</Label>
                    <Label size="s" weight="bold">
                      {currency(averageRemainingExpense)}
                    </Label>
                  </RowView>
                  {state?.remainingBalance && state.remainingBalance < 0 && (
                    <RowView>
                      <FontAwesomeIcon
                        icon="arrow-right"
                        size="s"
                        color="textSecondary"
                      />
                      <Label size="s" color="textSecondary">
                        Das bedeutet einen sofortigen Ausgabestopp!
                      </Label>
                    </RowView>
                  )}
                </Pressable>
              </Style_PaddedView>
            </Style_GapContainer>
          </BaseCard>
          <View />
        </SafeScrollView>
      </Layout01>
    )
  );
};

export default Analytics;
