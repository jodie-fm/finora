import React, { useCallback, useMemo, useState } from "react";
import Layout01 from "../../layouts/Layout01";
import { Dimensions, View } from "react-native";
import styled, { css } from "styled-components/native";
import Button from "../../components/Button/Button";
import FontAwesomeIcon from "../../components/FontAwesomeIcon/FontAwesomeIcon";
import { SafeAreaView } from "react-native-safe-area-context";
import { FlatList, GestureHandlerRootView } from "react-native-gesture-handler";
import RowView from "../../components/RowView/RowView";
import { Keys, SlideProps } from "./slides/Slides.type";
import StartSlide from "./slides/StartSlide";
import OverviewSlide from "./slides/OverviewSlide";
import ExpensesSlide from "./slides/ExpensesSlide";
import UpdatesSlide from "./slides/UpdatesSlide";
import CurrentBalanceSlide from "./slides/CurrentBalanceSlide";
import SavingsSlide from "./slides/SavingsSlide";
import GetStartedSlide from "./slides/GetStartedSlide";
import Steps from "../../components/Steps/Steps";

type SlideItem = {
  key: Keys;
  node: React.ReactNode | ((activeKey: Keys) => React.ReactNode);
};

const width = Dimensions.get("window").width;

const Style_Onboarding = styled(SafeAreaView)`
  width: ${width}px;

  ${({ theme }) => css`
    padding-left: ${theme.size.l.px};
    padding-right: ${theme.size.l.px};
  `}
`;

const keys: Keys[] = [
  "start",
  "overview",
  "expenses",
  "realtime-updates",
  "setup",
  "savings",
  "getStarted",
];

const Onboarding = () => {
  const refFlatList = React.useRef<FlatList>(null);
  const [activeKey, setActiveKey] = useState<Keys>("start");

  const scrollToIndex = useCallback<SlideProps["scrollToIndex"]>((index) => {
    refFlatList.current?.scrollToIndex({
      index: keys.indexOf(index),
    });
    setActiveKey(index);
  }, []);

  const topAction = useMemo(
    () => (
      <RowView gap="m">
        <Button
          onPress={() => scrollToIndex(keys[keys.indexOf(activeKey) - 1])}
          disabled={activeKey === "start"}
        >
          <FontAwesomeIcon icon="arrow-left" />
        </Button>
        <View style={{ flex: 1 }}>
          <Steps
            count={keys.length}
            currentCount={keys.indexOf(activeKey) + 1}
          />
        </View>
      </RowView>
    ),
    [activeKey, scrollToIndex],
  );

  const slides = useMemo<SlideItem[]>(
    () => [
      {
        key: "start",
        node: <StartSlide scrollToIndex={scrollToIndex} />,
      },
      {
        key: "overview",
        node: <OverviewSlide scrollToIndex={scrollToIndex} />,
      },
      {
        key: "expenses",
        node: <ExpensesSlide scrollToIndex={scrollToIndex} />,
      },
      {
        key: "realtime-updates",
        node: (activeKey: Keys) => (
          <UpdatesSlide scrollToIndex={scrollToIndex} activeKey={activeKey} />
        ),
      },
      {
        key: "setup",
        node: <CurrentBalanceSlide scrollToIndex={scrollToIndex} />,
      },
      {
        key: "savings",
        node: <SavingsSlide scrollToIndex={scrollToIndex} />,
      },
      {
        key: "getStarted",
        node: <GetStartedSlide />,
      },
    ],
    [scrollToIndex],
  );

  return (
    <GestureHandlerRootView>
      <Layout01 topAction={topAction} isBottomBarHidden>
        <FlatList
          ref={refFlatList}
          data={slides}
          viewabilityConfig={{ viewAreaCoveragePercentThreshold: 50 }}
          renderItem={({ item }) => (
            <Style_Onboarding edges={["bottom"]}>
              {typeof item.node === "function"
                ? item.node(activeKey)
                : item.node}
            </Style_Onboarding>
          )}
          keyExtractor={(item) => item.key}
          horizontal
          showsHorizontalScrollIndicator={false}
          bounces={false}
          scrollEnabled={false}
          removeClippedSubviews={false}
        />
      </Layout01>
    </GestureHandlerRootView>
  );
};

export default Onboarding;
