import { useEffect, useRef, useState } from "react"
import Constants from "expo-constants"
import { PermissionStatus, useForegroundPermissions } from "expo-location"
import {
  LogLevel,
  OneSignal,
  type NotificationClickEvent,
} from "react-native-onesignal"
import { WebView, type WebViewMessageEvent } from "react-native-webview"

import type { User } from "@/types/user"
import Loading from "@/components/loading"

OneSignal.Debug.setLogLevel(LogLevel.Verbose)

OneSignal.initialize(process.env.EXPO_PUBLIC_ONESIGNAL_APP_ID!)

type NativeEventResponse = {
  type: "ONESIGNAL_LOGIN"
  user: User
}

export default function App() {
  const baseURL = process.env.EXPO_PUBLIC_APP_URL!

  const [uri, setUri] = useState(baseURL)

  const ref = useRef<WebView>(null)

  const [status, requestPermission] = useForegroundPermissions()

  async function onMessage({ nativeEvent }: WebViewMessageEvent) {
    if (nativeEvent.data) {
      const data = nativeEvent.data

      if (data) {
        const { type, user } = JSON.parse(data) as NativeEventResponse

        if (type === "ONESIGNAL_LOGIN") {
          OneSignal.login(user.username)

          if (user.emails && user.emails.length > 0) {
            const findPrimaryEmail = user.emails.find((email) => email.primary)

            if (findPrimaryEmail)
              OneSignal.User.addEmail(findPrimaryEmail.email)
          }
        }
      }
    }
  }

  async function requestPermissionLocation() {
    if (status) {
      if (status.status === PermissionStatus.GRANTED) return

      if (status.canAskAgain) await requestPermission()
    }
  }

  useEffect(() => {
    OneSignal.Notifications.requestPermission(true)
  }, [])

  useEffect(() => {
    function onHandleNotificationClicked({
      notification,
    }: NotificationClickEvent) {
      if (notification.launchURL) {
        const scheme = Constants.expoConfig?.scheme as string

        const formatUri = notification.launchURL.replace(
          `${scheme}://`,
          `${baseURL}/`
        )

        setUri(formatUri)
      }
    }

    OneSignal.Notifications.addEventListener(
      "click",
      onHandleNotificationClicked
    )

    return () => {
      OneSignal.Notifications.removeEventListener(
        "click",
        onHandleNotificationClicked
      )
    }
  }, [baseURL])

  return (
    <WebView
      ref={ref}
      style={{
        flex: 1,
        marginTop: 60,
      }}
      source={{
        uri,
      }}
      onLoadEnd={() => requestPermissionLocation()}
      onMessage={onMessage}
      renderLoading={() => <Loading />}
      originWhitelist={["*"]}
      geolocationEnabled
      startInLoadingState
    />
  )
}
