import Logo from "~/assets/logo.png"
import { Image } from "expo-image"
import { ActivityIndicator, Text, View } from "react-native"

export default function Loading() {
  return (
    <View
      style={{
        gap: 16,
        flex: 1,
        alignItems: "center",
        backgroundColor: "#FFF",
      }}
    >
      <Image
        style={{ width: "100%", height: 24, marginBottom: 32 }}
        source={Logo}
        contentFit="contain"
      />

      <ActivityIndicator size={24} />

      <Text style={{ color: "#5D5D5D" }}>Loading ...</Text>
    </View>
  )
}
