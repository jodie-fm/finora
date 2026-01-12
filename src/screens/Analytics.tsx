import Layout01 from '../layouts/Layout01';
import Label from '../components/Label/Label';
import SafeScrollView from '../components/ScrollView/SafeScrollView';
import styled, { css } from 'styled-components/native';
import { useExpenseEventHandler } from '../hooks/useExpenseEventHandler';
import { useMemo } from 'react';
import { View } from 'react-native';
import numberCurrency from '../helpers/numberCurrency';
import BaseCard from '../components/BaseCard/BaseCard';
import RowView from '../components/RowView/RowView';
import listLastExpenseByDay from '../helpers/listLastExpenseByDay';
import Separator from '../components/Separator/Separator';
import { useIsFocused } from '@react-navigation/native';
import Pressable from '../components/Pressable/Pressable';
import FontAwesomeIcon from '../components/FontAwesomeIcon/FontAwesomeIcon';
import { Screens } from '../constants/Screens';
import BalancesLineChart from '../components/BalancesLineChart/BalancesLineChart';
import BalancesBarChart from '../components/BalancesBarChart/BalancesBarChart';

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
  const {
    state, expenseEvents
  } = useExpenseEventHandler();

  const {
    today
  } = useMemo(() => listLastExpenseByDay(expenseEvents), [ expenseEvents ]);


  const lastDay = new Date(today);
  lastDay.setMonth(today.getMonth() + 1);
  lastDay.setDate(0);

  const remainingDays = lastDay.getDate() - today.getDate();
  const averageRemainingExpense = useMemo(() => state?.remainingBalance && Math.max(state?.remainingBalance / remainingDays, 0), [ state?.remainingBalance ]);

  const averageDailyVariableExpense = useMemo(() => expenseEvents && expenseEvents
  ?.filter(event => event.expense?.type === 'variable' && event.action === 'added')
  ?.reduce((acc, event) => acc + event.expense!.amount, 0) / today.getDate(), [ expenseEvents, today ]);
  const daysUntilNegative = useMemo(() => state?.remainingBalance && averageDailyVariableExpense && state.remainingBalance / averageDailyVariableExpense, [ averageDailyVariableExpense, state?.remainingBalance ]);
  const dateUntilNegative = new Date(today);
  daysUntilNegative && dateUntilNegative.setDate(today.getDate() + daysUntilNegative);


  const warningRemainingBalance = <Pressable>
    <Label size="s" color="warning">Anhand Ihrer variablen Ausgaben könnte Ihr Restsaldo im Minus
      fallen!</Label>
    <Style_PaddedView>
      <RowView justifyContent="space-between">
        <Label size="s" color="textSecondary">Bisherige durchschn. Tagesausgabe:</Label>
        <Label size="s" weight="bold">{numberCurrency(averageDailyVariableExpense)}</Label>
      </RowView>
    </Style_PaddedView>
    <Style_PaddedView>
      <RowView justifyContent="space-between">
        <Label size="s" color="textSecondary">Wann es im Minus sein könnte:</Label>
        <Label size="s" weight="bold">{Intl.DateTimeFormat(undefined, { dateStyle: 'medium' })
        .format(dateUntilNegative)}</Label>
      </RowView>
      <RowView gap="s" flexWrap="nowrap">
        <FontAwesomeIcon icon="arrow-right" size="s" color="textSecondary" />
        <Label size="s" color="textSecondary">Beachten Sie die max. durchschnittliche Tagesausgabe, um am Ende
          des Monats positiv zu bleiben.</Label>
      </RowView>
    </Style_PaddedView>
  </Pressable>;

  const remainingBalanceNegative = <Pressable>
    <Label size="s" color="danger">Ihr Restsaldo liegt im Minus!</Label>
    <RowView flexWrap="nowrap">
      <FontAwesomeIcon icon="arrow-right" size="s" color="textSecondary" />
      <Label size="s" color="textSecondary">Können fixe Kosten verringert werden?</Label>
    </RowView>
    <RowView flexWrap="nowrap">
      <FontAwesomeIcon icon="arrow-right" size="s" color="textSecondary" />
      <Label size="s" color="textSecondary">Benötigen/Nutzen Sie wirklich alle Abonnements zurzeit?</Label>
    </RowView>
  </Pressable>;

  return isFocused && <Layout01 title={Screens.ANALYTICS}>
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
            <Label size="s" color="textSecondary">Aktueller Saldo</Label>
            <Label size="s" weight="bold">{numberCurrency(state?.currentBalance?.amount)}</Label>
          </RowView>
          <RowView justifyContent="space-between">
            <Label size="s" color="textSecondary">Restsaldo</Label>
            <Label
              size="s"
              color={state?.remainingBalance && state.remainingBalance < 0 ? 'danger' : daysUntilNegative && daysUntilNegative < remainingDays ? 'warning' : 'primary'}
              weight="bold"
            >{numberCurrency(state?.remainingBalance)}</Label>
          </RowView>
          <Separator space="none" />
          <Label weight="bold">Empfehlungen / Maßnahmen</Label>
          {state?.remainingBalance && state?.remainingBalance < 0 ? remainingBalanceNegative : daysUntilNegative && daysUntilNegative < remainingDays && warningRemainingBalance}
          <Label size="s" color="primary">Um im positiven Ergebnis zu bleiben, können Sie folgendes
            berücksichtigen:</Label>
          <Style_PaddedView>
            <Pressable>
              <RowView justifyContent="space-between">
                <Label size="s">Durschn. Tagesausgabe:</Label>
                <Label size="s" weight="bold">{numberCurrency(averageRemainingExpense)}</Label>
              </RowView>
              {state?.remainingBalance && state.remainingBalance < 0 && <RowView>
                <FontAwesomeIcon icon="arrow-right" size="s" color="textSecondary" />
                <Label size="s" color="textSecondary">Das bedeutet einen sofortigen Ausgabestopp!</Label>
              </RowView>}
            </Pressable>
          </Style_PaddedView>
        </Style_GapContainer>
      </BaseCard>
      <View />
    </SafeScrollView>
  </Layout01>;
};

export default Analytics;