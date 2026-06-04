import { ExpenseEvent } from "../types/expenses.type";

type CompactExpenseEventsOptions = {
  retainRecentMonths?: number;
};

const dayKey = (date: Date) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(
    date.getDate(),
  ).padStart(2, "0")}`;

const compactExpenseEvents = (
  expenseEvents: ExpenseEvent[] | undefined,
  { retainRecentMonths = 6 }: CompactExpenseEventsOptions = {},
): ExpenseEvent[] => {
  if (!expenseEvents?.length) return [];

  const sortedEvents = [...expenseEvents].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
  );

  const cutoffDate = new Date();
  cutoffDate.setMonth(cutoffDate.getMonth() - retainRecentMonths);

  const recentEvents: ExpenseEvent[] = [];
  const latestPerDay = new Map<string, ExpenseEvent>();

  for (const event of sortedEvents) {
    const eventDate = new Date(event.date);
    if (Number.isNaN(eventDate.getTime())) continue;

    if (eventDate >= cutoffDate) {
      recentEvents.push(event);
      continue;
    }

    latestPerDay.set(dayKey(eventDate), event);
  }

  const compactedOlderEvents = Array.from(latestPerDay.values()).sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
  );

  return [...compactedOlderEvents, ...recentEvents];
};

export default compactExpenseEvents;
