import { router, useLocalSearchParams } from "expo-router";
import { Pressable, Text, View } from "react-native";

export default function CheckoutScreen() {
  const { total } = useLocalSearchParams();

  const totalNumber = Number(total) || 0;

  return (
    <View className="flex-1 bg-gray-100 p-5">
      <Pressable
        onPress={() => router.back()}
        className="mb-6"
      >
        <Text className="text-lg text-blue-600">
          ← Quay lại
        </Text>
      </Pressable>

      <Text className="mb-6 text-3xl font-bold">
        Thanh toán
      </Text>

      <View className="rounded-xl bg-white p-5">
        <Text className="text-base text-gray-500">
          Tổng tiền
        </Text>

        <Text className="mt-2 text-2xl font-bold text-blue-600">
          {totalNumber.toLocaleString("vi-VN")}đ
        </Text>
      </View>
    </View>
  );
}