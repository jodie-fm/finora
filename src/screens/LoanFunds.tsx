import Label from '../components/Label/Label';
import Layout01 from '../layouts/Layout01';
import styled, { css } from 'styled-components/native';
import BaseCard from '../components/BaseCard/BaseCard';
import { CircularProgressBase } from 'react-native-circular-progress-indicator';
import { useMMKVObject } from 'react-native-mmkv';
import { Loan } from '../types/loans.type';
import { useState } from 'react';
import numberCurrency from '../helpers/numberCurrency';
import RowView from '../components/RowView/RowView';
import FontAwesomeIcon from '../components/FontAwesomeIcon/FontAwesomeIcon';
import Pressable from '../components/Pressable/Pressable';
import Separator from '../components/Separator/Separator';
import EditLoanModal from "../modals/EditLoanModal/EditLoanModal";
import { useIsFocused } from "@react-navigation/native";
import AddLoanModal from "../modals/AddLoanModal/AddLoanModal";
import { Screens } from "../constants/Screens";
import SafeScrollView from "../components/ScrollView/SafeScrollView";
import { View } from "react-native";

const Style_ProgressBar = styled(CircularProgressBase)
  .attrs(({ theme }) => ({
    circleBackgroundColor: theme.color.background,
    inActiveStrokeColor: theme.color.background,
    activeStrokeColor: theme.color.primary,
    inActiveStrokeWidth: 24,
    radius: 75,
    duration: 1000,
  }))``;

const Style_ProgressBarContainer = styled.View`
  justify-content: center;
  align-items: center;
`;

const Style_Item = styled(Pressable)`
  ${({ theme }) => css`
    gap: ${theme.size.m.px};
  `}
`;

const Style_Check = styled.View`
  position: absolute;
  right: 0;
  border-radius: 999px;
  ${({ theme }) => css`
    background-color: ${theme.color.surface};
    transform: translate(${theme.size.l.value * 8}px, -${theme.size.l.value * 8}px);
  `}
`

const LoanFunds = () => {
  const isFocused = useIsFocused();
  const [ loans ] = useMMKVObject<Loan[]>('loans');
  const [ loanId, setLoanId ] = useState<Loan['id']>();
  const [ isEditModalVisible, setIsEditModalVisible ] = useState(false);
  const [ isAddModalVisible, setIsAddModalVisible ] = useState(false);

  const onItemPress = (id: string) => {
    setLoanId(id);
    setIsEditModalVisible(true);
  }

  const renderItem = ({
    id,
    description,
    lend,
    returned
  }: NonNullable<typeof loans>[number]) => {
    const totalLend = lend?.reduce((acc, amount) => (acc + amount), 0) || 0;
    const totalReturned = Math.min(returned?.reduce((acc, amount) => (acc + amount), 0) || 0, totalLend);
    const rest = totalLend - totalReturned;
    return (<BaseCard key={id}>
      {rest === 0 && <Style_Check>
        <FontAwesomeIcon icon="check-circle" color="success" size="l" />
      </Style_Check>}
      <Style_Item onPress={() => onItemPress(id)}>
        <RowView>
          {description && <Label weight="bold">{description}</Label>}
          <FontAwesomeIcon
            icon="pen"
            color="textSecondary"
            size="s"
            style={{
              marginLeft: 'auto',
            }}
          />
        </RowView>
        <Style_ProgressBarContainer>
          <Style_ProgressBar
            value={totalReturned}
            maxValue={totalLend}
          >
            <Label align="center" weight="bold">{numberCurrency(totalReturned)}</Label>
            <Label align="center" color="textSecondary" size="s">/{numberCurrency(totalLend)}</Label>
          </Style_ProgressBar>
        </Style_ProgressBarContainer>
        <Separator space="none" />
        <RowView
          style={{
            justifyContent: 'space-between',
          }}
        >
          <Label color="textSecondary" size="s">
            Restbetrag
          </Label>
          <Label color="textSecondary" size="s" weight="bold">
            {numberCurrency(rest)}
          </Label>
        </RowView>
      </Style_Item>
    </BaseCard>);
  }

  return isFocused && (<Layout01 title={Screens.LOANFUNDS} onCTAClick={() => setIsAddModalVisible(true)}>
    <SafeScrollView>
      {loans?.map(renderItem)}
      {!loans || loans.length === 0 && <View>
        <Label color="textSecondary" align="center">Keine Einträge vorhanden.</Label>
        <Label color="textSecondary" align="center">Klicken Sie auf das "+", um eins hinzuzufügen.</Label>
      </View>}
      <EditLoanModal loanId={loanId} visible={isEditModalVisible} setVisible={setIsEditModalVisible} />
      <AddLoanModal isVisible={isAddModalVisible} setIsVisible={setIsAddModalVisible} />
    </SafeScrollView>
  </Layout01>);
};

export default LoanFunds;