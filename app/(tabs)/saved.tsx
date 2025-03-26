import {
  View,
  Text,
  Image,
  FlatList,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import { auth, db } from "@/services/firebase";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { images } from "@/constants/images";
import SavedMovieCard from "@/components/SavedMovieCard";
import { icons } from "@/constants/icons";
import { SafeAreaView } from "react-native-safe-area-context";

const saved = () => {
  const [movies, setMovies] = useState<SavedMovie[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const fetchSavedMovies = useCallback(() => {
    const user = auth.currentUser;
    if (!user) return;

    const savedMoviesRef = collection(db, "users", user.uid, "savedMovies");
    const q = query(savedMoviesRef, orderBy("savedAt", "desc"));
    return onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as SavedMovie[];
      setMovies(data);
      setLoading(false);
      setRefreshing(false);
    });
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchSavedMovies();
  }, [fetchSavedMovies]);

  useEffect(() => {
    setLoading(true);
    const unsubscribe = fetchSavedMovies();
    return () => unsubscribe?.();
  }, [fetchSavedMovies]);

  if (loading) {
    return (
      <SafeAreaView className="bg-primary flex-1">
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#fff" />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-primary h-full">
      <Image source={images.bg} className="absolute w-full z-0" />
      <FlatList
        data={movies}
        renderItem={({ item }) => <SavedMovieCard {...item} />}
        keyExtractor={(item) => item.id.toString()}
        numColumns={3}
        columnWrapperStyle={{
          justifyContent: "flex-start",
          gap: 20,
          paddingRight: 5,
          marginBottom: 20,
        }}
        contentContainerStyle={{ paddingBottom: 100, minHeight: "100%" }}
        className="mt-2 px-5"
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#ff0000", "#00ff00", "#0000ff"]}
            tintColor="#ffffff"
            title="Pull to refresh"
            titleColor="#ffffff"
          />
        }
        ListHeaderComponent={
          <>
            <View className="w-full flex-row justify-center mt-20 mb-5 items-center">
              <Image source={icons.logo} className="w-12 h-10" />
            </View>
            <View className="my-5">
              <Text className="text-lg text-white font-bold my-5 mb-3">
                Your saved movies
              </Text>
            </View>
          </>
        }
        ListEmptyComponent={
          <>
            <View className="mt-20">
            <Text className="text-white text-center text-lg font-bold">
              No saved movies yet
            </Text>
            <Text className="text-gray-400 text-center mt-2 px-10">
              Movies you save will appear here for quick access
            </Text>
          </View>
          </>
        }
      />
    </SafeAreaView>
  );
};

export default saved;
