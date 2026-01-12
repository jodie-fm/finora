import Modal from '../../components/Modal/Modal';
import RowView from '../../components/RowView/RowView';
import Label from '../../components/Label/Label';
import Button from '../../components/Button/Button';
import FontAwesomeIcon from '../../components/FontAwesomeIcon/FontAwesomeIcon';
import Input from '../../components/Input/Input';
import Separator from '../../components/Separator/Separator';
import numberCurrency from '../../helpers/numberCurrency';
import Pressable from '../../components/Pressable/Pressable';
import React, { useEffect, useState } from 'react';
import { BaseExpense, Expense } from '../../types/expenses.type';
import styled, { css } from 'styled-components/native';
import { View } from 'react-native';
import parseValue from "../../helpers/parseValue";
import uuid from "react-native-uuid";
import { useExpenseEventHandler } from "../../hooks/useExpenseEventHandler";

type EditExpenseModalProps = {
  expense: Expense;
  visible: boolean;
  setVisible: React.Dispatch<React.SetStateAction<EditExpenseModalProps['visible']>>;
}

type EditExpenseProps = Omit<Expense, 'amount'> & {
  amount: string;
}

const Style_FlatList = styled.FlatList
  .attrs(({ theme }) => ({
    contentContainerStyle: {
      gap: theme.size.s.value * 16,
      padding: theme.size.s.value * 16,
    }
  }))`
  max-height: 100px;
  ${({ theme }) => css`
    border-radius: ${theme.size.s.px};
    background-color: ${theme.color.background};
  `}
`

const EditExpenseModal = ({
  expense,
  visible,
  setVisible
}: EditExpenseModalProps) => {
  const {
    state,
    addExpenseEvent,
  } = useExpenseEventHandler();
  const [ editPaidValue, setEditPaidValue ] = useState<string>();
  const [ editExpense, setEditExpense ] = useState<EditExpenseProps>();

  const onRequestClose = () => {
    setVisible(false);
  };

  const onDeletePress = () => {
    addExpenseEvent({
      action: 'deleted',
      expense: state?.expenses?.find(e => e.id === expense.id)
    })
    setVisible(false);
  };

  const onDeletePaidPress = (id: string) => {
    if (!editExpense) return;
    const newPaid = editExpense?.paid?.filter((item) => item.id !== id);
    setEditExpense({
      ...editExpense,
      paid: newPaid
    });
  }

  const onEditChange = (expense: Partial<EditExpenseProps>) => {
    if (!editExpense) return;
    setEditExpense({
      ...editExpense, ...expense
    });
  }

  const onSubmitEdit = () => {
    if (!editExpense || !editExpense.amount) return;
    const previousExpense = state?.expenses?.find(expense => expense.id === editExpense.id);
    addExpenseEvent({
      action: 'updated',
      expense: {
        ...previousExpense, ...editExpense,
        amount: parseValue(editExpense.amount)
      },
      previousExpense
    })
    setVisible(false);
  }

  const onSubmitPaidEdit = () => {
    if (!editPaidValue) return;
    const editPaid: BaseExpense = {
      id: uuid.v4(),
      amount: parseValue(editPaidValue),
      date: new Date().toISOString(),
    }
    editPaidValue && onEditChange({
      paid: [
        ...(editExpense?.paid || []), editPaid
      ]
    })
    setEditPaidValue(undefined);
  }

  useEffect(() => {
    setEditExpense({
      ...expense,
      amount: expense.amount.toString(),
    });
  }, [ expense ]);

  return (<Modal
    visible={visible}
    onRequestClose={onRequestClose}
  >
    <View>
      <Label size="s">Beschreibung</Label>
      <RowView justifyContent="space-between">
        <Input
          placeholder="Beschreibung"
          value={editExpense?.description}
          onChangeText={(value) => onEditChange({ description: value })}
          isFullWidth
        />
        <Pressable
          onPress={onDeletePress}
          hitSlop={16}
        >
          <FontAwesomeIcon color="danger" size="s" icon="trash" />
        </Pressable>
      </RowView>
    </View>
    <View>
      <Label size="s">Wert <Label size="s" color="danger">*</Label></Label>
      <RowView>
        <Input
          placeholder="12,34"
          value={editExpense?.amount}
          onChangeText={(value) => onEditChange({ amount: value })}
          keyboardType="decimal-pad"
          isFullWidth
        />
        <Label>€</Label>
      </RowView>
    </View>
    {editExpense?.type === 'fixed' && (<>
      <Separator space="none" />
      <Label size="s" color="textSecondary">Bezahlt {editExpense.paid && editExpense.paid.length > 0 ? `(${editExpense.paid.length})` : ''}</Label>
      <Style_FlatList
        data={editExpense.paid}
        keyExtractor={(item) => (item as BaseExpense).id}
        renderItem={({
          item
        }) => {
          const paid = item as BaseExpense;
          return (<RowView justifyContent="space-between">
            <Label color="textPrimary" weight="bold">{numberCurrency(paid.amount)}</Label>
            <Pressable onPress={() => onDeletePaidPress(paid.id)}>
              <FontAwesomeIcon color="danger" size="l" icon="xmark" />
            </Pressable>
          </RowView>)
        }}
      />
      <RowView>
        <Input
          value={editPaidValue}
          placeholder="12,34"
          keyboardType="decimal-pad"
          onChangeText={setEditPaidValue}
          onSubmitEditing={onSubmitPaidEdit}
          isFullWidth
        />
        <Pressable onPress={onSubmitPaidEdit}>
          <FontAwesomeIcon color="primary" size="l" icon="add" />
        </Pressable>
      </RowView>
    </>)}
    <Button onPress={onSubmitEdit}><Label align="center">OK</Label></Button>
  </Modal>)
}

export default EditExpenseModal;