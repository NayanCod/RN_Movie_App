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
import { useLocalSearchParams } from "expo-router";
import useFetch from "@/services/useFetch";
import { fetchMovieVideo } from "@/services/api";
import { icons } from "@/constants/icons";
import { WebView } from "react-native-webview";
import { images } from "@/constants/images";

interface VideoInfoProps {
  name: string;
  type: string;
  playVideo: () => void;
  selected: boolean;
}

const VideoInfo = ({ name, type, playVideo, selected }: VideoInfoProps) => (
  <TouchableOpacity
    onPress={playVideo}
    className={`flex-row items-center my-4 gap-4 px-5 rounded-xl py-3 ${selected ? 'bg-gray-700' : ''}`}
  >
    <TouchableOpacity
      onPress={playVideo}
      className="flex items-center justify-center"
    >
      <Image source={selected ? icons.pauseBtn : icons.playBtn} className="w-5 h-5" resizeMode="stretch" />
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
  const [refreshing, setRefreshing] = useState(false);
  const priorityOrder = ["Trailer", "Teaser", "Clip", "Featurette"];
  const { id } = useLocalSearchParams();
  const {
    data: videos,
    loading,
    error,
    refetch,
  } = useFetch(() => fetchMovieVideo(Number(id)));

  const filteredAndSortedVideos = videos
    ?.filter((video: MovieVideo) =>
      ["Trailer", "Teaser", "Clip", "Featurette"].includes(video.type)
    )
    .sort(
      (a: MovieVideo, b: MovieVideo) =>
        priorityOrder.indexOf(a.type) - priorityOrder.indexOf(b.type)
    );

  console.log("movie videos: ", filteredAndSortedVideos);

  const topVideo = filteredAndSortedVideos && filteredAndSortedVideos[0];
  const topVideoKey = topVideo?.key ?? null;
  const [selectedKey, setSelectedKey] = useState(topVideoKey);
  const [embedVideo, setEmbedVideo] = useState(
    topVideo && `https://www.youtube.com/embed/${topVideo.key}`
  );
  const [loadPlay, setLoadPLay] = useState(false);

  const handlePlay = (key: string) => {
    setLoadPLay(true);
    setSelectedKey(key);
    setEmbedVideo(`https://www.youtube.com/embed/${key}`);
    setLoadPLay(false);
  };

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
      <FlatList
        data={filteredAndSortedVideos}
        renderItem={({ item }) => (
          <VideoInfo {...item} playVideo={() => handlePlay(item?.key)} selected={selectedKey === item?.key} />
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
        ListHeaderComponent={
          <>
            <View className="w-full flex-col justify-center mt-20 mb-5 items-center">
              <Image source={icons.logo} className="w-12 h-10" />
              <Text>{}</Text>
            </View>
            {loadPlay && (
              <ActivityIndicator
                size="large"
                color="#0000ff"
                className="my-3"
              />
            )}
            {embedVideo && (
              <>
                <View className="w-full h-60 mb-5 overflow-hidden rounded-2xl">
                  <WebView
                    source={{ uri: embedVideo }}
                    style={{ flex: 1 }}
                    allowsFullscreenVideo
                  />
                </View>
                <View className="w-full h-1 bg-dark-100 rounded-full my-3"></View>
              </>
            )}
            {error && (
              <Text className="text-red-500 px-5 my-3">{error.message}</Text>
            )}
          </>
        }
        ListEmptyComponent={
          !loading && !error ? (
            <View className="mt-10 px-5">
              <Text className="text-center text-gray-500">
                No tarilers or clip found
              </Text>
            </View>
          ) : null
        }
      />
    </SafeAreaView>
  );
};

export default trailer;
