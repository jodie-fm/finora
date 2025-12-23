import { ExpenseEvent } from "../types/expenses.type";

const listLastExpenseByDay = (expenseEvents: ExpenseEvent[] | undefined, offsetMonths: number = 0) => {
  let lastEvents: ExpenseEvent[] = [];
  const today = new Date();
  const startDate = new Date(today);
  startDate.setMonth(today.getMonth() - offsetMonths);
  startDate.setDate(1);

  if (!expenseEvents) {
    return {
      lastEvents,
      startDate,
      today
    };
  }
  const filteredEvents = expenseEvents.filter(event => new Date(event.date) >= startDate);
  const previousEvents = expenseEvents.filter(event => new Date(event.date) < startDate);
  filteredEvents.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const totalDays = Math.ceil((today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));

  for (let i = 0; i <= totalDays; i++) {
    const currentDate = new Date(startDate);
    currentDate.setDate(startDate.getDate() + i);

    const expenseEvent = filteredEvents.findLast(event => {
      return new Date(event.date) <= currentDate
    });
    const previousExpenseEvent = previousEvents.findLast(event => {
      return new Date(event.date) <= currentDate
    });
    lastEvents.push(expenseEvent || previousExpenseEvent || expenseEvents[0]);
  }

  return {
    lastEvents,
    startDate,
    today
  };
}

export default listLastExpenseByDay;