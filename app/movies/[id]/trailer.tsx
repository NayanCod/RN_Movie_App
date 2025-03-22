import { View, Text } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams } from "expo-router";

const trailer = () => {
  const { id } = useLocalSearchParams();
  return (
    <SafeAreaView className="flex-1 bg-primary">
      <Text className="text-white">trailer - of - {id}</Text>
    </SafeAreaView>
  );
};

export default trailer;
