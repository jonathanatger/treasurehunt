import { ThemedText } from "@/components/ThemedText";
import { ThemedSafeAreaView, ThemedView } from "@/components/ThemedView";
import { Link } from "expo-router";
import { useState } from "react";
import { StyleSheet, useWindowDimensions } from "react-native";

function TracksMainPage() {
  const { height, width } = useWindowDimensions();
  const [tracksIds, setTracksIds] = useState([1, 2, 3]);
  return (
    <ThemedSafeAreaView style={{ height: height, ...styles.container }}>
      <Link href="/">
        <ThemedText type="defaultSemiBold">Go back</ThemedText>
      </Link>
      <ThemedText type="title">This is tracks main page !</ThemedText>
      {tracksIds.map((id) => {
        return <Track key={id} id={id} />;
      })}
    </ThemedSafeAreaView>
  );
}

function Track(props: { id: number }) {
  return (
    <>
      <ThemedView style={styles.trackCard}>
        <Link href={`/tracks/${props.id}`}>
          <ThemedText>This is track {props.id}</ThemedText>
        </Link>
      </ThemedView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    fontSize: 30,
    paddingHorizontal: 10,
    flexDirection: "column",
    justifyContent: "flex-start",
    gap: 10,
  },
  main: {
    height: 300,
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "center",
  },
  trackCard: {
    height: 150,
    paddingVertical: 10,
    borderRadius: 5,
    backgroundColor: "orange",
  },
  title: {
    fontSize: 30,
    height: "auto",
    paddingBottom: 20,
    textAlign: "center",
    lineHeight: 34,
    paddingTop: 30,
  },
});
export default TracksMainPage;
