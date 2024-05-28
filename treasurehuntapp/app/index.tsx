import { ThemedText } from "@/components/ThemedText";
import { ThemedSafeAreaView, ThemedView } from "@/components/ThemedView";
import { Link, router } from "expo-router";
import React, { useState } from "react";
import { StyleSheet, useWindowDimensions } from "react-native";

function Homescreen() {
  const { height, width } = useWindowDimensions();
  const [loggedIn, setLoggedIn] = useState(true);

  return (
    <ThemedSafeAreaView style={{ height: height, ...styles.container }}>
      <ThemedText style={styles.title}>Treasurio</ThemedText>
      <ThemedView style={styles.main}>
        {loggedIn ? (
          <>
            <Link href="/tracks">
              <ThemedText>Go to tracks</ThemedText>
            </Link>
            <Link href="/join">
              <ThemedText>Join Race</ThemedText>
            </Link>
          </>
        ) : (
          <Link href="/login">
            <ThemedText>Go to login</ThemedText>
          </Link>
        )}
      </ThemedView>
    </ThemedSafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    fontSize: 30,
    borderColor: "#20232a",
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
});

export default Homescreen;
