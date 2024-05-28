import { ThemedText } from "@/components/ThemedText";
import { ThemedSafeAreaView, ThemedView } from "@/components/ThemedView";
import { Link, router, useLocalSearchParams } from "expo-router";
import { Pressable, StyleSheet, useWindowDimensions } from "react-native";

function SpecificTrackPage() {
  const { height, width } = useWindowDimensions();
  const { id } = useLocalSearchParams();

  return (
    <ThemedSafeAreaView style={{ height: height, ...styles.main }}>
      <ThemedText type="title">This is tracks {id}</ThemedText>
      <ThemedText type="subtitle">
        We are waiting on other participants
      </ThemedText>
      <Pressable
        onPress={() => {
          router.back();
        }}>
        <ThemedText>Go back</ThemedText>
      </Pressable>
      <ThemedView style={styles.teamsView}>
        <ThemedText type="defaultSemiBold">TEAM 1</ThemedText>
        <ThemedText type="defaultSemiBold">TEAM 1</ThemedText>
        <ThemedText type="defaultSemiBold">TEAM 1</ThemedText>
        <ThemedText type="defaultSemiBold">TEAM 1</ThemedText>
      </ThemedView>
    </ThemedSafeAreaView>
  );
}

const styles = StyleSheet.create({
  main: {
    flexDirection: "column",
  },
  teamsView: {
    flex: 1,
    borderTopColor: "black",
    borderTopWidth: 1,
    flexDirection: "column",
  },
});
export default SpecificTrackPage;
