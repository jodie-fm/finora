import { ScrollView, View } from "react-native";
import Modal from "../../components/Modal/Modal";
import Label from "../../components/Label/Label";
import Picker from "../../components/Picker/Picker";
import { Expense } from "../../types/expenses.type";
import Input from "../../components/Input/Input";
import RowView from "../../components/RowView/RowView";
import Button from "../../components/Button/Button";
import React, { useEffect, useState } from "react";
import {
  Picker as RNPicker,
  PickerItemProps,
} from "@react-native-picker/picker";
import { useTheme } from "styled-components/native";
import uuid from "react-native-uuid";
import parseValue from "../../helpers/parseValue";
import {
  useAddExpenseEvent,
  useExpenseState,
} from "../../hooks/useExpenseEventHandler";

type AddExpenseModalProps = {
  isVisible: boolean;
  setIsVisible: React.Dispatch<
    React.SetStateAction<AddExpenseModalProps["isVisible"]>
  >;
};

const AddExpenseModal = ({ isVisible, setIsVisible }: AddExpenseModalProps) => {
  const theme = useTheme();
  const state = useExpenseState();
  const addExpenseEvent = useAddExpenseEvent();
  const [type, setType] = useState<Expense["type"]>("variable");
  const [description, setDescription] = useState<string>();
  const [expense, setExpense] = useState<string>();
  const props: Partial<PickerItemProps> = {
    color: theme.color.primary,
    style: {
      backgroundColor: theme.color.surface,
    },
  };

  const onRequestClose = () => {
    setIsVisible(false);
    setDescription(undefined);
    setExpense(undefined);
  };

  const onSubmit = () => {
    if (!expense) return;
    const expenseObject: Expense = {
      id: uuid.v4(),
      type,
      description,
      amount: parseValue(expense),
      paid: type === "fixed" ? [] : undefined,
      date: new Date().toISOString(),
    };
    addExpenseEvent({
      action: "added",
      expense: expenseObject,
    });
  };

  useEffect(() => {
    if (!state?.expenses) return;
    onRequestClose();
  }, [state?.expenses]);

  return (
    <View>
      <ScrollView>
        <Modal visible={isVisible} onRequestClose={onRequestClose}>
          <Label size="s" color="textSecondary">
            Eintrag verfassen
          </Label>
          <Picker
            mode="dropdown"
            selectedValue={type}
            textColor="primary"
            onValueChange={(item) => setType(item as Expense["type"])}
          >
            <RNPicker.Item label="Buchung" value="variable" {...props} />
            <RNPicker.Item label="Fixe Kosten" value="fixed" {...props} />
          </Picker>
          <View>
            <Label size="s">Beschreibung</Label>
            <Input
              placeholder="Beschreibung"
              value={description}
              onChangeText={setDescription}
            />
          </View>
          <View>
            <Label size="s">
              Wert{" "}
              <Label size="s" color="danger">
                *
              </Label>
            </Label>
            <RowView>
              <Input
                placeholder="12,34"
                keyboardType="decimal-pad"
                value={expense}
                onChangeText={setExpense}
                onSubmitEditing={onSubmit}
                isFullWidth
              />
              <Label>€</Label>
            </RowView>
          </View>
          <Button onPress={onSubmit} disabled={!expense}>
            <Label align="center">Hinzufügen</Label>
          </Button>
        </Modal>
      </ScrollView>
    </View>
  );
};

export default AddExpenseModal;
