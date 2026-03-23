import React, { useState } from "react";
import Layout01 from "../layouts/Layout01";
import styled, { css } from "styled-components/native";
import TotalCard from "../components/TotalCard/TotalCard";
import ExpensesCard from "../components/ExpensesCard/ExpensesCard";
import SafeScrollView from "../components/ScrollView/SafeScrollView";
import AddExpenseModal from "../modals/AddExpenseModal/AddExpenseModal";
import { Screens } from "../constants/Screens";
import { useIsScrollEnabled } from "../hooks/useAppStore";
import Button from "../components/Button/Button";
import FontAwesomeIcon from "../components/FontAwesomeIcon/FontAwesomeIcon";
import InputValueModal from "../modals/InputValueModal/InputValueModal";
import { useExpenseEventHandler } from "../hooks/useExpenseEventHandler";
import uuid from "react-native-uuid";
import currency from "../helpers/numberCurrency";
import Label from "../components/Label/Label";

const Style_CardContainer = styled.View`
  display: flex;
  ${({ theme }) => css`
    gap: ${(theme.size.s.value / 1.5) * 16}px;
  `}
`;
const Home = () => {
  const { state, addExpenseEvent } = useExpenseEventHandler();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isSavingsModalVisible, setIsSavingsModalVisible] = useState(false);
  const isScrollEnabled = useIsScrollEnabled();

  const onPress = () => {
    setIsModalVisible(true);
  };

  const topAction = (
    <Button padding="s" onPress={() => setIsSavingsModalVisible(true)}>
      {state?.savings?.amount && (
        <Label color="textSecondary" size="s" weight="bold">
          {currency(state?.savings?.amount)}
        </Label>
      )}
      <FontAwesomeIcon
        icon="piggy-bank"
        color={state?.savings ? "primary" : "textPrimary"}
      />
    </Button>
  );

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
    <Layout01 title={Screens.HOME} topAction={topAction} onCTAClick={onPress}>
      <SafeScrollView scrollEnabled={isScrollEnabled}>
        <TotalCard />
        <Style_CardContainer>
          <ExpensesCard type="fixed" />
        </Style_CardContainer>
        <Style_CardContainer>
          <ExpensesCard type="variable" />
        </Style_CardContainer>
        <InputValueModal
          label="Ersparnis"
          isVisible={isSavingsModalVisible}
          setIsVisible={setIsSavingsModalVisible}
          value={state?.savings?.amount}
          setValue={setValue}
        />
        <AddExpenseModal
          isVisible={isModalVisible}
          setIsVisible={setIsModalVisible}
        />
      </SafeScrollView>
    </Layout01>
  );
};

export default Home;
