import { ActivityIndicator, Text, View } from "react-native"
import { WebView } from "react-native-webview"

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
