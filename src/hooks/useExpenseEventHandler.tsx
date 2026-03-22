import { useMMKV, useMMKVObject } from "react-native-mmkv";
import {
  BaseExpense,
  CurrentExpenses,
  Expense,
  ExpenseEvent,
} from "../types/expenses.type";
import uuid from "react-native-uuid";

type AddExpenseEventProps = {
  action: ExpenseEvent["action"];
  currentBalance?: ExpenseEvent["balance"] | null;
  savings?: ExpenseEvent["savings"] | null;
  expense?: Expense;
  previousExpense?: BaseExpense | Expense;
};

export const useExpenseEventHandler = () => {
  const MMKVCurrent = useMMKV({ id: "currentMMKV" });
  const MMKVEvents = useMMKV({ id: "eventsMMKV" });
  const [expenseEvents, setExpenseEvents] = useMMKVObject<ExpenseEvent[]>(
    "expenseEvents",
    MMKVEvents,
  );
  const [state, setState] = useMMKVObject<CurrentExpenses>(
    "state",
    MMKVCurrent,
  );

  const calculateRemainingBalance = ({
    expenses = state?.expenses || [],
    currentBalance = state?.currentBalance,
    savings = state?.savings,
  }: CurrentExpenses = {}) => {
    const variableExpenses = expenses.filter(
      (expense) => expense.type === "variable",
    );
    const fixedExpenses = expenses.filter(
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
    return {
      remainingBalance:
        currentBalance?.amount &&
        ((currentBalance?.amount -
          variableValue -
          fixedValue -
          (savings?.amount ||
            0)) satisfies CurrentExpenses["remainingBalance"]),
      variableValue: variableValue > 0 ? variableValue : undefined,
      fixedValue: fixedValue > 0 ? fixedValue : undefined,
    };
  };

  const addExpenseEvent = ({
    action,
    expense,
    previousExpense,
    ...props
  }: AddExpenseEventProps) => {
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
      if (action === "added") {
        expenses.push(expense);
      } else if (action === "updated") {
        expenses = expenses.map((e) => (e.id === expense.id ? expense : e));
      } else if (action === "deleted") {
        expenses = expenses.filter((e) => e.id !== expense.id);
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
      savings: state?.savings,
    };
    setExpenseEvents([...(expenseEvents || []), newEvent]);

    setState({
      currentBalance,
      savings,
      remainingBalance,
      expenses,
    });
  };

  return {
    MMKVCurrent,
    MMKVEvents,
    state,
    expenseEvents,
    addExpenseEvent,
    calculateRemainingBalance,
  };
};
