import { useEffect, useRef, useState } from "react"
import api from "@/services/api"
import { PermissionStatus, useForegroundPermissions } from "expo-location"
import { LogLevel, OneSignal } from "react-native-onesignal"
import { WebView, type WebViewMessageEvent } from "react-native-webview"

import type { User } from "@/types/user"
import Loading from "@/components/loading"

OneSignal.Debug.setLogLevel(LogLevel.Verbose)

OneSignal.initialize(process.env.EXPO_PUBLIC_ONESIGNAL_APP_ID!)

export default function App() {
  const [hasInjectedJavascript, setHasInjectedJavascript] = useState(false)

  const ref = useRef<WebView>(null)

  const [status, requestPermission] = useForegroundPermissions()

  async function onMessage({ nativeEvent }: WebViewMessageEvent) {
    if (nativeEvent.data) {
      const token = nativeEvent.data

      await api
        .get<User>("/auth/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then(({ data }) => {
          OneSignal.login(data.username)

          if (data.emails && data.emails.length > 0) {
            const findPrimaryEmail = data.emails.find((email) => email.primary)

            if (findPrimaryEmail)
              OneSignal.User.addEmail(findPrimaryEmail.email)
          }
        })
    }
  }

  async function requestPermissionLocation() {
    if (status) {
      if (status.status === PermissionStatus.GRANTED) return

      if (status.canAskAgain) await requestPermission()
    }
  }

  function getPathnameFromUrl(url: string) {
    const path = url.replace(/^.*\/\/[^/]+/, "")

    return path
  }

  function onNavigate(url: string) {
    const path = getPathnameFromUrl(url)

    if (!hasInjectedJavascript && path.includes("/app")) {
      const INJECTED_JAVASCRIPT = `(function() {
        const tokenLocalStorage = window.localStorage.getItem('@ava-token');

        window.ReactNativeWebView.postMessage(tokenLocalStorage);
      })();`

      ref.current?.injectJavaScript(INJECTED_JAVASCRIPT)

      setHasInjectedJavascript(true)
    }
  }

  useEffect(() => {
    OneSignal.Notifications.requestPermission(true)
  }, [])

  return (
    <WebView
      ref={ref}
      style={{
        flex: 1,
        marginTop: 60,
      }}
      source={{
        uri: process.env.EXPO_PUBLIC_APP_URL!,
      }}
      onLoadEnd={() => requestPermissionLocation()}
      onMessage={onMessage}
      renderLoading={() => <Loading />}
      originWhitelist={["*"]}
      geolocationEnabled
      startInLoadingState
      onNavigationStateChange={({ url }) => onNavigate(url)}
    />
  )
}
