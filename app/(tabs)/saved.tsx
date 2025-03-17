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
  TextInput,
  Button,
  ScrollView,
  ActivityIndicator,
} from "react-native";

const Save = () => {
  const [input, setInput] = useState("");
  const [movies, setMovies] = useState([]);
  const [showMovies, setShowMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleGenerate = async () => {
    setLoading(true);
    setError(null);
    setMovies([]);

    const aiResponse = await getGeminiResponse(input);
    const movieList = aiResponse
      .split("\n")
      .map((movie: string) => movie.replace(/^\d+\.\s*/, ""))
      .filter((movie: string) => movie.trim() !== ""); // Remove numbering
    // const filteredMovieList = movieList.filter(movie: => movie.trim() !== "");
    // setResponse(aiResponse);
    setMovies(movieList);
  };

  const getMovies = async (name: string) => {
    setLoading(true);
    const res = await fetchMoviesByName(name);
    if (res) {
      setShowMovies(res);
      setLoading(false);
    }
    console.log(res);
  };

  useEffect(() => {
    if (movies.length > 0 && movies?.[0]) {
      getMovies(movies[0]);
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
          placeholder="what kind of movies you wanna see..."
          value={input}
          onChangeText={(text: string) => setInput(text)}
          onSubmitEditing={handleGenerate}
        />
        {loading && (
          <ActivityIndicator size="large" color="#0000ff" className="my-3" />
        )}
        {error && <Text className="text-red-500 px-5 my-3">{error}</Text>}
        <ScrollView style={{ marginTop: 20 }} className="">
          {showMovies.length > 0 ? (
            <>
              <Text className="text-accent my-4 text-xl">Your Top Results</Text>
              <View className="w-full flex-row gap-4 flex-wrap pb-72">
                {showMovies.map((movie: Movie) => (
                  <MovieCard key={movie.id} {...movie} />
                ))}
              </View>
            </>
          ) : (
            <View className="mt-10 px-5">
              <Text className="text-center text-gray-500">
                {input.trim()
                  ? "No movies found"
                  : "Search for types of movies you wanna see"}
              </Text>
            </View>
          )}
        </ScrollView>
      </View>
    </View>
  );
};

export default Save;
