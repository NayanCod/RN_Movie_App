import { Redirect, Slot, Stack, useRouter, useSegments } from "expo-router";
import "./globals.css";
import { ActivityIndicator, StatusBar, View } from "react-native";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import { useEffect } from "react";

function AuthGuard() {
  const { user, loading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      // const inAuthGroup = segments[0] === "(auth)";
      const inTabsGroup = segments[0] === "(tabs)";

      if (user && !inTabsGroup) {
        router.replace("/(tabs)");
      } else if (!user && inTabsGroup) {
        router.replace("/login");
      }
    }
  }, [user, loading, segments]);

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-primary">
        <ActivityIndicator size="large" color="#fff" />
      </View>
    );
  }

  return <Slot />;
}

export default function RootLayout() {
  return (
    <>
    <AuthProvider>
      <StatusBar hidden={true} />
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="login" options={{ headerShown: false }} />
        <Stack.Screen name="signup" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="movies/[id]" options={{ headerShown: false }} />
        <Stack.Screen
          name="movies/[id]/trailer"
          options={{ headerShown: false }}
        />
      </Stack>
      {/* <AuthGuard /> */}
      </AuthProvider>
    </>
  );
}
