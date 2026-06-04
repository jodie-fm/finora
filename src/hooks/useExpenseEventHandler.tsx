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

const useExpenseStateStorage = () => {
  const MMKVCurrent = useMMKV({ id: "currentMMKV", compareBeforeSet: true });
  const [state, setState] = useMMKVObject<CurrentExpenses>(
    "state",
    MMKVCurrent,
  );

  return {
    MMKVCurrent,
    state,
    setState,
  };
};

const useExpenseEventsStorage = () => {
  const MMKVEvents = useMMKV({ id: "eventsMMKV", compareBeforeSet: true });
  const [expenseEvents, setExpenseEvents] = useMMKVObject<ExpenseEvent[]>(
    "expenseEvents",
    MMKVEvents,
  );

  return {
    MMKVEvents,
    expenseEvents,
    setExpenseEvents,
  };
};

export const useExpenseState = () => useExpenseStateStorage().state;

export const useExpenseEvents = () => useExpenseEventsStorage().expenseEvents;

export const useExpenseStorage = () => {
  const { MMKVCurrent } = useExpenseStateStorage();
  const { MMKVEvents } = useExpenseEventsStorage();

  return useMemo(
    () => ({
      MMKVCurrent,
      MMKVEvents,
    }),
    [MMKVCurrent, MMKVEvents],
  );
};

export const useCalculateRemainingBalance = () => {
  const state = useExpenseState();

  return useCallback(
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
};

export const useAddExpenseEvent = () => {
  const { state, setState } = useExpenseStateStorage();
  const { setExpenseEvents } = useExpenseEventsStorage();
  const calculateRemainingBalance = useCalculateRemainingBalance();
  const [, startTransition] = useTransition();

  return useCallback(
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
    [
      calculateRemainingBalance,
      setExpenseEvents,
      setState,
      startTransition,
      state,
    ],
  );
};

export const useExpenseEventHandler = () => {
  const { MMKVCurrent } = useExpenseStateStorage();
  const { MMKVEvents, expenseEvents } = useExpenseEventsStorage();
  const state = useExpenseState();
  const addExpenseEvent = useAddExpenseEvent();
  const calculateRemainingBalance = useCalculateRemainingBalance();

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
