import { ThemedText } from "@/components/ThemedText";
import { ThemedSafeAreaView, ThemedView } from "@/components/ThemedView";
import { Link, useLocalSearchParams } from "expo-router";

function index() {
  const { id } = useLocalSearchParams();
  return (
    <ThemedSafeAreaView>
      <ThemedText>This is tracks {id}</ThemedText>
      <Link href="">Go back</Link>
    </ThemedSafeAreaView>
  );
}

export default index;
