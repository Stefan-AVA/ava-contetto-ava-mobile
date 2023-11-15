import { WebView } from "react-native-webview"
import { styled } from "styled-components/native"

const View = styled(WebView)`
  flex: 1;
  margin-top: 64px;
`

export default function App() {
  return (
    <View
      source={{
        uri: process.env.EXPO_PUBLIC_APP_URL!,
      }}
    />
  )
}
