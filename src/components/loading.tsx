import { ActivityIndicator, Text, View } from "react-native"

export default function Loading() {
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
