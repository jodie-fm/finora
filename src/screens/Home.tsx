import React, { useState } from 'react';
import Layout01 from '../layouts/Layout01';
import styled, { css } from 'styled-components/native';
import TotalCard from '../components/TotalCard/TotalCard';
import ExpensesCard from '../components/ExpensesCard/ExpensesCard';
import SavingsCard from "../components/SavingsCard/SavingsCard";
import SafeScrollView from "../components/ScrollView/SafeScrollView";
import AddExpenseModal from "../modals/AddExpenseModal/AddExpenseModal";
import { Screens } from "../constants/Screens";
import { useIsScrollEnabled } from "../hooks/useAppStore";

const Style_CardContainer = styled.View`
  display: flex;
  ${({ theme }) => css`
    gap: ${(theme.size.s.value / 1.5) * 16}px;
  `}
`;
const Home = () => {
  const [ isModalVisible, setIsModalVisible ] = useState(false);
  const isScrollEnabled = useIsScrollEnabled();

  const onPress = () => {
    setIsModalVisible(true);
  };

  return (<Layout01 title={Screens.HOME} onCTAClick={onPress}>
    <SafeScrollView scrollEnabled={isScrollEnabled}>
      <TotalCard />
      <SavingsCard />
      <Style_CardContainer>
        <ExpensesCard type="fixed" />
      </Style_CardContainer>
      <Style_CardContainer>
        <ExpensesCard type="variable" />
      </Style_CardContainer>
      <AddExpenseModal isVisible={isModalVisible} setIsVisible={setIsModalVisible} />
    </SafeScrollView>
  </Layout01>);
};

export default Home;