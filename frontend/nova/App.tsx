import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as SplashScreen from 'expo-splash-screen';
import {
  useFonts,
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold,
  Poppins_700Bold
} from '@expo-google-fonts/poppins';

import HomeScreen from './screens/HomeScreen';
import NotificationsScreen from './screens/NotificationsScreen';
import HomePageStart from './screens/HomePageStart';
import SuccessScreen from './screens/SuccessScreen';
import { RootStackParamList } from './navigation';
import AddMedication from './screens/AddMedication';
import { GameProvider } from './context/GameContext';

SplashScreen.preventAutoHideAsync();

const Stack = createNativeStackNavigator<RootStackParamList>();

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
    <GameProvider>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="HomePageStart"
          screenOptions={{
            headerShown: false,
            animation: 'slide_from_right',
          }}
        >
          <Stack.Screen name="HomePageStart" component={HomePageStart} />
          <Stack.Screen name="Success" component={SuccessScreen} />
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="Notifications" component={NotificationsScreen} />
          <Stack.Screen name="AddMedication" component={AddMedication} />
        </Stack.Navigator>
      </NavigationContainer>
    </GameProvider>
  );
}