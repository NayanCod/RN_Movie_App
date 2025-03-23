import {
  View,
  Text,
  ActivityIndicator,
  FlatList,
  Image,
  TouchableOpacity,
  RefreshControl,
} from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import useFetch from "@/services/useFetch";
import { fetchMovieVideo } from "@/services/api";
import { icons } from "@/constants/icons";
// import { WebView } from "react-native-webview";
import { images } from "@/constants/images";
import YoutubePlayer from "react-native-youtube-iframe";

interface VideoInfoProps {
  name: string;
  type: string;
  playVideo: () => void;
  selected: boolean;
}

const VideoInfo = ({ name, type, playVideo, selected }: VideoInfoProps) => (
  <TouchableOpacity
    onPress={playVideo}
    className={`flex-row items-center my-2 gap-4 px-5 rounded-xl py-3 ${
      selected ? "bg-gray-700" : ""
    }`}
  >
    <TouchableOpacity
      onPress={playVideo}
      className="flex items-center justify-center"
    >
      <Image
        source={selected ? icons.pauseBtn : icons.playBtn}
        className="w-5 h-5"
        resizeMode="stretch"
      />
    </TouchableOpacity>
    <View>
      <Text className="text-light-100 font-normal text-sm" numberOfLines={1}>
        {name}
      </Text>
      <Text className="text-light-200 font-bold text-sm">{type || "N/A"}</Text>
    </View>
  </TouchableOpacity>
);

const trailer = () => {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [refreshing, setRefreshing] = useState(false);

  const {
    data: videos,
    loading,
    error,
    refetch,
  } = useFetch(() => fetchMovieVideo(Number(id)));

  const topVideo = videos && videos[0];
  const topVideoKey = topVideo?.key ?? null;
  const [selectedKey, setSelectedKey] = useState(topVideoKey);

  const onRefresh = async () => {
    setRefreshing(true);
    // setPage(1);
    await refetch();
    setRefreshing(false);
  };

  if (loading)
    return (
      <SafeAreaView className="bg-primary flex-1">
        <ActivityIndicator />
      </SafeAreaView>
    );
  return (
    <SafeAreaView className="w-full flex-1 bg-primary">
      <Image source={images.bg} className="absolute w-full z-0" />
      <View className="w-full flex-col justify-center mt-20 mb-5 items-center">
        <Image source={icons.logo} className="w-12 h-10" />
        <Text>{}</Text>
      </View>
      {selectedKey && (
        <>
          <View className="w-full mb-3 overflow-hidden rounded-2xl">
            <YoutubePlayer
              height={230}
              play={true}
              videoId={selectedKey}
              webViewProps={{
                allowsFullscreenVideo: true,
              }}
            />
          </View>
          <View className="w-full h-1 bg-dark-100 rounded-full mb-3"></View>
        </>
      )}
      {error && <Text className="text-red-500 px-5 my-3">{error.message}</Text>}
      <FlatList
        data={videos}
        renderItem={({ item }) => (
          <VideoInfo
            {...item}
            playVideo={() => setSelectedKey(item?.key)}
            selected={selectedKey === item?.key}
          />
        )}
        keyExtractor={(item) => item.id.toString()}
        className="px-2"
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
        contentContainerStyle={{ paddingBottom: 100 }}
        ListEmptyComponent={
          !loading && !error ? (
            <View className="mt-10 px-5">
              <Text className="text-center text-gray-500">
                No trailers or clips found
              </Text>
            </View>
          ) : null
        }
      />
      <TouchableOpacity
        className="absolute bottom-20 left-0 right-0 mx-5 bg-accent rounded-lg py-3.5 flex flex-row items-center justify-center z-50"
        onPress={router.back}
      >
        <Image
          source={icons.arrow}
          className="size-5 mr-1 mt-0.5 rotate-180"
          tintColor="#fff"
        />
        <Text className="text-white font-semibold text-base">Go Back</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default trailer;
