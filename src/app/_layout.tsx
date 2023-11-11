import { useEffect } from "react"
import { Slot, SplashScreen } from "expo-router"
import { StatusBar } from "expo-status-bar"

export { ErrorBoundary } from "expo-router"

SplashScreen.preventAutoHideAsync()

export default function Layout() {
  useEffect(() => {
    SplashScreen.hideAsync()
  }, [])

  return (
    <>
      <Slot />

      <StatusBar style="auto" />
    </>
  )
}
