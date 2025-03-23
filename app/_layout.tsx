import { Redirect, Stack } from "expo-router";
import "./globals.css";
import { ActivityIndicator, StatusBar, View } from "react-native";
import { AuthProvider, useAuth } from "@/context/AuthContext";

const AuthGuard = () => {
  const { userInfo, loading } = useAuth();

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-primary">
        <ActivityIndicator size="large" color="#fff" />
      </View>
    );
  }

  if (!userInfo) {
    return <Redirect href="/" />;
  }

  return null;
}

export default function RootLayout() {
  return (
    <>
    <AuthProvider>
      <StatusBar hidden={true} />
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="movies/[id]" options={{ headerShown: false }} />
        <Stack.Screen
          name="movies/[id]/trailer"
          options={{ headerShown: false }}
        />
      </Stack>
      <AuthGuard />
      </AuthProvider>
    </>
  );
}
