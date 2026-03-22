import { ExpenseEvent } from "../types/expenses.type";

const getBalancesEndOfMonth = (expenseEvents: ExpenseEvent[] | undefined) => {
  if (!expenseEvents?.length) return [];

  const latestPerMonth = new Map<string, ExpenseEvent>();

  for (const event of expenseEvents) {
    if (!event.date) continue;

    const date = new Date(event.date);
    const key = `${date.getFullYear()}-${date.getMonth()}`;

    const existing = latestPerMonth.get(key);

    if (!existing || new Date(existing.date) < date) {
      latestPerMonth.set(key, event);
    }
  }

  return Array.from(latestPerMonth.values())
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .map((event) => ({
      date: new Date(event.date),
      balance: event.balance,
      remainingBalance: event.remainingBalance,
    }));
};

export default getBalancesEndOfMonth;
