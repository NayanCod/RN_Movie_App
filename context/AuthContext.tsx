import { createContext, useContext, useEffect, useState } from "react";
import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";
import * as SecureStore from "expo-secure-store";

WebBrowser.maybeCompleteAuthSession();

interface AuthContextType {
  userInfo: any;
  loading: boolean;
  error: string | null;
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true); // Start with loading true
  const [error, setError] = useState<string | null>(null);

  const [request, response, promptAsync] = Google.useAuthRequest({
    androidClientId: process.env.EXPO_PUBLIC_ANDROID_CLIENT_ID,
    webClientId: process.env.EXPO_PUBLIC_WEB_CLIENT_ID,
    scopes: ["profile", "email"],
    responseType: "id_token",
    extraParams: {
        access_type: "offline",
        prompt: "consent",
      },
  });

  // Check for existing auth state when app launches
  useEffect(() => {
    checkForExistingAuth();
  }, []);

  // Handle Google Sign In response
  useEffect(() => {
    if (response?.type === "success") {
      handleSignInWithGoogle();
    }
  }, [response]);

  async function checkForExistingAuth() {
    try {
      const storedUser = await SecureStore.getItemAsync("userInfo");
      if (storedUser) {
        setUserInfo(JSON.parse(storedUser));
      }
    } catch (error) {
      setError("Failed to restore auth state");
    } finally {
      setLoading(false);
    }
  }

  async function handleSignInWithGoogle() {
    if (response?.type === "success") {
      const { authentication } = response;
      try {
        setLoading(true);
        const userInfoResponse = await fetch(
          "https://www.googleapis.com/userinfo/v2/me",
          {
            headers: { Authorization: `Bearer ${authentication?.accessToken}` },
          }
        );
        const user = await userInfoResponse.json();
        await SecureStore.setItemAsync("userInfo", JSON.stringify(user));
        setUserInfo(user);
      } catch (error) {
        setError("Failed to fetch user info");
      } finally {
        setLoading(false);
      }
    }
  }

  const signIn = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log("ClientID:", process.env.EXPO_PUBLIC_ANDROID_CLIENT_ID); // Debug client ID
      const result = await promptAsync();
      console.log("Auth Result:", result);
    } catch (error) {
      setError("Failed to sign in");
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      setError(null);
      await SecureStore.deleteItemAsync("userInfo");
      setUserInfo(null);
    } catch (error) {
      setError("Failed to sign out");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ userInfo, loading, error, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
