import { Host } from "@expo/ui";
import React from "react";
import { View, Platform } from "react-native";
import BaseCard from "../../components/BaseCard/BaseCard";
import RowView from "../../components/RowView/RowView";
import Separator from "../../components/Separator/Separator";
import currency from "../../helpers/numberCurrency";
import Label from "../../components/Label/Label";
import FontAwesomeIcon from "../../components/FontAwesomeIcon/FontAwesomeIcon";
import { LinearProgressIndicator } from "@expo/ui/jetpack-compose";
import { ProgressView } from "@expo/ui/swift-ui";
import { tint } from "@expo/ui/swift-ui/modifiers";
import styled, { css } from "styled-components/native";
import ProgressIndicator from "../../components/ProgressIndicator/ProgressIndicator";

const Style_ProgressSeparator = styled.View<{ $hasBottomMargin: boolean }>`
  ${({ theme, $hasBottomMargin }) => css`
    margin-top: ${theme.size.m.px};
    ${$hasBottomMargin &&
    css`
      margin-bottom: ${theme.size.m.px};
    `}
  `}
`;

const MockTotalCard = () => {
  return (
    <BaseCard>
      <View>
        <Label color="textSecondary" size="s">
          Aktueller Saldo
        </Label>
        <Label color="textSecondary" weight="bold">
          {currency(1000)}
        </Label>
      </View>
      <Separator />
      <RowView gap="xs">
        <Label color="textSecondary" size="s">
          Restsaldo
        </Label>
        <FontAwesomeIcon color={"success"} icon="arrow-trend-up" size="s" />
        <Label color={"success"} size="s">
          {currency(123.45)}
        </Label>
      </RowView>
      <Label color={"primary"} weight="bold" size="xxl">
        {currency(123.45)}
      </Label>
      <Style_ProgressSeparator $hasBottomMargin>
        <ProgressIndicator progress={123.45 / 1000} />
      </Style_ProgressSeparator>
      <RowView style={{ justifyContent: "space-between" }}>
        <Label color="textSecondary" size="s">
          Fixe Kosten
        </Label>
        <Label color="textSecondary" size="s" weight="bold">
          {currency(600)}
        </Label>
      </RowView>

      <RowView style={{ justifyContent: "space-between" }}>
        <Label color="textSecondary" size="s">
          Buchungen
        </Label>
        <Label color="textSecondary" size="s" weight="bold">
          {currency(100)}
        </Label>
      </RowView>
      <RowView style={{ justifyContent: "space-between" }}>
        <Label color="textSecondary" size="s">
          Ersparnisse
        </Label>
        <Label color="textSecondary" size="s" weight="bold">
          {currency(1000 - 123.45 - 600 - 100)}
        </Label>
      </RowView>
    </BaseCard>
  );
};

export default MockTotalCard;
