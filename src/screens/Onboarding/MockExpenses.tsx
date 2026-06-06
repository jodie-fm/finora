import React, { useCallback, useMemo } from "react";
import { FlatList, Pressable } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import RowView from "../../components/RowView/RowView";
import { Expense } from "../../types/expenses.type";
import Separator from "../../components/Separator/Separator";
import Label from "../../components/Label/Label";
import ListItem from "../../components/ExpensesCard/ListItem";
import CircularProgress from "react-native-circular-progress-indicator";
import FontAwesomeIcon from "../../components/FontAwesomeIcon/FontAwesomeIcon";
import { useTheme } from "styled-components/native";
import BaseCard from "../../components/BaseCard/BaseCard";

type MockExpensesProps = {
  type: Expense["type"];
  expenses: Expense[];
};
const MockExpenses = ({ type, expenses }: MockExpensesProps) => {
  const theme = useTheme();

  const itemSeparator = useCallback(() => <Separator space="none" />, []);

  const getItemLayout = useCallback(
    (_: unknown, index: number) => ({
      length: 81,
      offset: 81 * index,
      index,
    }),
    [],
  );

  const filteredExpenses = useMemo(
    () =>
      expenses
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
    [expenses, type, theme.color.background],
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
        onDeletePress={() => {}}
        setExpenseId={() => {}}
        setEditExpenseModalVisible={() => {}}
        setInfoModalVisible={() => {}}
      />
    ),
    [type],
  );

  return (
    <BaseCard>
      <FlatList
        data={filteredExpenses}
        keyExtractor={(item) => item.id}
        scrollEnabled={false}
        ItemSeparatorComponent={itemSeparator}
        getItemLayout={getItemLayout}
        ListHeaderComponent={() => (
          <RowView justifyContent="space-between">
            <Title />
            <Pressable onPress={() => {}}>
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
    </BaseCard>
  );
};

export default MockExpenses;
