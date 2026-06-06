import React, { memo, useCallback, useState } from "react";
import Label from "../../../components/Label/Label";
import { Style_Hero } from "../Onboarding.style";
import RowView from "../../../components/RowView/RowView";
import Input from "../../../components/Input/Input";
import Button from "../../../components/Button/Button";
import FontAwesomeIcon from "../../../components/FontAwesomeIcon/FontAwesomeIcon";
import { SlideProps } from "./Slides.type";
import {
  useAddExpenseEvent,
  useExpenseState,
} from "../../../hooks/useExpenseEventHandler";
import uuid from "react-native-uuid";
import parseValue from "../../../helpers/parseValue";

const CurrentBalanceSlide = ({ scrollToIndex }: SlideProps) => {
  const [balance, setBalance] = useState("");
  const state = useExpenseState();
  const addExpenseEvent = useAddExpenseEvent();

  const setValue = useCallback(
    (value: number | undefined) =>
      addExpenseEvent({
        action: "updated",
        currentBalance: value
          ? {
              id: uuid.v4(),
              amount: value,
              date: new Date().toISOString(),
            }
          : null,
        previousExpense: state?.currentBalance,
      }),
    [addExpenseEvent, state?.currentBalance],
  );

  const onSubmitEditing = () => {
    if (!balance) return;
    setValue(balance ? parseValue(balance) : undefined);
    scrollToIndex("savings");
  };

  return (
    <>
      <Label size="l" weight="bold" align="center">
        Einrichten deiner Finanzen
      </Label>
      <Label size="s" color="textSecondary" align="center">
        Dein aktueller Saldo (Aktueller Kontostand). Keine Sorge, du kannst
        diesen später jederzeit anpassen.
      </Label>
      <Style_Hero>
        <RowView gap="xs">
          <Input
            placeholder="Aktueller Saldo"
            keyboardType="numeric"
            isFullWidth
            value={balance}
            onChangeText={setBalance}
            onSubmitEditing={onSubmitEditing}
          />
          <Label>€</Label>
        </RowView>
      </Style_Hero>
      <Button type="primary" onPress={onSubmitEditing} disabled={!balance}>
        <Label color="background">Weiter</Label>
        <FontAwesomeIcon icon="arrow-right" color="background" />
      </Button>
    </>
  );
};

export default memo(CurrentBalanceSlide);
