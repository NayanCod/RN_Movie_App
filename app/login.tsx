import { View, Text, TextInput, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { useAuth } from '@/context/AuthContext';
import { useRouter, Redirect } from 'expo-router';
import { useState } from 'react';
import { images } from '@/constants/images';
import { icons } from '@/constants/icons';

export default function Login() {
  const router = useRouter();
  const { signIn, user, loading, error } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  if (user) {
    return <Redirect href="/(tabs)" />;
  }

  const handleLogin = async () => {
    if (!email || !password) {
      console.error('Please fill in all fields');
      return;
    }
    try {
      await signIn(email, password);
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  return (
    <View className="flex-1 bg-primary">
      <Image source={images.bg} className="absolute w-full z-0" />
      <View className="flex-1 px-6 justify-center">
        <View className="w-full items-center mb-10">
          <Image source={icons.logo} className="w-16 h-14" />
          <Text className="text-white text-2xl font-bold mt-4">Welcome Back!</Text>
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
        <TextInput
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          className="bg-dark-100 text-white px-4 py-3 rounded-lg mb-6"
          placeholderTextColor="#666"
        />
        
        {error && (
          <Text className="text-red-500 text-center mb-4">{error}</Text>
        )}
        
        <TouchableOpacity
          onPress={handleLogin}
          disabled={loading}
          className="bg-accent py-3 rounded-lg">
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text className="text-white text-center font-bold text-lg">
              Sign In
            </Text>
          )}
        </TouchableOpacity>
        
        <TouchableOpacity 
          onPress={() => router.push("/signup")}
          className="mt-4">
          <Text className="text-white text-center">
            Don't have an account? Sign Up
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}