import { ThemedText } from "@/components/ThemedText";
import { ThemedSafeAreaView } from "@/components/ThemedView";
import { Link, router } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";
import { makeRedirectUri } from "expo-auth-session";
import { useEffect, useState } from "react";
import { Button, Linking } from "react-native";
import { AuthSessionRedirectUriOptions, revokeAsync } from "expo-auth-session";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { queryClient } from "../_layout";

type UserInfoType = {
  email: string;
  family_name?: string;
  given_name?: string;
  id?: string;
  locale?: string;
  name?: string;
  picture?: string;
  verified_email?: string;
} | null;

function Login() {
  const [userInfo, setUserInfo] = useState<UserInfoType>(null);
  const [authProvider, setAuthProvider] = useState<string | null>(null);

  WebBrowser.maybeCompleteAuthSession();

  const googleAuthRequestConfig = {
    androidClientId: process.env.ANDROID_CLIENT_ID,
    iosClientId: process.env.IOS_CLIENT_ID,
    webClientId: process.env.WEB_CLIENT_ID,
    redirectUri: makeRedirectUri({
      scheme: "com.anonymous.treasurehuntapp",
    } satisfies AuthSessionRedirectUriOptions),
  };

  const [request, response, promptAsync] = Google.useAuthRequest(
    googleAuthRequestConfig
  );

  useEffect(() => {
    setGoogleUserAuthInfo()
      .then(() => {
        queryClient.setQueryData(["authInfo"], userInfo);
      })
      .then(() => {
        if (userInfo && userInfo.email !== "") {
          router.push("/tracks");
        }
      });
  }, [response]);

  const setGoogleUserAuthInfo = async () => {
    try {
      const userJSON = await AsyncStorage.getItem("user");

      if (userJSON) {
        setUserInfo(JSON.parse(userJSON));
      } else if (response?.type === "success") {
        //@ts-ignore
        const user = await getUserInfo(response.authentication.accessToken);
        setUserInfo(user);
      }
    } catch (error) {
      console.error("Error retrieving user data from AsyncStorage:", error);
    }
  };

  const getUserInfo = async (token: any) => {
    if (!token) return;

    try {
      const response = await fetch(
        "https://www.googleapis.com/userinfo/v2/me",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const user = await response.json();
      await AsyncStorage.setItem("user", JSON.stringify(user));
      return user;
    } catch (error) {
      console.error(
        "Failed to fetch user data:",
        //@ts-ignore
        response.status,
        //@ts-ignore
        response.statusText
      );
    }
  };

  async function logout() {
    const token = await AsyncStorage.getItem("user");
    if (token) {
      try {
        await revokeAsync(
          { token },
          { revocationEndpoint: "https://oauth2.googleapis.com/revoke" }
        );
        await AsyncStorage.removeItem("user").then(() => {
          setUserInfo(null);
          queryClient.setQueryData(["authInfo"], null);
        });
      } catch (error) {
        console.log("ERROR XXX", error);
      }
    }
  }

  return (
    <ThemedSafeAreaView>
      <ThemedText>This is login</ThemedText>
      <Link href="/">Go back</Link>
      <ThemedText>User : {JSON.stringify(userInfo)}</ThemedText>
      <Button
        title="sign in with google"
        onPress={() => {
          promptAsync();
        }}
      />
      <Button
        title="sign out"
        onPress={() => {
          logout();
        }}
      />
    </ThemedSafeAreaView>
  );
}

export default Login;
