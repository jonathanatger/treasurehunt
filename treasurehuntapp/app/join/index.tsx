import { ThemedText } from "@/components/ThemedText";
import { ThemedSafeAreaView, ThemedView } from "@/components/ThemedView";
import { Link } from "expo-router";

function index() {
  return (
    <ThemedSafeAreaView>
      <ThemedText>This is login</ThemedText>
      <Link href="">Go back</Link>
    </ThemedSafeAreaView>
  );
}

export default index;
