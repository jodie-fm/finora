import React, { useCallback, useMemo, useState } from "react";
import Label from "../Label/Label";
import BaseCard from "../BaseCard/BaseCard";
import { Expense } from "../../types/expenses.type";
import { useTheme } from "styled-components/native";
import { FlatList, View } from "react-native";
import CircularProgress from "react-native-circular-progress-indicator";
import Separator from "../Separator/Separator";
import FontAwesomeIcon from "../FontAwesomeIcon/FontAwesomeIcon";
import EditExpenseModal from "../../modals/EditExpenseModal/EditExpenseModal";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import ListItem from "./ListItem";
import InfoExpenseModal from "../../modals/InfoExpenseModal/InfoExpenseModal";
import { useExpenseEventHandler } from "../../hooks/useExpenseEventHandler";
import RowView from "../RowView/RowView";
import Pressable from "../Pressable/Pressable";
import Modal from "../Modal/Modal";
import currency from "../../helpers/numberCurrency";
import { ExpenseEvent } from "../../types/expenses.type";

type ExpensesCardProps = {
  type: Expense["type"];
};

const ExpensesCard = ({ type }: ExpensesCardProps) => {
  const theme = useTheme();
  const { state, addExpenseEvent } = useExpenseEventHandler();
  const [expenseId, setExpenseId] = useState<Expense["id"]>();
  const expense = useMemo(
    () => state?.expenses?.find((expense) => expense.id === expenseId),
    [expenseId, state],
  );

  const [isEditExpenseModalVisible, setEditExpenseModalVisible] =
    useState(false);
  const [isInfoModalVisible, setInfoModalVisible] = useState(false);
  const [isSummaryModalVisible, setSummaryModalVisible] = useState(false);
  const filteredExpenses = useMemo(
    () =>
      state?.expenses
        ?.filter((expense) => expense.type === type)
        ?.map(({ description, amount, paid, ...expense }) => {
          const reducedPaid =
            (paid && paid.reduce((acc, x) => acc + x.amount, 0)) || 0;
          const color = theme.color.background;
          return {
            ...expense,
            amount,
            description: description && (
              <Label color="textSecondary" size="s">
                {description}
              </Label>
            ),
            paid: Math.min(reducedPaid, amount),
            progressPaid:
              reducedPaid >= amount ? (
                <FontAwesomeIcon icon="check-circle" color="primary" size="l" />
              ) : (
                <CircularProgress
                  value={Math.min(reducedPaid, amount)}
                  duration={1000}
                  radius={12}
                  maxValue={amount}
                  inActiveStrokeWidth={24}
                  activeStrokeWidth={10}
                  showProgressValue={false}
                  circleBackgroundColor={color}
                  inActiveStrokeColor={color}
                />
              ),
          };
        }),
    [state?.expenses, type, theme.color.background],
  );

  const onDeletePress = useCallback(
    (id: Expense["id"]) => {
      const previousExpense = state?.expenses?.find(
        (expense) => expense.id === id,
      );
      if (!previousExpense) return;
      addExpenseEvent({
        action: "deleted",
        expense: previousExpense as ExpenseEvent["expense"],
      });
    },
    [addExpenseEvent, state?.expenses],
  );

  const Title = () => (
    <Label color="primary" size="m" weight="bold">
      {type === "fixed" ? "Fixe Kosten" : "Buchungen"}
      {filteredExpenses && filteredExpenses.length > 0
        ? ` (${filteredExpenses?.length})`
        : ""}
    </Label>
  );

  const renderItem = useCallback(
    ({ item }: { item: NonNullable<typeof filteredExpenses>[number] }) => (
      <ListItem
        item={item}
        type={type}
        onDeletePress={onDeletePress}
        setExpenseId={setExpenseId}
        setEditExpenseModalVisible={setEditExpenseModalVisible}
        setInfoModalVisible={setInfoModalVisible}
      />
    ),
    [onDeletePress, setEditExpenseModalVisible, state?.expenses, type],
  );

  const itemSeparator = useCallback(() => <Separator space="none" />, []);

  const getItemLayout = useCallback(
    (_: unknown, index: number) => ({
      length: 81,
      offset: 81 * index,
      index,
    }),
    [],
  );

  return (
    <BaseCard>
      <GestureHandlerRootView>
        <FlatList
          data={filteredExpenses}
          keyExtractor={(item) => item.id}
          scrollEnabled={false}
          ItemSeparatorComponent={itemSeparator}
          getItemLayout={getItemLayout}
          ListHeaderComponent={() => (
            <RowView justifyContent="space-between">
              <Title />
              <Pressable onPress={() => setSummaryModalVisible(true)}>
                <FontAwesomeIcon
                  icon="info-circle"
                  color="textSecondary"
                  size="s"
                />
              </Pressable>
            </RowView>
          )}
          renderItem={renderItem}
          initialNumToRender={4}
          maxToRenderPerBatch={4}
          windowSize={1}
        />
      </GestureHandlerRootView>
      {expense && (
        <>
          <EditExpenseModal
            expense={expense}
            visible={isEditExpenseModalVisible}
            setVisible={setEditExpenseModalVisible}
          />
          <InfoExpenseModal
            expense={expense}
            isVisible={isInfoModalVisible}
            setIsEditModalVisible={setEditExpenseModalVisible}
            setIsVisible={setInfoModalVisible}
          />
        </>
      )}

      <Modal
        visible={isSummaryModalVisible}
        onRequestClose={() => setSummaryModalVisible(false)}
      >
        <Title />
        <Label size="s" weight="bold">
          Zusammenfassung
        </Label>
        <View>
          <RowView justifyContent="space-between">
            <Label color="textSecondary" size="s">
              Beträge gesamt
            </Label>
            <Label weight="bold" size="s">
              {currency(
                filteredExpenses?.reduce((acc, x) => acc + x.amount, 0),
              )}
            </Label>
          </RowView>
          {type === "fixed" && (
            <>
              <RowView justifyContent="space-between">
                <Label color="textSecondary" size="s">
                  Davon bezahlt
                </Label>
                <Label color="success" weight="bold" size="s">
                  {currency(
                    filteredExpenses?.reduce((acc, x) => acc + x.paid, 0),
                  )}
                </Label>
              </RowView>
              <RowView justifyContent="space-between">
                <Label color="textSecondary" size="s">
                  Offen
                </Label>
                <Label color="danger" weight="bold" size="s">
                  {currency(
                    filteredExpenses
                      ? filteredExpenses?.reduce(
                          (acc, x) => acc + x.amount,
                          0,
                        ) -
                          filteredExpenses?.reduce((acc, x) => acc + x.paid, 0)
                      : 0,
                  )}
                </Label>
              </RowView>
            </>
          )}
        </View>
      </Modal>
    </BaseCard>
  );
};

export default ExpensesCard;
