import Modal from "../../components/Modal/Modal";
import RowView from "../../components/RowView/RowView";
import Label from "../../components/Label/Label";
import Button from "../../components/Button/Button";
import FontAwesomeIcon from "../../components/FontAwesomeIcon/FontAwesomeIcon";
import Input from "../../components/Input/Input";
import Separator from "../../components/Separator/Separator";
import currency from "../../helpers/numberCurrency";
import Pressable from "../../components/Pressable/Pressable";
import React, { useEffect, useState } from "react";
import { useMMKVObject } from "react-native-mmkv";
import { Expense } from "../../types/expenses.type";
import styled, { css } from "styled-components/native";
import { Loan } from "../../types/loans.type";
import parseValue from "../../helpers/parseValue";

type EditELoanModalProps = {
  loanId: Loan["id"] | undefined;
  visible: boolean;
  setVisible: React.Dispatch<
    React.SetStateAction<EditELoanModalProps["visible"]>
  >;
};

const Style_ScrollView = styled.ScrollView.attrs(({ theme }) => ({
  contentContainerStyle: {
    gap: theme.size.s.value * 16,
    padding: theme.size.s.value * 16,
  },
}))`
  max-height: 100px;
  ${({ theme }) => css`
    border-radius: ${theme.size.s.px};
    background-color: ${theme.color.background};
  `}
`;

const EditLoanModal = ({
  loanId,
  visible,
  setVisible,
}: EditELoanModalProps) => {
  const [loans, setLoans] = useMMKVObject<Loan[]>("loans");
  const [editLoanValue, setEditLoanValue] = useState<string>();
  const [editReturnValue, setEditReturnValue] = useState<string>();
  const [editLoan, setEditLoan] = useState<Loan>();

  const onRequestClose = () => {
    setVisible(false);
  };

  const onDeletePress = (id?: Expense["id"]) => {
    if (!id) return;
    const newExpenses = loans?.filter((expense) => expense.id !== id);
    setLoans(newExpenses);
    setVisible(false);
  };

  const onDeleteLoanPress = (index: number) => {
    if (!editLoan) return;
    const newLend = editLoan?.lend.filter((_, i) => i !== index);
    setEditLoan({
      ...editLoan,
      lend: newLend,
    });
  };

  const onDeleteReturnPress = (index: number) => {
    if (!editLoan || !editLoan.returned) return;
    const newReturned = editLoan?.returned.filter((_, i) => i !== index);
    setEditLoan({
      ...editLoan,
      returned: newReturned,
    });
  };

  const onEditChange = (loan: Partial<Loan>) => {
    if (!editLoan) return;
    setEditLoan({
      ...editLoan,
      ...loan,
    });
  };

  const onSubmitEdit = () => {
    if (!editLoan?.lend.length) return;
    const newLoans = loans?.map((loan) => {
      if (loan.id !== editLoan.id) return loan;
      return {
        ...loan,
        ...editLoan,
      };
    });
    setLoans(newLoans);
    setVisible(false);
  };

  const onSubmitLendEdit = () => {
    editLoanValue &&
      onEditChange({
        lend: [...(editLoan?.lend || []), parseValue(editLoanValue)],
      });
    setEditLoanValue(undefined);
  };

  const onSubmitReturnEdit = () => {
    editReturnValue &&
      onEditChange({
        returned: [...(editLoan?.returned || []), parseValue(editReturnValue)],
      });
    setEditReturnValue(undefined);
  };

  useEffect(() => {
    if (!loanId) return;

    const loan = loans?.find((loan) => loan.id === loanId);
    if (!loan) return;

    setEditLoan(loan);
  }, [loanId]);

  return (
    <Modal visible={visible} onRequestClose={onRequestClose}>
      <RowView
        style={{ justifyContent: "space-between", alignItems: "center" }}
      >
        <Input
          placeholder="Beschreibung (optional)"
          value={editLoan?.description}
          onChangeText={(value) => onEditChange({ description: value })}
          isFullWidth
        />
        <Pressable onPress={() => onDeletePress(loanId)} hitSlop={16}>
          <FontAwesomeIcon color="danger" size="s" icon="trash" />
        </Pressable>
      </RowView>
      <Separator space="none" />
      <Label size="s" color="danger">
        Geliehen
      </Label>
      <Style_ScrollView>
        {editLoan?.lend.map((loan, index) => (
          <RowView key={index} style={{ justifyContent: "space-between" }}>
            <Label color="textPrimary" weight="bold">
              {currency(loan)}
            </Label>
            <Pressable onPress={() => onDeleteLoanPress(index)}>
              <FontAwesomeIcon color="danger" size="l" icon="xmark" />
            </Pressable>
          </RowView>
        ))}
      </Style_ScrollView>
      <RowView>
        <Input
          placeholder="Wert in EUR"
          keyboardType="decimal-pad"
          value={editLoanValue}
          onChangeText={setEditLoanValue}
          onSubmitEditing={onSubmitLendEdit}
          isFullWidth
        />
        <Pressable onPress={onSubmitLendEdit}>
          <FontAwesomeIcon icon="plus" color="primary" />
        </Pressable>
      </RowView>
      <Separator space="none" />
      <Label size="s" color="success">
        Zurückgezahlt
      </Label>
      <Style_ScrollView>
        {editLoan?.returned?.map((returned, index) => (
          <RowView key={index} style={{ justifyContent: "space-between" }}>
            <Label color="textPrimary" weight="bold">
              {currency(returned)}
            </Label>
            <Pressable onPress={() => onDeleteReturnPress(index)}>
              <FontAwesomeIcon color="danger" size="l" icon="xmark" />
            </Pressable>
          </RowView>
        ))}
      </Style_ScrollView>
      <RowView>
        <Input
          placeholder="Wert in EUR"
          keyboardType="decimal-pad"
          value={editReturnValue}
          onChangeText={setEditReturnValue}
          onSubmitEditing={onSubmitReturnEdit}
          isFullWidth
        />
        <Pressable onPress={onSubmitReturnEdit}>
          <FontAwesomeIcon icon="plus" color="primary" />
        </Pressable>
      </RowView>
      <Button onPress={onSubmitEdit} disabled={!editLoan?.lend.length}>
        <Label align="center">OK</Label>
      </Button>
    </Modal>
  );
};

export default EditLoanModal;
