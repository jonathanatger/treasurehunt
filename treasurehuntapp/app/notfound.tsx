import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Link } from "expo-router";

export default function Index() {
  return (
    <ThemedView
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}>
      <ThemedText>This page does not exist !</ThemedText>
      <Link href="index">Home</Link>
    </ThemedView>
  );
}
