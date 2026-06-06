import React from "react";
import RowView from "../../../components/RowView/RowView";
import MockExpenses from "../MockExpenses";
import { Style_Features } from "../Onboarding.style";
import Label from "../../../components/Label/Label";
import FontAwesomeIcon from "../../../components/FontAwesomeIcon/FontAwesomeIcon";
import { Expense } from "../../../types/expenses.type";
import Button from "../../../components/Button/Button";
import { SlideProps } from "./Slides.type";

const mockExpenses: Expense[] = [
  {
    id: "1",
    amount: 200,
    date: new Date().toISOString(),
    type: "fixed",
    description: "Miete",
    paid: [{ id: "1", amount: 200, date: new Date().toISOString() }],
  },
  {
    id: "2",
    amount: 600,
    date: new Date().toISOString(),
    type: "fixed",
    description: "Lebensmittel",
    paid: [{ id: "2", amount: 456.78, date: new Date().toISOString() }],
  },
  {
    id: "3",
    amount: 100,
    date: new Date().toISOString(),
    type: "variable",
    description: "Freizeit",
  },
];
const ExpensesSlide = ({ scrollToIndex }: SlideProps) => {
  return (
    <>
      <Style_Features>
        <Label size="l" weight="bold" align="center">
          Verfolge deine Ausgaben
        </Label>
        <MockExpenses expenses={mockExpenses} type="fixed" />
        <MockExpenses expenses={mockExpenses} type="variable" />
        <RowView justifyContent="center">
          <Button type="primary" padding="l" disabled>
            <FontAwesomeIcon icon="plus" color="background" size="l" />
          </Button>
        </RowView>
        <Label size="s" color="textSecondary" align="center">
          Füge deine Ausgaben hinzu und behalte den Überblick über deine
          Finanzen.
        </Label>
      </Style_Features>
      <Button type="primary" onPress={() => scrollToIndex("realtime-updates")}>
        <Label color="background">Weiter</Label>
        <FontAwesomeIcon icon="arrow-right" color="background" />
      </Button>
    </>
  );
};

export default ExpensesSlide;
