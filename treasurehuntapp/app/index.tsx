import { ThemedText } from "@/components/ThemedText";
import { ThemedSafeAreaView, ThemedView } from "@/components/ThemedView";
import { Colors } from "@/constants/Colors";
import { Shadows } from "@/constants/Shadows";
import React, { useContext, useEffect, useState } from "react";
import { StyleSheet, useWindowDimensions } from "react-native";
import { PressableLink } from "@/components/PressableLink";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { appContext } from "./_layout";

function Homescreen() {
  const { height, width } = useWindowDimensions();
  const userInfo = useContext(appContext).userInfo;
  const setUserInfo = useContext(appContext).setUserInfo;

  useEffect(() => {
    getUserInfoInStorage();
  }, []);

  const getUserInfoInStorage = async () => {
    await AsyncStorage.getItem("user").then((userJSON) => {
      if (!userJSON) return;
      setUserInfo(JSON.parse(userJSON));
    });
  };

  return (
    <ThemedSafeAreaView style={{ height: height, ...styles.container }}>
      <ThemedText type="title" style={styles.title}>
        Treasurio
      </ThemedText>
      <ThemedView style={styles.main}>
        {userInfo ? (
          <>
            <PressableLink
              route="/tracks"
              text="Go to Tracks"
              style={styles.links}
            />
            <PressableLink
              route="/join"
              text="Join a Race"
              style={styles.links}
            />
            <PressableLink route="/login" text="Login" style={styles.links} />
          </>
        ) : (
          <PressableLink route="/login" text="Login" style={styles.links} />
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
    color: Colors.secondary.background,
    fontSize: 30,
    height: "auto",
    paddingBottom: 20,
    textAlign: "center",
    lineHeight: 34,
    paddingTop: 30,
  },
});

export default Homescreen;
