import { useEffect } from "react"
import { ActivityIndicator, Text, View } from "react-native"
import { LogLevel, OneSignal } from "react-native-onesignal"
import { WebView } from "react-native-webview"

OneSignal.Debug.setLogLevel(LogLevel.Verbose)

OneSignal.initialize(process.env.EXPO_PUBLIC_ONESIGNAL_APP_ID!)

function Loading() {
  return (
    <View
      style={{
        gap: 16,
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#FFF",
      }}
    >
      <ActivityIndicator size={24} />

      <Text style={{ color: "#5D5D5D" }}>Loading ...</Text>
    </View>
  )
}

export default function App() {
  useEffect(() => {
    OneSignal.Notifications.requestPermission(true)
  }, [])

  return (
    <WebView
      style={{
        flex: 1,
        marginTop: 60,
      }}
      source={{
        uri: process.env.EXPO_PUBLIC_APP_URL!,
      }}
      renderLoading={() => <Loading />}
      geolocationEnabled
      startInLoadingState
    />
  )
}
