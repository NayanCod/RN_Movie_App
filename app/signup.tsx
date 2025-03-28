import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from "react-native";
import { useAuth } from "@/context/AuthContext";
import { useRouter, Redirect } from "expo-router";
import { useState } from "react";
import { images } from "@/constants/images";
import { icons } from "@/constants/icons";

export default function Signup() {
  const router = useRouter();
  const { signUp, user, loading, error } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  if (user) {
    return <Redirect href="/(tabs)" />;
  }

  const handleSignup = async () => {
    if (!email || !password || !confirmPassword) {
      console.error("Please fill in all fields");
      return;
    }
    if (password !== confirmPassword) {
      console.error("Passwords do not match");
      return;
    }
    try {
      await signUp(email, password);
    } catch (error) {
      console.error("Signup error:", error);
    }
  };

  return (
    <View className="flex-1 bg-primary">
      <Image source={images.bg} className="absolute w-full z-0" />
      <View className="flex-1 px-6 justify-center">
        <View className="w-full items-center mb-10">
          <Image source={icons.logo} className="w-16 h-14" />
          <Text className="text-white text-2xl font-bold mt-4">
            Create Account
          </Text>
        </View>

        <TextInput
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          className="bg-dark-100 text-white px-4 py-3 rounded-lg mb-4"
          placeholderTextColor="#666"
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <View className="relative">
          <TextInput
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
            className="bg-dark-100 text-white px-4 py-3 rounded-lg mb-4"
            placeholderTextColor="#666"
          />
          <TouchableOpacity
            onPress={() => setShowPassword(!showPassword)}
            className={`absolute right-4 ${showPassword ? "top-3" : "top-4"}`}
          >
            <Image
              source={showPassword ? icons.hide : icons.show}
              className=""
              tintColor="#ccc"
            />
          </TouchableOpacity>
        </View>
        <View className="relative">
          <TextInput
            placeholder="Confirm Password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry={!showPassword}
            className="bg-dark-100 text-white px-4 py-3 rounded-lg mb-6"
            placeholderTextColor="#666"
          />
          <TouchableOpacity
            onPress={() => setShowPassword(!showPassword)}
            className={`absolute right-4 ${showPassword ? "top-3" : "top-4"}`}
          >
            <Image
              source={showPassword ? icons.hide : icons.show}
              className=""
              tintColor="#ccc"
            />
          </TouchableOpacity>
        </View>

        {error && (
          <Text className="text-red-500 text-center mb-4">{error}</Text>
        )}

        <TouchableOpacity
          onPress={handleSignup}
          disabled={loading}
          className="bg-accent py-3 rounded-lg"
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text className="text-white text-center font-bold text-lg">
              Sign Up
            </Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => router.push("/login")}
          className="mt-4"
        >
          <Text className="text-white text-center">
            Already have an account? Sign In
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
