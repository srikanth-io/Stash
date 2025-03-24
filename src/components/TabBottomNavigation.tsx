import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { AppScreens } from "../constants/AppScreens";
import TimeSheet from "../screens/viewScreens/TimeSheet";
import { StyleSheet, View } from "react-native";
import { AppColors } from "../constants/AppColors";
import { ChatCircleText, ClockClockwise, House, User } from "phosphor-react-native";
import Profile from "../screens/viewScreens/Profile";
import Home from "../screens/viewScreens/Home";
import { AppConstants } from "../constants/AppConstants";
import Chat from "../screens/viewScreens/Chat";

const Tab = createBottomTabNavigator();

export const TabBottomNavigation = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, size =28 }) => {
          const iconColor = focused ? AppColors.active : AppColors.inactive;
          const icons: { [key: string]: JSX.Element } = {
            [AppScreens.TIMESHEET]: <ClockClockwise size={size} weight="duotone" color={iconColor} />,
            [AppScreens.CHATBOT]: <ChatCircleText size={size} weight="duotone" color={iconColor} />,
            [AppScreens.PROFILE]: <User size={size} weight="duotone" color={iconColor} />,
            [AppScreens.HOME]: <House size={size} weight="duotone" color={iconColor} />,
          };
           return (
            <View style={styles.iconWrapper}>
              {icons[route.name] || null}
            </View>
          );
          
        },
        tabBarActiveTintColor: AppColors.primary,
        tabBarInactiveTintColor: AppColors.inactive,
        tabBarStyle: styles.tabBarStyle,
        tabBarShowLabel: true,
        headerShown: false,
        tabBarHideOnKeyboard: true,
        tabBarLabelStyle: {fontSize: AppConstants.iconFontSize}
      })}
    >
      <Tab.Screen name={AppScreens.HOME} component={Home} />
      <Tab.Screen name={AppScreens.TIMESHEET} component={TimeSheet} />
      <Tab.Screen name={AppScreens.CHATBOT} component={Chat} options={{tabBarStyle: {display: 'none'}}} />
      <Tab.Screen name={AppScreens.PROFILE} component={Profile} />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  tabBarStyle: {
    position: "absolute",
    bottom: 10,
    height: 65,
    marginHorizontal: 10,
    paddingTop: 8,
    borderRadius: 18,
  },
  iconWrapper: {
    alignItems: "center",
    justifyContent: "center",
  },
});
