// App.tsx
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './screens/HomeScreen';
import NotificationsScreen from './screens/NotificationsScreen';
import HomePageStart from './screens/HomePageStart';
import SuccessScreen from './screens/SuccessScreen';
import { RootStackParamList } from './navigation';
import { GameProvider } from './context/GameContext';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
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
          <Stack.Screen name="AddMedication" component={require('./screens/AddMedication').default} />
        </Stack.Navigator>
      </NavigationContainer>
    </GameProvider>
  );
}