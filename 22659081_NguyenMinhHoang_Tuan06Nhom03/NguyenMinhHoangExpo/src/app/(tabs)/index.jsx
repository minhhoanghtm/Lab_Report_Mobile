import { router } from "expo-router";
import { Pressable, Text, View } from "react-native";
import { useCart } from "../../hooks/useCart";

const books = [
  {
    id: "1",
    title: "Đắc Nhân Tâm",
    author: "Dale Carnegie",
    price: 86000,
  },
  {
    id: "2",
    title: "Nhà Giả Kim",
    author: "Paulo Coelho",
    price: 79000,
  },
  {
    id: "3",
    title: "Clean Code",
    author: "Robert C. Martin",
    price: 350000,
  },
];

export default function HomeScreen() {
  const { addToCart } = useCart();

  return (
    <View className="flex-1 bg-gray-100 p-5">
      <Text className="mb-5 text-3xl font-bold">
        Home
      </Text>

      {books.map((book) => (
        <View
          key={book.id}
          className="mb-3 rounded-xl bg-white p-4"
        >
          <Pressable
            onPress={() =>
              router.push({
                pathname: "/book/[id]",
                params: {
                  id: book.id,
                },
              })
            }
          >
            <Text className="text-lg font-bold">
              {book.title}
            </Text>

            <Text className="text-gray-500">
              {book.author}
            </Text>

            <Text className="mt-2 font-bold text-blue-600">
              {book.price.toLocaleString("vi-VN")}đ
            </Text>
          </Pressable>

          <Pressable
            onPress={() => addToCart(book)}
            className="mt-3 rounded-xl bg-blue-600 py-3"
          >
            <Text className="text-center font-bold text-white">
              Thêm vào giỏ
            </Text>
          </Pressable>
        </View>
      ))}
    </View>
  );
}