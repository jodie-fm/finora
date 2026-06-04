import Button from "../../components/Button/Button";
import FontAwesomeIcon from "../../components/FontAwesomeIcon/FontAwesomeIcon";
import Label from "../../components/Label/Label";
import Modal from "../../components/Modal/Modal";
import Pressable from "../../components/Pressable/Pressable";
import RowView from "../../components/RowView/RowView";
import styled, { css } from "styled-components/native";
import React from "react";
import { BaseExpense, Expense } from "../../types/expenses.type";
import currency from "../../helpers/numberCurrency";
import Separator from "../../components/Separator/Separator";
import { View } from "react-native";
import Checkbox from "../../components/Checkbox/Checkbox";
import { useAddExpenseEvent } from "../../hooks/useExpenseEventHandler";
import uuid from "react-native-uuid";

type InfoExpenseModalProps = {
  expense: Expense;
  isVisible: boolean;
  setIsVisible: React.Dispatch<
    React.SetStateAction<InfoExpenseModalProps["isVisible"]>
  >;
  setIsEditModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
};

const Style_AmountView = styled.View`
  ${({ theme }) => css`
    background-color: ${theme.color.background};
    padding: ${theme.size.s.px};
    border-radius: ${theme.size.s.value * 8}px;
  `}
`;

const InfoExpenseModal = ({
  expense,
  isVisible,
  setIsVisible,
  setIsEditModalVisible,
}: InfoExpenseModalProps) => {
  const addExpenseEvent = useAddExpenseEvent();
  const paid =
    expense?.paid &&
    Math.min(
      expense.paid.reduce((acc, x) => acc + x.amount, 0),
      expense.amount,
    );
  const rest =
    expense.amount -
    Math.min(
      expense.paid?.reduce((acc, x) => acc + x.amount, 0) || 0,
      expense.amount,
    );
  const onRequestClose = () => {
    setIsVisible(false);
  };

  const onEditPress = () => {
    setIsEditModalVisible(true);
  };

  const onFinishPress = () => {
    onRequestClose();
  };

  const onIsPaidPress = () => {
    if (!expense || expense.type !== "fixed") return;
    const restPaid: BaseExpense = {
      id: uuid.v4(),
      amount: rest,
      date: new Date().toISOString(),
    };
    addExpenseEvent({
      action: "updated",
      expense: {
        ...expense,
        paid: rest === 0 ? [] : [...(expense.paid || []), restPaid],
      },
      previousExpense: expense,
    });
  };

  return (
    <Modal visible={isVisible} onRequestClose={onRequestClose}>
      <RowView>
        <RowView justifyContent="space-between" style={{ flex: 1 }}>
          {expense?.description && <Label>{expense.description}</Label>}
          {expense?.date && (
            <Label color="textSecondary" size="s">
              {new Intl.DateTimeFormat(undefined, {
                dateStyle: "short",
              }).format(new Date(expense.date))}
            </Label>
          )}
        </RowView>
        <Pressable onPress={onEditPress}>
          <FontAwesomeIcon icon="pen" color="textSecondary" size="s" />
        </Pressable>
      </RowView>
      <Style_AmountView>
        <RowView justifyContent="space-between">
          <Label color="textPrimary" size="s">
            Wert
          </Label>
          <Label color="textPrimary" size="s" weight="bold">
            {currency(expense?.amount || 0)}
          </Label>
        </RowView>

        {paid !== undefined && (
          <>
            <Separator />
            <RowView justifyContent="space-between">
              <View>
                <Label color="success" size="s" align="left">
                  Bezahlt
                </Label>
                <Label color="textPrimary" size="s" weight="bold" align="left">
                  {currency(paid)}
                </Label>
              </View>
              <View>
                <Label color="danger" size="s" align="right">
                  Restbetrag
                </Label>
                <Label color="textPrimary" size="s" weight="bold" align="right">
                  {currency(rest)}
                </Label>
              </View>
            </RowView>
          </>
        )}
      </Style_AmountView>
      {expense.type === "fixed" && (
        <RowView justifyContent="flex-end" gap="xs">
          <Label color="textSecondary" size="s">
            Bezahlt
          </Label>
          <Checkbox isActive={rest === 0} setIsActive={onIsPaidPress} />
        </RowView>
      )}
      <Button onPress={onFinishPress}>
        <Label>OK</Label>
      </Button>
    </Modal>
  );
};

export default InfoExpenseModal;
