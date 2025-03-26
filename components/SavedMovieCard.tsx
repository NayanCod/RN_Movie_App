import { View, Text, TouchableOpacity, Image } from "react-native";
import React from "react";
import { Link } from "expo-router";
import { icons } from "@/constants/icons";
import { auth, db } from "@/services/firebase";
import {
  collection,
  deleteDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";

const SavedMovieCard = ({
  movieId,
  poster,
  title,
  vote_average,
}: SavedMovie) => {
  const removeFromSaved = async () => {
    const user = auth.currentUser;
    if (!user) return;

    try {
      const savedMoviesRef = collection(db, "users", user.uid, "savedMovies");
      console.log("saved movie found: ", savedMoviesRef);
      
      const quiry = query(savedMoviesRef, where("movieId", "==", movieId));
      const snapshot = await getDocs(quiry);
      snapshot.forEach(async (doc) => {
        await deleteDoc(doc.ref);
      });
      console.log("movie deleted from saved");
      
    } catch (error) {
      console.log(error);
    }
  };
  return (
    // <Link href={`/movies/${id}`} asChild>
    <View className="w-[30%]">
      <Link href={`/movies/${movieId}`} asChild>
        <TouchableOpacity>
          <Image
            source={{
              uri: poster
                ? `https://image.tmdb.org/t/p/w500${poster}`
                : "https://placehold.co/600x400/1a1a1a/ffffff.png",
            }}
            className="w-full h-52 rounded-lg"
            resizeMode="cover"
          />
        </TouchableOpacity>
      </Link>
      <Text className="text-sm fold-bold text-white mt-2" numberOfLines={1}>
        {title}
      </Text>
      <View className="flex-row items-start justify-between mt-1">
        <View>
          <View className="flex-row items-center justify-start gap-x-1">
            <Image source={icons.star} className="size-4" />
            <Text className="text-white text-xs font-bold uppercase">
              {Math.round(vote_average / 2)}
            </Text>
          </View>
        </View>
        <TouchableOpacity onPress={removeFromSaved}>
          <Image
            source={icons.bookmarked}
            className="size-4 mr-4"
            tintColor="#fff"
          />
        </TouchableOpacity>
      </View>
    </View>
    // </Link>
  );
};

export default React.memo(SavedMovieCard);
