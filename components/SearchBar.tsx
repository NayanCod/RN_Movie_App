import { FlatList, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View } from "react-native";
import React, { useEffect, useState } from "react";
import { Image } from "react-native";
import { icons } from "@/constants/icons";
import { getSearchSuggestion } from "@/services/geminiService";

interface Props {
  placeholder: string;
  value?: string;
  onChangeText?: (text: string) => void;
  onPress?: () => void;
  onSubmitEditing?: () => void;
}
const SearchBar = ({
  placeholder,
  onPress,
  value,
  onChangeText,
  onSubmitEditing,
}: Props) => {
  const [suggestions, setSuggestions] = useState<string[]>([]);

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (value && value.trim().length > 0) {
        const results = await getSearchSuggestion(value);
        const searchResults = results
          .split("\n")
          .map((movie: string) => movie.replace(/^\d+\.\s*/, ""))
          .filter((movie: string) => movie.trim() !== ""); // Remove numbering
        console.log("search result: ", searchResults);

        setSuggestions(searchResults);
      } else {
        setSuggestions([]);
      }
    };
    const timeoutId = setTimeout(async () => {
      if (value && value.trim()) {
        await fetchSuggestions();
      } else {
        setSuggestions([])
      }
    }, 700);

    return () => clearTimeout(timeoutId);
    if(value?.length === 0){
      setSuggestions([])
    }
  }, [value]);

  const handleSuggestionPress = (suggestion: string) => {
    if (onChangeText) {
      onChangeText(suggestion);
    }
    setSuggestions([]);
  };
  return (
    <View className='flex-col relative'>
    <View className="flex-row items-center bg-dark-100 px-5 py-1 rounded-full">
      <Image
        source={icons.search}
        className="size-5"
        resizeMode="contain"
        tintColor="#ab8bff"
      />
      <TextInput
        onPress={onPress}
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
        onSubmitEditing={onSubmitEditing}
        placeholderTextColor="#a8b5db"
        className="flex-1 ml-2 text-white"
      />
      {value ? (
        <TouchableOpacity onPress={() => onChangeText && onChangeText("")}>
          <Image
            source={icons.cross}
            className="size-5"
            resizeMode="contain"
            tintColor="#ab8bff"
          />
        </TouchableOpacity>
      ) : null}
    </View>
    {suggestions.length > 0 && (
        <View className='absolute top-12 bg-dark-100 rounded-xl px-3 mt-4 z-50 w-full'>
          <FlatList
            data={suggestions}
            keyExtractor={(item) => item}
            renderItem={({ item }) => (
              <TouchableWithoutFeedback onPress={() => handleSuggestionPress(item)}>
                <View className='p-2 border-light-200 flex-row gap-3'>
                  <Image source={icons.search} className="size-5" resizeMode="contain" tintColor="#ab8bff"/>
                  <Text className='text-white'>{item}</Text>
                </View>
              </TouchableWithoutFeedback>
            )}
          />
        </View>
      )}
    </View>
  );
};

export default SearchBar;
