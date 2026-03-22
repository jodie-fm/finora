import Layout01 from "../layouts/Layout01";
import Button from "../components/Button/Button";
import { useMMKV, useMMKVObject, useMMKVString } from "react-native-mmkv";
import styled, { css, useTheme } from "styled-components/native";
import Label from "../components/Label/Label";
import {
  Picker as RNPicker,
  PickerItemProps,
} from "@react-native-picker/picker";
import Picker from "../components/Picker/Picker";
import Separator from "../components/Separator/Separator";
import RowView from "../components/RowView/RowView";
import FontAwesomeIcon from "../components/FontAwesomeIcon/FontAwesomeIcon";
import React, { useState } from "react";
import * as FileSystem from "expo-file-system";
import * as DocumentPicker from "expo-document-picker";
import * as Sharing from "expo-sharing";
import { Platform } from "react-native";
import { Loan } from "../types/loans.type";
import ConfirmModal from "../modals/ConfirmModal/ConfirmModal";
import { useExpenseEventHandler } from "../hooks/useExpenseEventHandler";
import { Screens } from "../constants/Screens";

const Style_Settings = styled.ScrollView.attrs(({ theme }) => {
  return {
    contentContainerStyle: {
      gap: theme.size.l.value * 16,
    },
  };
})`
  ${({ theme }) => css`
    padding-inline: ${theme.size.l.px};
  `}
`;

const Settings = () => {
  const { MMKVCurrent, MMKVEvents, state, expenseEvents } =
    useExpenseEventHandler();
  const MMKV = useMMKV();
  const themeObj = useTheme();
  const [loans] = useMMKVObject<Loan[]>("loans");
  const [isConfirmModalVisible, setConfirmModalVisible] = useState(false);
  const [isConfirmHistoryModalVisible, setConfirmHistoryModalVisible] =
    useState(false);
  const [theme, setTheme] = useMMKVString("theme");
  const props: Partial<PickerItemProps> = {
    color: themeObj.color.textPrimary,
    style: {
      width: "100%",
      backgroundColor: themeObj.color.background,
    },
  };

  const onConfirmDeletePress = () => {
    MMKV.clearAll();
    MMKVCurrent.clearAll();
    onConfirmHistoryDeletePress();
    setConfirmModalVisible(false);
  };

  const onCancelDeletePress = () => {
    setConfirmModalVisible(false);
  };

  const onConfirmHistoryDeletePress = () => {
    MMKVEvents.clearAll();
    setConfirmHistoryModalVisible(false);
  };

  const onCancelHistoryDeletePress = () => {
    setConfirmHistoryModalVisible(false);
  };

  const importData = async () => {
    const result = await DocumentPicker.getDocumentAsync({
      type: "application/json",
    });

    if (result.canceled) return;

    const fileContent = await FileSystem.readAsStringAsync(
      result.assets[0].uri,
    );
    const data: {
      state: typeof state;
      expenseEvents: typeof expenseEvents;
      loans: typeof loans;
    } = JSON.parse(fileContent);

    if (data.state) {
      MMKVCurrent.set("state", JSON.stringify(data.state));
    }
    if (data.expenseEvents) {
      MMKVEvents.set("expenseEvents", JSON.stringify(data.expenseEvents));
    }
    if (data.loans) {
      MMKV.set("loans", JSON.stringify(data.loans));
    }
  };

  const exportData = async () => {
    const json = JSON.stringify({
      state,
      expenseEvents,
      loans,
    });
    const filename = `Finora_${new Date().toISOString().split("T")[0]}.json`;
    const path = FileSystem.cacheDirectory + filename;
    await FileSystem.writeAsStringAsync(path, json);

    if (Platform.OS === "android") {
      const permissions =
        await FileSystem.StorageAccessFramework.requestDirectoryPermissionsAsync();

      if (!permissions.granted) {
        await FileSystem.deleteAsync(path);
        return;
      }

      const uri = await FileSystem.StorageAccessFramework.createFileAsync(
        permissions.directoryUri,
        filename,
        "application/json",
      );
      await FileSystem.StorageAccessFramework.writeAsStringAsync(uri, json);
    } else {
      if (!(await Sharing.isAvailableAsync())) {
        await FileSystem.deleteAsync(path);
        return;
      }
      await Sharing.shareAsync(path);
    }
    await FileSystem.deleteAsync(path);
  };

  return (
    <Layout01 title={Screens.SETTINGS}>
      <Style_Settings>
        <RowView>
          <Label>
            <FontAwesomeIcon color="textPrimary" icon="palette" />
          </Label>
          <Picker
            mode="dropdown"
            style={{ flex: 1 }}
            selectedValue={theme}
            onValueChange={(value) => setTheme(value as string)}
          >
            <RNPicker.Item value="light" label="Hell" {...props} />
            <RNPicker.Item value="dark" label="Dunkel" {...props} />
          </Picker>
        </RowView>
        <Separator />
        <Label weight="bold" size="l">
          Verlauf
        </Label>
        <Button
          type="danger"
          onPress={() => setConfirmHistoryModalVisible(true)}
        >
          <FontAwesomeIcon icon="history" color="danger" />
          <Label color="danger" align="center">
            Verlauf löschen
          </Label>
        </Button>
        <ConfirmModal
          heading="Wirklich den Verlauf löschen?"
          subtext="Durch den Verlauf werden zeitliche Analysen, Auswertungen & Trends dargestellt."
          buttons={[
            {
              type: "danger",
              onPress: onConfirmHistoryDeletePress,
              children: (
                <Label align="center" color="danger">
                  Löschen
                </Label>
              ),
            },
            {
              onPress: onCancelHistoryDeletePress,
              children: <Label align="center">Abbrechen</Label>,
            },
          ]}
          isVisible={isConfirmHistoryModalVisible}
          setIsVisible={setConfirmHistoryModalVisible}
        />
        <Separator />
        <Label weight="bold" size="l">
          Daten
        </Label>
        <RowView>
          <Button onPress={importData} isFullWidth>
            <FontAwesomeIcon icon="file-import" />
            <Label>Import</Label>
          </Button>
          <Button onPress={exportData} isFullWidth>
            <FontAwesomeIcon icon="file-export" />
            <Label>Export</Label>
          </Button>
        </RowView>
        <Button type="danger" onPress={() => setConfirmModalVisible(true)}>
          <FontAwesomeIcon icon="warning" color="danger" />
          <Label color="danger" align="center">
            Alle Daten löschen
          </Label>
        </Button>
        <ConfirmModal
          heading="Wirklich alle Daten löschen?"
          buttons={[
            {
              type: "danger",
              onPress: onConfirmDeletePress,
              children: (
                <Label align="center" color="danger">
                  Löschen
                </Label>
              ),
            },
            {
              onPress: onCancelDeletePress,
              children: <Label align="center">Abbrechen</Label>,
            },
          ]}
          isVisible={isConfirmModalVisible}
          setIsVisible={setConfirmModalVisible}
        />
      </Style_Settings>
    </Layout01>
  );
};

export default Settings;
