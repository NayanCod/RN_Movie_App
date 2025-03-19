import SearchBar from "@/components/SearchBar";
import { icons } from "@/constants/icons";
import { images } from "@/constants/images";
import { ActivityIndicator, FlatList, Image, RefreshControl, ScrollView, Text, View } from "react-native";
import { useRouter } from "expo-router";
import useFetch from "@/services/useFetch";
import { fetchMovies } from "@/services/api";
import MovieCard from "@/components/MovieCard";
import { useEffect, useState } from "react";
// import { getTrendingMovies } from "@/services/appwrite";
// import TrendingCard from "@/components/TrendingCard";

export default function Index() {
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState<number>(1);
  const [movies, setMovies] = useState<Movie[]>([]);

  // const {
  //   data: trendingMovies,
  //   loading: trendingLoading,
  //   error: trendingError,
  // } = useFetch(getTrendingMovies)

  const {
    data: fetchedMovies,
    loading,
    error,
    refetch: refetchMovies,
  } = useFetch(() => fetchMovies({ query: "", page: page}));

  useEffect(() => {
    if (fetchedMovies) {
      setMovies((prevMovies) => (page === 1 ? fetchedMovies : [...prevMovies, ...fetchedMovies]));
    }
  }, [fetchedMovies]);

  const onRefresh = async () => {
    setRefreshing(true);
    setPage(1);
    await refetchMovies();
    setRefreshing(false);
  };

  const loadMoreMovies = async () => {
    
    setPage((prevPage) => prevPage + 1);
    console.log("Load more movies triggered page: ", page);
  };

  useEffect(() => {
    
    refetchMovies();
  }, [page]);

  return (
    <View className="flex-1 bg-primary">
      <Image source={images.bg} className="absolute w-full z-0" />
      {/* <ScrollView
        className="flex-1 px-5"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ minHeight: "100%", paddingBottom: 10 }}
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
      > */}
        <Image source={icons.logo} className="w-12 h-10 mt-20 mb-5 mx-auto" />

        {loading && page == 1 ? (
          <ActivityIndicator
          size='large'
          color="#0000ff"
          className="mt-10 self-center" 
          />
        ): error ? (
          <Text>Error: {error?.message}</Text>
        ) : (
          <FlatList
          data={movies}
          renderItem={({ item }) => <MovieCard {...item} />}
          keyExtractor={(item) => item.id}
          numColumns={3}
          columnWrapperStyle={{
            justifyContent: 'flex-start',
            gap: 20,
            paddingRight: 5,
            marginBottom: 10
          }}
          className="mt-2 pb-32"
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
          onEndReached={loadMoreMovies}
          onEndReachedThreshold={1}
          ListHeaderComponent={
            <>
              <SearchBar
                onPress={() => router.push("/search")}
                placeholder="Search movies..."
              />
              <Text className="text-lg text-white font-bold mt-5 mb-3">
                Latest Movies
              </Text>
            </>
          }
          ListFooterComponent={
            loading && page > 1 ? (
              <View className="h-32">
              <ActivityIndicator size="large" color="#0000ff" />
              </View>
            ) : null
          }
        />
        )}

      {/* </ScrollView> */}
    </View>
  );
}
