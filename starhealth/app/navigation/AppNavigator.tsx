// src/app/navigation/AppNavigator.tsx
import { createStackNavigator } from '@react-navigation/stack';
import BonusScreen from '../screens/BonusScreen';


const Stack = createStackNavigator();

export default function AppNavigator() {
  return (
    <Stack.Navigator>
      
      <Stack.Screen name="Bonus" component={BonusScreen} />
     
    </Stack.Navigator>
  );
}
