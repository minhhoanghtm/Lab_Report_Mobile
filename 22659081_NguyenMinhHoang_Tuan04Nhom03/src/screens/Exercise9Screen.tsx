import React, { useEffect, useState, useMemo } from "react";
import {
  Text,
  View,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  TextInput,
  RefreshControl,
  ListRenderItem,
} from "react-native";
import { Post } from "../types/post";

type FilterType = "all" | "completed" | "pending";

export default function Exercise9Screen() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [filter, setFilter] = useState<FilterType>("all");

  const fetchPosts = async (isRefresh: boolean = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      setError(null);

      const response = await fetch(
        "https://jsonplaceholder.typicode.com/todos"
      );

      if (!response.ok) {
        throw new Error(`Lỗi tải dữ liệu: ${response.status} ${response.statusText}`);
      }

      // Ép kiểu kết quả từ API thành Post[] theo đúng yêu cầu đề bài
      const data = (await response.json()) as Post[];
      setPosts(data);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Đã có lỗi không xác định xảy ra.";
      setError(message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const filteredPosts = useMemo(() => {
    return posts.filter((item) => {
      const matchesSearch = item.title
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      if (!matchesSearch) return false;

      if (filter === "completed") return item.completed;
      if (filter === "pending") return !item.completed;
      return true;
    });
  }, [posts, searchQuery, filter]);

  const renderItem: ListRenderItem<Post> = ({ item }) => {
    return (
      <View className="bg-white p-4 mb-3 rounded-2xl border border-slate-200 shadow-sm">
        <View className="flex-row items-center justify-between mb-2">
          <View className="bg-indigo-50 px-2.5 py-0.5 rounded-md border border-indigo-100">
            <Text className="text-xs font-bold text-indigo-600">
              Bài viết #{item.id}
            </Text>
          </View>

          <View
            className={`px-2.5 py-0.5 rounded-full ${
              item.completed ? "bg-emerald-100" : "bg-amber-100"
            }`}
          >
            <Text
              className={`text-xs font-semibold ${
                item.completed ? "text-emerald-700" : "text-amber-700"
              }`}
            >
              {item.completed ? "✓ Hoàn thành" : "⏳ Đang xử lý"}
            </Text>
          </View>
        </View>

        <Text className="text-base font-medium text-slate-800 leading-6 capitalize">
          {item.title}
        </Text>

        <View className="mt-3 pt-2 border-t border-slate-100 flex-row justify-between items-center">
          <Text className="text-xs text-slate-400">
            Tác giả: User #{item.userId}
          </Text>
          <Text className="text-xs text-indigo-500 font-medium">Chi tiết →</Text>
        </View>
      </View>
    );
  };

  return (
    <View className="flex-1 bg-slate-100">
      {/* Search & Filter Bar */}
      <View className="bg-white px-5 pt-3 pb-3 border-b border-slate-200">
        <TextInput
          className="bg-slate-100 px-4 py-2.5 rounded-xl text-slate-800 text-sm border border-slate-200"
          placeholder="🔍 Tìm kiếm bài viết theo tiêu đề..."
          placeholderTextColor="#94a3b8"
          value={searchQuery}
          onChangeText={setSearchQuery}
          clearButtonMode="while-editing"
        />

        <View className="flex-row gap-2 mt-3">
          <TouchableOpacity
            onPress={() => setFilter("all")}
            className={`px-3 py-1.5 rounded-lg ${
              filter === "all" ? "bg-indigo-600" : "bg-slate-100"
            }`}
          >
            <Text
              className={`text-xs font-semibold ${
                filter === "all" ? "text-white" : "text-slate-600"
              }`}
            >
              Tất cả ({posts.length})
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setFilter("completed")}
            className={`px-3 py-1.5 rounded-lg ${
              filter === "completed" ? "bg-emerald-600" : "bg-slate-100"
            }`}
          >
            <Text
              className={`text-xs font-semibold ${
                filter === "completed" ? "text-white" : "text-slate-600"
              }`}
            >
              Đã xong
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setFilter("pending")}
            className={`px-3 py-1.5 rounded-lg ${
              filter === "pending" ? "bg-amber-600" : "bg-slate-100"
            }`}
          >
            <Text
              className={`text-xs font-semibold ${
                filter === "pending" ? "text-white" : "text-slate-600"
              }`}
            >
              Chưa xong
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Content */}
      {loading ? (
        <View className="flex-1 justify-center items-center p-6">
          <ActivityIndicator size="large" color="#4f46e5" />
          <Text className="text-slate-500 mt-4 text-sm font-medium">
            Đang tải danh sách bài viết từ JSONPlaceholder...
          </Text>
        </View>
      ) : error ? (
        <View className="flex-1 justify-center items-center p-6">
          <View className="bg-rose-50 p-6 rounded-2xl border border-rose-200 items-center w-full max-w-sm">
            <Text className="text-rose-600 font-bold text-base mb-1">
              Lỗi tải bài viết
            </Text>
            <Text className="text-slate-600 text-sm text-center mb-4">
              {error}
            </Text>
            <TouchableOpacity
              onPress={() => fetchPosts()}
              className="bg-rose-600 px-5 py-2.5 rounded-xl shadow-sm"
            >
              <Text className="text-white font-semibold text-sm">Thử lại</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <FlatList
          data={filteredPosts}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={{ padding: 16 }}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => fetchPosts(true)}
              colors={["#4f46e5"]}
              tintColor="#4f46e5"
            />
          }
          ListEmptyComponent={
            <View className="py-16 items-center">
              <Text className="text-slate-400 text-base font-medium">
                Không tìm thấy bài viết nào phù hợp.
              </Text>
            </View>
          }
        />
      )}
    </View>
  );
}
