export enum AppScreens  {
  DASHBOARD = "Dashboard",
  TIMESHEET = "Logs",
  CHATBOT = "Chat",
  PROFILE = "Profile",
  HOME = "Home"
}

export type RootStackParams = {
  [AppScreens.DASHBOARD]: undefined,
  [AppScreens.TIMESHEET]: undefined,
  [AppScreens.CHATBOT]: undefined,
  [AppScreens.PROFILE]: undefined,
  [AppScreens.HOME]: undefined
}