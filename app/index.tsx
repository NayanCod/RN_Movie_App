import { ScrollView, StatusBar, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { images } from "@/constants/images";
import { Image } from "react-native";
import { icons } from "@/constants/icons";
import { Redirect, useRouter } from "expo-router";
import { useAuth } from "@/context/AuthContext";

const index = () => {

  // const { signIn, userInfo, loading, error } = useAuth();
  const router = useRouter();

  // // If user is already logged in, redirect to tabs
  // if (userInfo) {
  //   return <Redirect href="/(tabs)" />;
  // }
  return (
    <>
    <StatusBar hidden={true}/>
    <ScrollView className="flex-1 bg-primary">
    <View className="">
      <Image source={images.bg} className="absolute w-full z-0" />
      <View className="w-full flex-row justify-center mt-20 mb-5 items-center">
        <Image source={icons.logo} className="w-12 h-10" />
      </View>
      <View className="w-full flex-row justify-center mt-5 mb-5 items-center">
        <Image
          source={images.hero}
          className="w-full h-[400]"
          resizeMode="contain"
        />
      </View>
      <View className="my-2 flex-col justify-center items-center">
        <Text className="text-accent text-2xl font-bold">
          Welcome to WatchSpot
        </Text>
        <Text className="text-white text-sm font-medium text-center px-6 my-2 italic">
          Discover the latest movies. Scroll, explore, and find your next
          favorite film. 🍿🎥
        </Text>
      </View>
      <View className="px-6">
      {/* <TouchableOpacity
      onPress={signIn}
      disabled={loading}  
      className={`bg-dark-100 py-3 rounded-full mt-5 shadow-lg`}>
        <Text className="text-white text-lg font-bold text-center">
          {loading && !error ? 'Loading..' : 'Start Watching'}
        </Text>
      </TouchableOpacity> */}
      <TouchableOpacity
      onPress={() => router.push("/(tabs)")}
      className={`bg-dark-100 py-3 rounded-full mt-5 shadow-lg`}>
        <Text className="text-white text-lg font-bold text-center">
          Start Watching
        </Text>
      </TouchableOpacity>
      {/* <Text className="text-center text-white text-sm mt-2">
        {error}
      </Text> */}
      </View>
    </View>
    </ScrollView>
    </>
  );
};

export default index;
