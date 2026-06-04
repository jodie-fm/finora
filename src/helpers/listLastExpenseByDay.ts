import { ExpenseEvent } from "../types/expenses.type";

const DAY_IN_MS = 1000 * 60 * 60 * 24;

const listLastExpenseByDay = (
  expenseEvents: ExpenseEvent[] | undefined,
  offsetMonths: number = 0,
) => {
  const lastEvents: ExpenseEvent[] = [];
  const today = new Date();
  const startDate = new Date(today);
  startDate.setMonth(today.getMonth() - offsetMonths);
  startDate.setDate(1);

  if (!expenseEvents?.length) {
    return {
      lastEvents,
      startDate,
      today,
    };
  }

  const sortedEvents = expenseEvents
    .map((event) => ({
      event,
      timestamp: new Date(event.date).getTime(),
    }))
    .filter(({ timestamp }) => !Number.isNaN(timestamp))
    .sort((a, b) => a.timestamp - b.timestamp);

  if (!sortedEvents.length) {
    return {
      lastEvents,
      startDate,
      today,
    };
  }

  const totalDays = Math.ceil(
    (today.getTime() - startDate.getTime()) / DAY_IN_MS,
  );
  let eventIndex = 0;
  let latestEvent: ExpenseEvent | undefined;

  for (let i = 0; i <= totalDays; i++) {
    const currentDate = new Date(startDate);
    currentDate.setDate(startDate.getDate() + i);
    const currentTimestamp = currentDate.getTime();

    while (
      eventIndex < sortedEvents.length &&
      sortedEvents[eventIndex].timestamp <= currentTimestamp
    ) {
      latestEvent = sortedEvents[eventIndex].event;
      eventIndex += 1;
    }

    if (latestEvent) {
      lastEvents.push(latestEvent);
    }
  }

  return {
    lastEvents,
    startDate,
    today,
  };
};

export default listLastExpenseByDay;
