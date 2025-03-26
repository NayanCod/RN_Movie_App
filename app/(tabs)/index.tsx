import SearchBar from "@/components/SearchBar";
import { icons } from "@/constants/icons";
import { images } from "@/constants/images";
import {
  ActivityIndicator,
  FlatList,
  Image,
  RefreshControl,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useRouter } from "expo-router";
import useFetch from "@/services/useFetch";
import { fetchMovies } from "@/services/api";
import MovieCard from "@/components/MovieCard";
import { useCallback, useEffect, useRef, useState } from "react";

export default function Index() {
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState<number>(1);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const flatListRef = useRef<FlatList>(null);

  const {
    data: fetchedMovies,
    loading,
    error,
    refetch: refetchMovies,
  } = useFetch(() => fetchMovies({ query: "", page: page }));

  useEffect(() => {
    if (fetchedMovies) {
      setMovies((prevMovies) => {
        const filteredMovies = fetchedMovies.filter(
          (movie: Movie) =>
            !prevMovies.some((prevMovie) => prevMovie?.id === movie?.id)
        );
        return page === 1 ? filteredMovies : [...prevMovies, ...filteredMovies];
      });
    }
  }, [fetchedMovies]);

  const onRefresh = async () => {
    setRefreshing(true);
    setPage(1);
    await refetchMovies();
    setRefreshing(false);
  };

  const loadMoreMovies = useCallback(() => {
    setPage((prevPage) => prevPage + 1);
  }, []);

  useEffect(() => {
    refetchMovies();
  }, [page]);

  const renderMovieItem = useCallback(
    ({ item }: { item: Movie }) => <MovieCard {...item} />,
    []
  );

  const handleScroll = (event: any) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    setShowScrollTop(offsetY > 500); // Show after scrolling down 500px
  };

  const scrollToTop = () => {
    flatListRef.current?.scrollToOffset({ offset: 0, animated: true });
  };

  return (
    <View className="flex-1 bg-primary">
      <Image source={images.bg} className="absolute w-full z-0" />
      {loading && page == 1 ? (
        <ActivityIndicator
          size="large"
          color="#0000ff"
          className="mt-10 self-center"
        />
      ) : error ? (
        <Text>Error: {error?.message}</Text>
      ) : (
        <>
          <FlatList
            ref={flatListRef}
            data={movies}
            // renderItem={({ item }) => <MovieCard {...item} />}
            renderItem={renderMovieItem}
            keyExtractor={(item) => item.id.toString()}
            numColumns={3}
            columnWrapperStyle={{
              justifyContent: "flex-start",
              gap: 20,
              paddingRight: 5,
              marginBottom: 10,
            }}
            contentContainerStyle={{ paddingBottom: 150 }}
            className="mt-2 pb-32 px-5"
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
            onEndReachedThreshold={0.8}
            initialNumToRender={12}
            maxToRenderPerBatch={12}
            windowSize={5}
            removeClippedSubviews={true}
            onScroll={handleScroll}
            scrollEventThrottle={16}
            ListHeaderComponent={
              <>
                <View className="w-full flex-row justify-center mt-20 mb-5 items-center">
                  <Image source={icons.logo} className="w-12 h-10" />
                </View>
                <View className="my-5">
                <SearchBar
                  onPress={() => router.push("/search")}
                  placeholder="Search movies..."
                />
                </View>
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
          {showScrollTop && (
            <TouchableOpacity
              onPress={scrollToTop}
              className="absolute bottom-28 right-8 bg-accent p-3 rounded-full elevation-sm"
            >
              {/* <AntDesign name="arrowup" size={24} color="#fff" /> */}
              <Image
                source={icons.up}
                className="w-6 h-6"
                tintColor="#ffffff"
              />
            </TouchableOpacity>
          )}
        </>
      )}
    </View>
  );
}
