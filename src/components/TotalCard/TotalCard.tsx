import React, { useCallback, useMemo, useState } from "react";
import BaseCard from "../BaseCard/BaseCard";
import { View } from "react-native";
import Label from "../Label/Label";
import styled from "styled-components/native";
import currency from "../../helpers/numberCurrency";
import Separator from "../Separator/Separator";
import RowView from "../RowView/RowView";
import FontAwesomeIcon from "../FontAwesomeIcon/FontAwesomeIcon";
import Pressable from "../Pressable/Pressable";
import InputValueModal from "../../modals/InputValueModal/InputValueModal";
import uuid from "react-native-uuid";
import { useExpenseEventHandler } from "../../hooks/useExpenseEventHandler";
import getBalancesEndOfMonth from "../../helpers/getBalancesEndOfMonth";

const Style_Item = styled(Pressable)`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const TotalCard = () => {
  const { state, expenseEvents, addExpenseEvent, calculateRemainingBalance } =
    useExpenseEventHandler();
  const { remainingBalance, fixedValue, variableValue } =
    calculateRemainingBalance();
  const [isModalVisible, setModalVisible] = useState(false);

  const previousMonthBalance = useMemo(
    () => getBalancesEndOfMonth(expenseEvents).at(-2)?.remainingBalance,
    [expenseEvents],
  );
  const differencePreviousMonth = useMemo(
    () =>
      remainingBalance &&
      previousMonthBalance &&
      remainingBalance - previousMonthBalance,
    [remainingBalance, previousMonthBalance],
  );
  const isPositiveDifference = useMemo(
    () => (differencePreviousMonth ? differencePreviousMonth > 0 : false),
    [differencePreviousMonth],
  );

  const setValue = useCallback(
    (value: number | undefined) =>
      addExpenseEvent({
        action: "updated",
        currentBalance: value
          ? {
              id: uuid.v4(),
              amount: value,
              date: new Date().toISOString(),
            }
          : null,
        previousExpense: state?.currentBalance,
      }),
    [addExpenseEvent, state?.currentBalance],
  );

  return (
    <BaseCard>
      <Style_Item onPress={() => setModalVisible(true)}>
        <View style={{ flex: 1 }}>
          <Label color="textSecondary" size="s">
            Aktueller Saldo
          </Label>
          <Label color="textSecondary" weight="bold">
            {currency(state?.currentBalance?.amount)}
          </Label>
        </View>
        <FontAwesomeIcon color="textSecondary" icon="pen" />
        <InputValueModal
          label="Aktueller Saldo"
          isVisible={isModalVisible}
          setIsVisible={setModalVisible}
          value={state?.currentBalance?.amount}
          setValue={setValue}
        />
      </Style_Item>
      <Separator />
      <RowView gap="xs">
        <Label color="textSecondary" size="s">
          Restsaldo
        </Label>
        {Boolean(differencePreviousMonth) && (
          <>
            <FontAwesomeIcon
              color={isPositiveDifference ? "success" : "danger"}
              icon={
                isPositiveDifference ? "arrow-trend-up" : "arrow-trend-down"
              }
              size="s"
            />
            <Label color={isPositiveDifference ? "success" : "danger"} size="s">
              {currency(differencePreviousMonth)}
            </Label>
          </>
        )}
      </RowView>
      <Label
        color={
          !remainingBalance
            ? "textPrimary"
            : remainingBalance < 0
              ? "danger"
              : "primary"
        }
        weight="bold"
        size="xxl"
      >
        {currency(remainingBalance)}
      </Label>
      {(fixedValue || variableValue || state?.savings?.amount) && <Separator />}
      {fixedValue && (
        <RowView style={{ justifyContent: "space-between" }}>
          <Label color="textSecondary" size="s">
            Fixe Kosten
          </Label>
          <Label color="textSecondary" size="s" weight="bold">
            {currency(fixedValue)}
          </Label>
        </RowView>
      )}

      {variableValue && (
        <RowView style={{ justifyContent: "space-between" }}>
          <Label color="textSecondary" size="s">
            Buchungen
          </Label>
          <Label color="textSecondary" size="s" weight="bold">
            {currency(variableValue)}
          </Label>
        </RowView>
      )}
      {state?.savings?.amount && (
        <RowView style={{ justifyContent: "space-between" }}>
          <Label color="textSecondary" size="s">
            Ersparnisse
          </Label>
          <Label color="textSecondary" size="s" weight="bold">
            {currency(state.savings.amount)}
          </Label>
        </RowView>
      )}
    </BaseCard>
  );
};

export default TotalCard;
