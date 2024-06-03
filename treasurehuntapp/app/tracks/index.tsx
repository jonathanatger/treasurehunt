import { ThemedText } from "@/components/ThemedText";
import { ThemedSafeAreaView, ThemedView } from "@/components/ThemedView";
import { Link } from "expo-router";
import { useState } from "react";
import { ScrollView, StyleSheet, useWindowDimensions } from "react-native";
import { useQuery } from "@tanstack/react-query";
import { queryClient } from "../_layout";
import { PressableLink } from "@/components/PressableLink";

const fetchTracks = async () => {
  const data = await fetch("https://treasurehunt-jet.vercel.app/api/mobile");
  const res = await data.json();
  return res;
};

function TracksMainPage() {
  const { height, width } = useWindowDimensions();
  const [tracksIds, setTracksIds] = useState([1, 2, 3, 4]);

  const logindata = queryClient.getQueryData(["googleAuth"]);

  const { data, isLoading, error } = useQuery({
    queryKey: ["nextapi"],
    queryFn: fetchTracks,
  });

  return (
    <ThemedSafeAreaView style={{ height: height }}>
      <ScrollView contentContainerStyle={styles.container}>
        <PressableLink text="Go back" style={styles.backlink}></PressableLink>
        <ThemedText type="title">This is tracks main page !</ThemedText>
        {isLoading ? (
          <ThemedText type="title">Loading...</ThemedText>
        ) : (
          <ThemedText type="title">
            {data
              ? data.data
                ? data.data.message
                : "body loaded"
              : "data loaded"}
          </ThemedText>
        )}
        {tracksIds.map((id) => {
          return (
            <PressableLink
              route={`/tracks/${id}`}
              text={`This is Track ${id}`}
              style={styles.trackCard}
              textType="subtitle"
              key={"track" + id}
            />
          );
        })}
      </ScrollView>
    </ThemedSafeAreaView>
  );
}

function Track(props: { id: number }) {
  return <></>;
}

const styles = StyleSheet.create({
  backlink: {
    width: 70,
    padding: 3,
    borderRadius: 5,
  },
  container: {
    fontSize: 30,
    padding: 10,
    flexDirection: "column",
    gap: 10,
  },
  main: {
    height: 300,
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "center",
  },
  trackCard: {
    flexDirection: "column",
    justifyContent: "center",
    alignContent: "center",
    height: 150,
    padding: 10,
    borderRadius: 5,
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
