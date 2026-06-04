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
import React, { useMemo, useState } from "react";
import * as FileSystem from "expo-file-system";
import * as DocumentPicker from "expo-document-picker";
import * as Sharing from "expo-sharing";
import { Platform, View } from "react-native";
import { Loan } from "../types/loans.type";
import ConfirmModal from "../modals/ConfirmModal/ConfirmModal";
import {
  useExpenseEvents,
  useExpenseState,
  useExpenseStorage,
} from "../hooks/useExpenseEventHandler";
import { Screens } from "../constants/Screens";
import compactExpenseEvents from "../helpers/compactExpenseEvents";

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
  const state = useExpenseState();
  const expenseEvents = useExpenseEvents();
  const { MMKVCurrent, MMKVEvents } = useExpenseStorage();
  const MMKV = useMMKV();
  const themeObj = useTheme();
  const [loans] = useMMKVObject<Loan[]>("loans");
  const [isConfirmModalVisible, setConfirmModalVisible] = useState(false);
  const [isConfirmHistoryModalVisible, setConfirmHistoryModalVisible] =
    useState(false);
  const [isConfirmCompactHistoryVisible, setConfirmCompactHistoryVisible] =
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

  const onConfirmCompactHistoryPress = () => {
    const compactedEvents = compactExpenseEvents(expenseEvents, {
      retainRecentMonths: 6,
    });

    MMKVEvents.set("expenseEvents", JSON.stringify(compactedEvents));
    setConfirmCompactHistoryVisible(false);
  };

  const onCancelCompactHistoryPress = () => {
    setConfirmCompactHistoryVisible(false);
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

  const historyStats = useMemo(() => {
    const eventsCount = expenseEvents?.length || 0;
    const payloadCharacters = JSON.stringify(expenseEvents || []).length;
    const payloadKilobytes = payloadCharacters / 1024;

    return {
      eventsCount,
      payloadKilobytes,
    };
  }, [expenseEvents]);

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
        <Button onPress={() => setConfirmCompactHistoryVisible(true)}>
          <FontAwesomeIcon icon="compress" color="primary" />
          <Label align="center">Verlauf komprimieren</Label>
        </Button>
        <RowView justifyContent="space-between">
          <Label size="s" color="textSecondary">
            Verlauf Einträge
          </Label>
          <Label size="s" weight="bold">
            {historyStats.eventsCount}
          </Label>
        </RowView>
        <RowView justifyContent="space-between">
          <Label size="s" color="textSecondary">
            Verlauf Größe (ca.)
          </Label>
          <Label size="s" weight="bold">
            {historyStats.payloadKilobytes.toFixed(1)} KB
          </Label>
        </RowView>
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
        <ConfirmModal
          heading="Verlauf komprimieren?"
          subtext="Ältere Verlaufseinträge werden pro Tag auf den letzten Stand reduziert. Die letzten 6 Monate bleiben unverändert."
          buttons={[
            {
              type: "primary",
              onPress: onConfirmCompactHistoryPress,
              children: <Label align="center">Komprimieren</Label>,
            },
            {
              onPress: onCancelCompactHistoryPress,
              children: <Label align="center">Abbrechen</Label>,
            },
          ]}
          isVisible={isConfirmCompactHistoryVisible}
          setIsVisible={setConfirmCompactHistoryVisible}
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
        <View />
      </Style_Settings>
    </Layout01>
  );
};

export default Settings;
