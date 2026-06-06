import "react-native-gesture-handler";
import React, { ComponentProps, useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import { NavigationBar } from "expo-navigation-bar";
import * as SplashScreen from "expo-splash-screen";
import { ThemeProvider } from "styled-components/native";
import lightTheme, { darkTheme } from "../assets/style/theme";

import { library } from "@fortawesome/fontawesome-svg-core";
import { fab } from "@fortawesome/free-brands-svg-icons";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { far } from "@fortawesome/free-regular-svg-icons";

import Home from "../screens/Home";
import { NavigationContainer, Theme } from "@react-navigation/native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Inter_400Regular } from "@expo-google-fonts/inter/400Regular";
import { Inter_700Bold } from "@expo-google-fonts/inter/700Bold";
import { useFonts } from "@expo-google-fonts/inter/useFonts";
import { Appearance, useColorScheme, View } from "react-native";
import Settings from "../screens/Settings";
import { useMMKVBoolean, useMMKVString } from "react-native-mmkv";
import Financing from "../screens/Financing";
import Analytics from "../screens/Analytics";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Onboarding from "../screens/Onboarding/Onboarding";

SplashScreen.setOptions({
  duration: 1000,
  fade: true,
});

SplashScreen.preventAutoHideAsync();

library.add(fab, fas, far);

const RootStack = createNativeStackNavigator();

const Navigation = ({ theme }: { theme: Theme }) => {
  const [hasSeenOnboarding] = useMMKVBoolean("hasSeenOnboarding");
  return (
    <NavigationContainer theme={theme}>
      <RootStack.Navigator
        initialRouteName={hasSeenOnboarding ? "Home" : "Onboarding"}
        screenOptions={{ headerShown: false }}
      >
        {hasSeenOnboarding ? (
          <>
            <RootStack.Screen name="Home" component={Home} />
            <RootStack.Screen name="Financing" component={Financing} />
            <RootStack.Screen name="Analytics" component={Analytics} />
            <RootStack.Screen name="Settings" component={Settings} />
          </>
        ) : (
          <RootStack.Screen name="Onboarding" component={Onboarding} />
        )}
      </RootStack.Navigator>
    </NavigationContainer>
  );
};

const App = () => {
  const [theme] = useMMKVString("theme");
  const deviceScheme = useColorScheme();
  const selectedTheme = theme || deviceScheme;
  const scheme = selectedTheme === "dark" ? "dark" : "light";
  const invScheme = selectedTheme === "dark" ? "light" : "dark";
  const themeObject = selectedTheme === "dark" ? darkTheme : lightTheme;
  const navigatorTheme: ComponentProps<typeof Navigation>["theme"] = {
    colors: {
      primary: themeObject.color.primary,
      background: themeObject.color.background,
      card: themeObject.color.surface,
      text: themeObject.color.textPrimary,
      border: "white",
      notification: "white",
    },
    dark: selectedTheme === "dark",
    fonts: {
      regular: {
        fontFamily: "Inter_400Regular",
        fontWeight: "normal",
      },
      medium: {
        fontFamily: "Inter_700Bold",
        fontWeight: "normal",
      },
      bold: {
        fontFamily: "Inter_700Bold",
        fontWeight: "bold",
      },
      heavy: {
        fontFamily: "Inter_700Bold",
        fontWeight: "bold",
      },
    },
  };

  const [loaded] = useFonts({
    Inter_400Regular,
    Inter_700Bold,
  });

  useEffect(() => {
    Appearance.setColorScheme(scheme);
  }, [scheme]);

  useEffect(() => {
    if (!loaded) return;
    SplashScreen.hide();
  }, [loaded]);

  return (
    loaded && (
      <React.StrictMode>
        <SafeAreaProvider>
          <ThemeProvider theme={themeObject}>
            <StatusBar style={invScheme} />
            <NavigationBar style={scheme} />
            <View
              style={{ backgroundColor: themeObject.color.background, flex: 1 }}
            >
              <Navigation theme={navigatorTheme} />
            </View>
          </ThemeProvider>
        </SafeAreaProvider>
      </React.StrictMode>
    )
  );
};

export default App;
