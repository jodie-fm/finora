import BaseCard from "../BaseCard/BaseCard";
import Label from "../Label/Label";
import { View } from "react-native";
import currency from "../../helpers/numberCurrency";
import FontAwesomeIcon from "../FontAwesomeIcon/FontAwesomeIcon";
import Pressable from "../Pressable/Pressable";
import styled from "styled-components/native";
import React, { useState } from "react";
import InputValueModal from "../../modals/InputValueModal/InputValueModal";
import uuid from "react-native-uuid";
import { useExpenseEventHandler } from "../../hooks/useExpenseEventHandler";

const Style_Item = styled(Pressable)`
  flex-direction: row;
  align-items: center;
`;

const SavingsCard = () => {
  const { state, addExpenseEvent } = useExpenseEventHandler();
  const [isModalVisible, setModalVisible] = useState(false);

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

  return (
    <BaseCard>
      <Style_Item onPress={() => setModalVisible(true)}>
        <View style={{ flex: 1 }}>
          <Label color="textSecondary" size="s">
            Ersparnis
          </Label>
          <Label color="textSecondary" weight="bold">
            {currency(state?.savings?.amount)}
          </Label>
        </View>
        <FontAwesomeIcon icon="pen" color="textSecondary" />
        <InputValueModal
          label="Ersparnis"
          isVisible={isModalVisible}
          setIsVisible={setModalVisible}
          value={state?.savings?.amount}
          setValue={setValue}
        />
      </Style_Item>
    </BaseCard>
  );
};

export default SavingsCard;
