import React, { useState } from "react";
import Button from "../../../components/Button/Button";
import FontAwesomeIcon from "../../../components/FontAwesomeIcon/FontAwesomeIcon";
import Label from "../../../components/Label/Label";
import { Style_Hero } from "../Onboarding.style";
import RowView from "../../../components/RowView/RowView";
import Input from "../../../components/Input/Input";
import { SlideProps } from "./Slides.type";
import {
  useAddExpenseEvent,
  useExpenseState,
} from "../../../hooks/useExpenseEventHandler";
import uuid from "react-native-uuid";
import parseValue from "../../../helpers/parseValue";

const SavingsSlide = ({ scrollToIndex }: SlideProps) => {
  const [savings, setSavings] = useState("");
  const state = useExpenseState();
  const addExpenseEvent = useAddExpenseEvent();

  const setValue = (value: number | undefined) => {
    addExpenseEvent({
      action: "updated",
      savings: value
        ? {
            id: uuid.v4(),
            amount: value,
            date: new Date().toISOString(),
          }
        : null,
      previousExpense: state?.savings,
    });
  };
  const onSubmitEditing = () => {
    setValue(savings ? parseValue(savings) : undefined);
    scrollToIndex("getStarted");
  };

  return (
    <>
      <Label size="l" weight="bold" align="center">
        Lege deine Ersparnisse fest (optional)
      </Label>
      <Label size="s" color="textSecondary" align="center">
        Wie viel möchtest du diesen Monat sparen? Keine Sorge, du kannst diesen
        Betrag später jederzeit anpassen.
      </Label>
      <Style_Hero>
        <RowView gap="xs">
          <Input
            placeholder="Ersparnisse"
            keyboardType="numeric"
            isFullWidth
            value={savings}
            onChangeText={setSavings}
            onSubmitEditing={onSubmitEditing}
          />
          <Label>€</Label>
        </RowView>
      </Style_Hero>
      <Button type="primary" onPress={onSubmitEditing}>
        <Label color="background">Weiter</Label>
        <FontAwesomeIcon icon="arrow-right" color="background" />
      </Button>
    </>
  );
};

export default SavingsSlide;
