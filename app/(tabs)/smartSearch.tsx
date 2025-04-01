import MovieCard from "@/components/MovieCard";
import SearchBar from "@/components/SearchBar";
import { icons } from "@/constants/icons";
import { images } from "@/constants/images";
import { fetchMoviesByName } from "@/services/api";
import { getGeminiResponse } from "@/services/geminiService";
import { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  ActivityIndicator,
  FlatList,
} from "react-native";

const Save = () => {
  const [input, setInput] = useState("");
  const [movies, setMovies] = useState<string[]>([]);
  const [showMovies, setShowMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    setLoading(true);
    setError(null);
    setMovies([]);

    try {
      const aiResponse = await getGeminiResponse(input);
      const movieList = aiResponse
        .split("\n")
        .map((movie: string) => movie.replace(/^\d+\.\s*/, ""))
        .filter((movie: string) => movie.trim() !== "");
      
      setMovies(movieList);
    } catch (error) {
      setError("Error generating movie recommendations.");
    }
  };

  const getMovies = async (names: string[]) => {
    setLoading(true);
    setError(null);
    const allMovies: Movie[] = [];
    const movieIds = new Set();

    try {
      for (const name of names) {
        const res = await fetchMoviesByName(name);
        
        if (res) {
          Array.isArray(res) && res.map((movie: Movie) => {
            if (!movieIds.has(movie.id)) {
              movieIds.add(movie.id);
              allMovies.push(movie);
            }
          });
        }
      }
      setShowMovies(allMovies);
    } catch (error) {
      setError("Error fetching movies.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (movies.length > 0) {
      getMovies(movies);
    }
  }, [movies]);

  useEffect(() => {
    if (input.length === 0) {
      setMovies([]);
      setShowMovies([]);
    }
  }, [input]);
  return (
    <View className="flex-1 bg-primary">
      <Image source={images.bg} className="absolute w-full z-0" />
      <View className="w-full flex-row justify-center mt-20 mb-5 gap-5 items-center">
        <Image source={icons.logo} className="w-12 h-10" />
        <Text className="text-accent text-3xl font-bold">+</Text>
        <Image source={icons.gemini} className="w-12 h-10" />
      </View>
      <View className="my-5 px-5">
        <SearchBar
          placeholder="What kind of movies you wanna see..."
          value={input}
          onChangeText={(text: string) => setInput(text)}
          onSubmitEditing={handleGenerate}
          autocomplete={true}
        />
        {loading && (
          <ActivityIndicator size="large" color="#0000ff" className="my-3" />
        )}
        {error && <Text className="text-red-500 px-5 my-3">{error}</Text>}
        <FlatList
        data={showMovies.filter((movie) => movie.poster_path)}
        renderItem={({ item }) => <MovieCard {...item} />}
        keyExtractor={(item) => item.id.toString()}
        className="px-5"
        numColumns={3}
        columnWrapperStyle={{
          justifyContent: "flex-start",
          gap: 16,
          marginVertical: 16,
        }}
        contentContainerStyle={{ paddingBottom: 100 }}
        ListHeaderComponent={
          <>
          {
            showMovies.length > 0 && (
              <Text className="text-accent my-4 text-xl">Your search results ({showMovies?.filter((movie) => movie.poster_path).length})</Text>
            )
          }
          </>
        }
        ListEmptyComponent={
          !loading && !error ? (
            <View className="mt-10 px-2">
              <Text className="text-center text-gray-500">
                {input.trim()
                  ? "No movies found"
                  : "Search for types of movies you wanna see"}
              </Text>
            </View>
          ) : null
        }
      />
      </View>
    </View>
  );
};

export default Save;
