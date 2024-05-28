import { ThemedText } from "@/components/ThemedText";
import { ThemedSafeAreaView, ThemedView } from "@/components/ThemedView";
import { Link } from "expo-router";
import { StyleSheet, TextInput, useWindowDimensions } from "react-native";

function Join() {
  const { height, width } = useWindowDimensions();
  return (
    <ThemedSafeAreaView style={{ height: height, ...styles.container }}>
      <ThemedText>This is joining another race</ThemedText>
      <TextInput placeholder="Code" style={styles.input} />
      <ThemedView style={styles.main}>
        <Link href="/">Go back !</Link>
      </ThemedView>
    </ThemedSafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    fontSize: 30,
    paddingHorizontal: 10,
    flexDirection: "column",
    justifyContent: "space-between",
  },
  main: {
    height: 300,
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "center",
  },
  title: {
    fontSize: 30,
    height: "auto",
    paddingBottom: 20,
    textAlign: "center",
    lineHeight: 34,
    paddingTop: 30,
  },
  input: {
    borderStyle: "solid",
    borderWidth: 3,
  },
});

export default Join;
