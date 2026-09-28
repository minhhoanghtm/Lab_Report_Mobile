import {
    Pressable,
    ScrollView,
    Text,
    View,
} from "react-native";

import { router } from "expo-router";

import { useCart } from "../../hooks/useCart";

export default function CartScreen() {
  const {
    items,
    removeFromCart,
    updateQuantity,
    totalPrice,
  } = useCart();

  const handleCheckout = () => {
    router.push({
      pathname: "/checkout",
      params: {
        total: totalPrice.toString(),
      },
    });
  };

  if (items.length === 0) {
    return (
      <View className="flex-1 items-center justify-center bg-gray-100 p-5">
        <Text className="text-xl font-bold">
          Giỏ hàng đang trống
        </Text>

        <Text className="mt-2 text-gray-500">
          Hãy thêm sách vào giỏ hàng
        </Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-100">
      <ScrollView
        contentContainerStyle={{
          padding: 20,
        }}
      >
        <Text className="mb-5 text-3xl font-bold">
          Giỏ hàng
        </Text>

        {items.map((item) => (
          <View
            key={item.bookId}
            className="mb-4 rounded-xl bg-white p-4"
          >
            <Text className="text-lg font-bold">
              {item.title}
            </Text>

            <Text className="mt-1 text-blue-600">
              {item.price.toLocaleString("vi-VN")}đ
            </Text>

            <View className="mt-4 flex-row items-center">
              <Pressable
                onPress={() =>
                  updateQuantity(
                    item.bookId,
                    item.quantity - 1
                  )
                }
                className="h-9 w-9 items-center justify-center rounded-lg bg-gray-200"
              >
                <Text className="text-lg font-bold">
                  −
                </Text>
              </Pressable>

              <Text className="mx-5 text-lg font-bold">
                {item.quantity}
              </Text>

              <Pressable
                onPress={() =>
                  updateQuantity(
                    item.bookId,
                    item.quantity + 1
                  )
                }
                className="h-9 w-9 items-center justify-center rounded-lg bg-gray-200"
              >
                <Text className="text-lg font-bold">
                  +
                </Text>
              </Pressable>
            </View>

            <Pressable
              onPress={() =>
                removeFromCart(item.bookId)
              }
              className="mt-4"
            >
              <Text className="font-semibold text-red-500">
                Xóa
              </Text>
            </Pressable>
          </View>
        ))}

        <View className="rounded-xl bg-white p-5">
          <Text className="text-gray-500">
            Tổng tiền
          </Text>

          <Text className="mt-2 text-2xl font-bold text-blue-600">
            {totalPrice.toLocaleString("vi-VN")}đ
          </Text>

          <Pressable
            onPress={handleCheckout}
            className="mt-5 rounded-xl bg-blue-600 py-4"
          >
            <Text className="text-center font-bold text-white">
              Thanh toán
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}