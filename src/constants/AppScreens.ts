export enum AppScreens  {
  LOGIN = "Login",
  SIGNUP = "Register",
  FOGET_PASSWORD = "Foget_Password",
  DASHBOARD = "Dashboard",
  TIMESHEET = "Logs",
  CHATBOT = "Chat",
  PROFILE = "Profile",
  HOME = "Home"
}

export type RootStackParams = {
  [AppScreens.LOGIN]: undefined,
  [AppScreens.SIGNUP]: undefined,
  [AppScreens.FOGET_PASSWORD]: undefined,
  [AppScreens.DASHBOARD]: undefined,
  [AppScreens.TIMESHEET]: undefined,
  [AppScreens.CHATBOT]: undefined,
  [AppScreens.PROFILE]: undefined,
  [AppScreens.HOME]: undefined
}