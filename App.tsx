import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { AppScreens } from "./src/constants/AppScreens";
import Dashboard from "./src/screens/starterScreens/Dashboard";
import { PaperProvider } from "react-native-paper";
import LoginScreen from "./src/screens/starterScreens/LoginScreen";
import SignupScreen from "./src/screens/starterScreens/SignupScreen";
import ForgetScreen from "./src/screens/starterScreens/ForgetScreen";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <PaperProvider>
        <Stack.Navigator screenOptions={{headerShown: false}}> 
          <Stack.Screen name={AppScreens.LOGIN} component={LoginScreen}/>
          <Stack.Screen name={AppScreens.SIGNUP} component={SignupScreen}/>
          <Stack.Screen name={AppScreens.FOGET_PASSWORD} component={ForgetScreen}/>
          <Stack.Screen name={AppScreens.DASHBOARD} component={Dashboard}/>
        </Stack.Navigator>
      </PaperProvider>
    </NavigationContainer>
  )
}