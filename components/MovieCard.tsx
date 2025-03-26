import { View, Text, TouchableOpacity, Image } from "react-native";
import React, { useEffect, useState } from "react";
import { Link } from "expo-router";
import { icons } from "@/constants/icons";
import { auth, db } from "@/services/firebase";
import { addDoc, collection, deleteDoc, getDocs, query, where } from "firebase/firestore";

const MovieCard = ({
  id,
  poster_path,
  title,
  vote_average,
  release_date,
  adult
}: Movie) => {

  const [isSaved, setIsSaved] = useState(false);
  const user = auth.currentUser;

  useEffect(() => {
    checkIfMovieSaved();
  }, []);

  const checkIfMovieSaved = async () => {
    if (!user) return;
    try {
      const q = query(
        collection(db, 'users', user.uid, 'savedMovies'),
        where('movieId', '==', id)
      );
      const querySnapshot = await getDocs(q);
      setIsSaved(!querySnapshot.empty);
    } catch (error) {
      console.error('Error checking saved movie:', error);
    }
  };

  const toggleSaveMovie = async () => {
    if (!user) {
      alert('Please login to save movies');
      return;
    }
    try {
      if (isSaved) {
        const q = query(
          collection(db, 'users', user.uid, 'savedMovies'),
          where('movieId', '==', id)
        );
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach(async (doc) => {
          await deleteDoc(doc.ref);
        });
        setIsSaved(false);
      } else {
        await addDoc(collection(db, 'users', user.uid, 'savedMovies'), {
          movieId: id,
          title: title,
          poster: poster_path,
          vote_average: vote_average,
          savedAt: new Date(),
        });
        setIsSaved(true);
      }
    } catch (error) {
      console.error('Error updating movie:', error);
      alert('Failed to update movie');
    }
  };


  return (
      <View className="w-[30%]">
        <Link href={`/movies/${id}`} asChild>
        <TouchableOpacity>
        <Image
          source={{
            uri: poster_path
              ? `https://image.tmdb.org/t/p/w500${poster_path}`
              : "https://placehold.co/600x400/1a1a1a/ffffff.png",
          }}
          className="w-full h-52 rounded-lg"
          resizeMode="cover"
        />
        </TouchableOpacity>
        </Link>
        <Text className="text-sm fold-bold text-white mt-2" numberOfLines={1}>{title}</Text>
        <View className="flex-row items-start justify-between mt-1">
        <View>
        <View className="flex-row items-center justify-start gap-x-1">
          <Image source={icons.star} className="size-4"/>
          <Text className="text-white text-xs font-bold uppercase">{Math.round(vote_average / 2)}</Text>
        </View>
        <View className="flex-row items-center justify-between">
            <Text className="text-xs text-light-300 font-medium mt-1">{release_date?.split('-')[0]}</Text>
        </View>
        </View>
        <View>
        <TouchableOpacity onPress={toggleSaveMovie}>
          <Image source={isSaved ? icons.bookmarked : icons.bookmark} className="size-4 mr-4" tintColor="#fff"/>
        </TouchableOpacity>
        <Text className="text-xs text-light-300 font-medium mt-1">{adult ? '18+' : ''}</Text>
        </View>
        </View>
      </View>
  );
};

export default React.memo(MovieCard);
