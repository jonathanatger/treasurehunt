import { ThemedText } from "@/components/ThemedText";
import { ThemedSafeAreaView, ThemedView } from "@/components/ThemedView";
import { Colors } from "@/constants/Colors";
import { Shadows } from "@/constants/Shadows";
import { Link, router } from "expo-router";
import React, { useState } from "react";
import { Pressable, StyleSheet, View, useWindowDimensions } from "react-native";

function Homescreen() {
  const { height, width } = useWindowDimensions();
  const [loggedIn, setLoggedIn] = useState(true);
  return (
    <ThemedSafeAreaView style={{ height: height, ...styles.container }}>
      <ThemedText type="title" style={styles.title}>
        Treasurio
      </ThemedText>
      <ThemedView style={styles.main}>
        {loggedIn ? (
          <>
            <Pressable
              style={({ pressed }) => [
                {
                  backgroundColor: pressed
                    ? Colors.secondary.muted
                    : Colors.secondary.background,
                },
                styles.links,
              ]}
              onPress={() => {
                router.push("/tracks");
              }}>
              <ThemedText secondary={true}>Go to tracks</ThemedText>
            </Pressable>
            <Pressable
              style={({ pressed }) => [
                {
                  backgroundColor: pressed
                    ? Colors.secondary.muted
                    : Colors.secondary.background,
                },
                styles.links,
              ]}
              onPress={() => {
                router.push("/join");
              }}>
              <ThemedText secondary={true}>Join Race</ThemedText>
            </Pressable>
          </>
        ) : (
          <Link href="/login" style={styles.links}>
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
    paddingBottom: 10,
    flexDirection: "column",
    justifyContent: "space-between",
    color: "white",
  },
  links: {
    ...Shadows.base,
    borderRadius: 24,
    flex: 1,
    width: "100%",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },

  main: {
    borderRadius: 24,
    height: 300,
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "center",
    gap: 10,
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
