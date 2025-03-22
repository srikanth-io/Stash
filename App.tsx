import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { AppScreens } from "./src/constants/AppScreens";
import Dashboard from "./src/screens/starterScreens/Dashboard";
import { PaperProvider } from "react-native-paper";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <PaperProvider>
        <Stack.Navigator screenOptions={{headerShown: false}}> 
          <Stack.Screen name={AppScreens.DASHBOARD} component={Dashboard}/>
        </Stack.Navigator>
      </PaperProvider>
    </NavigationContainer>
  )
}