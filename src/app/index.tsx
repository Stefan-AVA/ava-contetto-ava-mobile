import { useEffect, useRef, useState } from "react"
import {
  PermissionStatus as CameraPermissionStatus,
  useCameraPermissions,
} from "expo-camera/next"
import Constants from "expo-constants"
import { PermissionStatus, useForegroundPermissions } from "expo-location"
import {
  LogLevel,
  OneSignal,
  type NotificationClickEvent,
} from "react-native-onesignal"
import { useSafeAreaInsets } from "react-native-safe-area-context"
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

  const { top } = useSafeAreaInsets()

  const ref = useRef<WebView>(null)

  const [status, requestPermission] = useForegroundPermissions()
  const [permission, requestCameraPermission] = useCameraPermissions()

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

  async function requestPermissionCamera() {
    if (permission) {
      if (permission.status === CameraPermissionStatus.GRANTED) return

      if (permission.canAskAgain) await requestCameraPermission()
    }
  }

  useEffect(() => {
    OneSignal.Notifications.requestPermission(true)
  }, [])

  useEffect(() => {
    function onHandleNotificationClicked({
      notification,
    }: NotificationClickEvent) {
      /**
       * @tmp
       * In case of wrongly typed launchURL https://github.com/OneSignal/react-native-onesignal/issues/1635
       */
      // @ts-expect-error
      const notificationUrl = notification.launchURL ?? notification.launchUrl

      if (notificationUrl) {
        const scheme = Constants.expoConfig?.scheme as string

        const formatUri = notificationUrl.replace(
          `${scheme}:///?navigateTo=`,
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
        marginTop: top,
      }}
      source={{
        uri,
      }}
      onLoadEnd={() => requestPermissionLocation()}
      onNavigationStateChange={async ({ url }) => {
        const isContactScreen = url.endsWith("/contacts")

        if (isContactScreen) await requestPermissionCamera()
      }}
      onMessage={onMessage}
      renderLoading={() => <Loading />}
      originWhitelist={["*"]}
      geolocationEnabled
      startInLoadingState
      mediaCapturePermissionGrantType="grant"
    />
  )
}
