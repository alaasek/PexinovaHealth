import 'react-native-gesture-handler';
import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useFonts, Poppins_400Regular, Poppins_500Medium, Poppins_600SemiBold, Poppins_700Bold } from '@expo-google-fonts/poppins';
import * as SplashScreen from 'expo-splash-screen';

import NovaHomeScreen from './src/screens/NovaHomeScreen';
import NovaNotificationsScreen from './src/screens/NovaNotificationsScreen';
import NovaAddMedication from './src/screens/NovaAddMedication';
import NovaSuccessScreen from './src/screens/NovaSuccessScreen';
import StarLandingScreen from './src/screens/StarLandingScreen';
import StarLoginScreen from './src/screens/StarLoginScreen';
import StarSignupScreen from './src/screens/StarSignupScreen';
import StarHomeScreen from './src/screens/StarHomeScreen';
import BonusScreen from './src/screens/BonusScreen';

import SettingsScreen from './src/screens/SettingsScreen';
import TermsScreen from './src/screens/TermsScreen';
import PrivacyScreen from './src/screens/PrivacyScreen';
import HelpScreen from './src/screens/HelpScreen';
import AccountScreen from './src/screens/AccountScreen';
import SecurityScreen from './src/screens/SecurityScreen';
import LoginActivityScreen from './src/screens/LoginActivityScreen';
import HistoryScreen from './src/screens/HistoryScreen';
import StatisticsScreen from './src/screens/StatisticsScreen';

import { GameProvider } from './src/context/GameContext';
import { COLORS } from './src/constants/theme';

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

const Stack = createNativeStackNavigator();

export default function App() {
  const [fontsLoaded] = useFonts({
    'Poppins-Regular': Poppins_400Regular,
    'Poppins-Medium': Poppins_500Medium,
    'Poppins-SemiBold': Poppins_600SemiBold,
    'Poppins-Bold': Poppins_700Bold,
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <GameProvider>
        <NavigationContainer>
          <StatusBar style="light" />
          <Stack.Navigator
            initialRouteName="StarLanding"
            screenOptions={{
              headerShown: false,
              contentStyle: { backgroundColor: COLORS.background }
            }}
          >
            <Stack.Screen name="Home" component={NovaHomeScreen} />
            <Stack.Screen name="Notifications" component={NovaNotificationsScreen} />
            <Stack.Screen name="AddMedication" component={NovaAddMedication} />
            <Stack.Screen name="Success" component={NovaSuccessScreen} />

            <Stack.Screen name="StarLanding" component={StarLandingScreen} />
            <Stack.Screen name="Login" component={StarLoginScreen} />
            <Stack.Screen name="Signup" component={StarSignupScreen} />
            <Stack.Screen name="StarHome" component={StarHomeScreen} />
            <Stack.Screen name="Bonus" component={BonusScreen} />

            <Stack.Screen name="Settings" component={SettingsScreen} />
            <Stack.Screen name="Terms" component={TermsScreen} />
            <Stack.Screen name="Privacy" component={PrivacyScreen} />
            <Stack.Screen name="Help" component={HelpScreen} />
            <Stack.Screen name="Account" component={AccountScreen} />
            <Stack.Screen name="Security" component={SecurityScreen} />
            <Stack.Screen name="LoginActivity" component={LoginActivityScreen} />
            <Stack.Screen name="History" component={HistoryScreen} />
            <Stack.Screen name="Statistics" component={StatisticsScreen} />
          </Stack.Navigator>
        </NavigationContainer>
      </GameProvider>
    </SafeAreaProvider>
  );
}
