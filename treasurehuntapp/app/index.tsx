import { ThemedText } from "@/components/ThemedText";
import { ThemedSafeAreaView } from "@/components/ThemedView";
import { Link, router } from "expo-router";
import React from "react";
import { Pressable } from "react-native";

function index() {
  function onClick() {
    router.push("secondscreen");
  }
  return (
    <ThemedSafeAreaView>
      <ThemedText style={{ height: 100 }}>
        Those are the pages of the app
      </ThemedText>
      <Link href="login">
        <ThemedText>Go to login</ThemedText>
      </Link>
      <Link href="tracks/1">
        <ThemedText>Go to tracks/1</ThemedText>
      </Link>
    </ThemedSafeAreaView>
  );
}

export default index;
