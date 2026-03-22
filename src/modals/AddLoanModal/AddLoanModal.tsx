import { ScrollView, View } from "react-native";
import Modal from "../../components/Modal/Modal";
import Label from "../../components/Label/Label";
import Input from "../../components/Input/Input";
import RowView from "../../components/RowView/RowView";
import currency from "../../helpers/numberCurrency";
import Pressable from "../../components/Pressable/Pressable";
import FontAwesomeIcon from "../../components/FontAwesomeIcon/FontAwesomeIcon";
import Button from "../../components/Button/Button";
import React, { useState } from "react";
import { Loan } from "../../types/loans.type";
import uuid from "react-native-uuid";
import { useMMKVObject } from "react-native-mmkv";
import styled, { css } from "styled-components/native";
import Separator from "../../components/Separator/Separator";
import parseValue from "../../helpers/parseValue";

type AddLoanModalProps = {
  isVisible: boolean;
  setIsVisible: React.Dispatch<
    React.SetStateAction<AddLoanModalProps["isVisible"]>
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

const AddLoanModal = ({ isVisible, setIsVisible }: AddLoanModalProps) => {
  const [draftLoan, setDraftLoan] = useState<string>();
  const [description, setDescription] = useState<string>();
  const [draftLoans, setDraftLoans] = useState<Loan["lend"]>();
  const [, setLoans] = useMMKVObject<Loan[]>("loans");
  const onRequestClose = () => setIsVisible(false);

  const onDeleteLoanPress = (id: number) => {
    setDraftLoans(draftLoans?.filter((_, index) => index !== id));
  };

  const onAddDraftLoanPress = () => {
    if (!draftLoan) return;
    const convertedLoan = parseValue(draftLoan);
    setDraftLoans([...(draftLoans || []), convertedLoan]);
    setDraftLoan(undefined);
  };

  const onSubmitPress = () => {
    if (!draftLoans?.length) return;
    const loanObj: Loan = {
      id: uuid.v4(),
      description,
      lend: draftLoans,
    };
    setLoans((loans) => [...(loans || []), loanObj]);
    setDescription(undefined);
    setDraftLoan(undefined);
    setDraftLoans(undefined);
    setIsVisible(false);
  };
  return (
    <View>
      <ScrollView>
        <Modal visible={isVisible} onRequestClose={onRequestClose}>
          <Label color="textSecondary" size="s">
            Eintrag verfassen
          </Label>
          <Input
            placeholder="Beschreibung (optional)"
            value={description}
            onChangeText={setDescription}
          />
          <Separator space="none" />
          <Label size="s" color="danger">
            Geliehen
          </Label>
          <Style_ScrollView>
            {draftLoans?.map((loan, index) => (
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
              placeholder="Wert"
              keyboardType="decimal-pad"
              value={draftLoan}
              onChangeText={setDraftLoan}
              onSubmitEditing={onAddDraftLoanPress}
              isFullWidth
            />
            <Pressable onPress={onAddDraftLoanPress}>
              <FontAwesomeIcon icon="plus" color="primary" />
            </Pressable>
          </RowView>
          <Button onPress={onSubmitPress} disabled={!draftLoans?.length}>
            <Label>Hinzufügen</Label>
          </Button>
        </Modal>
      </ScrollView>
    </View>
  );
};

export default AddLoanModal;
