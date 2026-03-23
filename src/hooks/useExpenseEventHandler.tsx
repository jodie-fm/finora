import { useMMKV, useMMKVObject } from "react-native-mmkv";
import {
  BaseExpense,
  CurrentExpenses,
  Expense,
  ExpenseEvent,
} from "../types/expenses.type";
import uuid from "react-native-uuid";
import { useCallback, useMemo, useTransition } from "react";

type AddExpenseEventProps = {
  action: ExpenseEvent["action"];
  currentBalance?: ExpenseEvent["balance"] | null;
  savings?: ExpenseEvent["savings"] | null;
  expense?: Expense;
  previousExpense?: BaseExpense | Expense;
};

export const useExpenseEventHandler = () => {
  const MMKVCurrent = useMMKV({ id: "currentMMKV", compareBeforeSet: true });
  const MMKVEvents = useMMKV({ id: "eventsMMKV", compareBeforeSet: true });
  const [expenseEvents, setExpenseEvents] = useMMKVObject<ExpenseEvent[]>(
    "expenseEvents",
    MMKVEvents,
  );
  const [state, setState] = useMMKVObject<CurrentExpenses>(
    "state",
    MMKVCurrent,
  );
  const [, startTransition] = useTransition();

  const calculateRemainingBalance = useCallback(
    (
      { expenses, currentBalance, savings }: CurrentExpenses = {
        expenses: state?.expenses,
        currentBalance: state?.currentBalance,
        savings: state?.savings,
      },
    ) => {
      const variableExpenses = (expenses || []).filter(
        (expense) => expense.type === "variable",
      );
      const fixedExpenses = (expenses || []).filter(
        (expense) => expense.type === "fixed",
      );

      const variableValue = variableExpenses.reduce(
        (acc, expense) => acc + expense.amount,
        0,
      );
      const fixedValue = fixedExpenses.reduce((totalAcc, expense) => {
        const reducedPaid = Math.min(
          expense.paid?.reduce((acc, paid) => acc + paid.amount, 0) || 0,
          expense.amount,
        );
        return totalAcc + expense.amount - reducedPaid;
      }, 0);

      const remainingBalance =
        currentBalance?.amount &&
        ((currentBalance.amount -
          variableValue -
          fixedValue -
          (savings?.amount ||
            0)) satisfies CurrentExpenses["remainingBalance"]);

      return {
        remainingBalance,
        variableValue: variableValue > 0 ? variableValue : undefined,
        fixedValue: fixedValue > 0 ? fixedValue : undefined,
      };
    },
    [state],
  );

  const addExpenseEvent = useCallback(
    ({ action, expense, previousExpense, ...props }: AddExpenseEventProps) => {
      const savings =
        props.savings === null
          ? undefined
          : props.savings
            ? props.savings
            : state?.savings;
      const currentBalance =
        props.currentBalance === null
          ? undefined
          : props.currentBalance
            ? props.currentBalance
            : state?.currentBalance;
      let expenses: Expense[] = [...(state?.expenses || [])];
      if (expense) {
        switch (action) {
          case "added":
          default:
            expenses.push(expense);
            break;
          case "updated": {
            const index = expenses.findIndex((e) => e.id === expense.id);
            if (index !== -1) expenses[index] = expense;
            break;
          }
          case "deleted": {
            const index = expenses.findIndex((e) => e.id === expense.id);
            if (index !== -1) expenses.splice(index, 1);
            break;
          }
        }
      }

      const { remainingBalance } = calculateRemainingBalance({
        expenses,
        currentBalance,
        savings,
      });

      const newEvent: ExpenseEvent = {
        eventId: uuid.v4(),
        date: new Date().toISOString(),
        action,
        expense,
        previousExpense,
        balance: currentBalance,
        remainingBalance,
        savings,
      };

      setState({
        currentBalance,
        savings,
        remainingBalance,
        expenses,
      });

      startTransition(() => {
        setExpenseEvents((prevEvents) => [...(prevEvents || []), newEvent]);
      });
    },
    [state, calculateRemainingBalance],
  );

  return useMemo(
    () => ({
      MMKVCurrent,
      MMKVEvents,
      state,
      expenseEvents,
      addExpenseEvent,
      calculateRemainingBalance,
    }),
    [
      MMKVCurrent,
      MMKVEvents,
      state,
      expenseEvents,
      addExpenseEvent,
      calculateRemainingBalance,
    ],
  );
};
