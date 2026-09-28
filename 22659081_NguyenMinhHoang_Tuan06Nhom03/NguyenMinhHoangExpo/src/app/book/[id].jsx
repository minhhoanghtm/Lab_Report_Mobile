import { router, useLocalSearchParams } from "expo-router";
import { Pressable, Text, View } from "react-native";

export default function BookDetailScreen() {
  const { id } = useLocalSearchParams();

  return (
    <View className="flex-1 bg-white p-5">
      <Pressable
        onPress={() => router.back()}
        className="mb-6"
      >
        <Text className="text-lg text-blue-600">
          ← Quay lại
        </Text>
      </Pressable>

      <Text className="text-2xl font-bold">
        Chi tiết sách
      </Text>

      <Text className="mt-4 text-lg text-gray-600">
        Book ID: {id}
      </Text>
    </View>
  );
}