import { icons } from "@/constants/icons";
import { View, Text, Image, TouchableOpacity, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "expo-router";

const Profile = () => {
  const { user, logout, loading } = useAuth();
  const router = useRouter();

  const getInitial = (email: string | null | undefined) => {
    if (!email) return '?';
    return email.charAt(0).toUpperCase();
  };

  const handleLogout = async () => {
    try {
      await logout();
      router.replace('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

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
    <SafeAreaView className="bg-primary flex-1">
      <View className="px-6 py-8">
        {/* Profile Header */}
        <View className="items-center mb-8">
          <View className="bg-accent rounded-full py-6 px-8 mb-4">
          <Text className="text-white text-4xl font-bold">
              {getInitial(user?.email)}
            </Text>
          </View>
          <Text className="text-white text-xl font-bold">
            {user?.email}
          </Text>
        </View>

        {/* Profile Options */}
        {/* <View className="bg-dark-200 rounded-2xl p-4 mb-6"> */}
          <TouchableOpacity className="bg-dark-200 flex-row items-center py-5 px-4 rounded-xl mb-4">
            <Image 
              source={icons.setting} 
              className="size-5 mr-4"
              tintColor="#fff" 
            />
            <Text className="text-white text-base">Settings</Text>
          </TouchableOpacity>
          
          <TouchableOpacity onPress={() => router.push("/saved")} className="bg-dark-200 flex-row items-center py-5 px-4 rounded-xl mb-4">
            <Image 
              source={icons.save} 
              className="size-5 mr-4"
              tintColor="#fff" 
            />
            <Text className="text-white text-base">Saved movies</Text>
          </TouchableOpacity>

          <TouchableOpacity className="bg-dark-200 flex-row items-center py-5 px-4 rounded-xl mb-4">
            <Image 
              source={icons.info} 
              className="size-5 mr-4"
              tintColor="#fff" 
            />
            <Text className="text-white text-base">About</Text>
          </TouchableOpacity>
          
          <TouchableOpacity className="bg-dark-200 flex-row items-center py-5 px-4 rounded-xl mb-4">
            <Image 
              source={icons.help} 
              className="size-5 mr-4"
              tintColor="#fff" 
            />
            <Text className="text-white text-base">Help</Text>
          </TouchableOpacity>
        {/* </View> */}

        {/* Logout Button */}
        <TouchableOpacity 
          onPress={handleLogout}
          className="bg-red-500 py-4 rounded-xl"
        >
          <Text className="text-white text-center font-bold text-base">
            {loading ? 'Logging out...' : 'Logout'}
          </Text>
        </TouchableOpacity>

        {/* App Version */}
        <Text className="text-gray-500 text-center mt-6">
          Version 1.0.0
        </Text>
      </View>
    </SafeAreaView>
  );
};

export default Profile;