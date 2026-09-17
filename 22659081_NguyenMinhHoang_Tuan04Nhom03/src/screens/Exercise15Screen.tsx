import React, { useState, useEffect, useCallback } from "react";
import {
  Text,
  View,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  ListRenderItem,
} from "react-native";

export interface Article {
  id: number;
  title: string;
  body: string;
  views: number;
  updatedAt: string;
}

export default function Exercise15Screen() {
  const [items, setItems] = useState<Article[]>([]);
  // 1. Phân tách và đồng bộ 2 trạng thái: loading ban đầu và refreshing khi kéo
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [refreshCount, setRefreshCount] = useState<number>(0);
  const [lastUpdated, setLastUpdated] = useState<string>("");

  // Hàm gọi API lấy dữ liệu và đồng bộ trạng thái loading/refreshing
  const fetchArticles = useCallback(async (isPullToRefresh: boolean = false) => {
    try {
      if (isPullToRefresh) {
        // Khi kéo để tải lại: CHỈ bật refreshing, giữ nguyên giao diện danh sách
        setRefreshing(true);
      } else {
        // Khi mở màn hình lần đầu: bật loading toàn màn hình
        setLoading(true);
      }

      const response = await fetch(
        "https://jsonplaceholder.typicode.com/posts?_limit=8"
      );

      if (!response.ok) {
        throw new Error(`Lỗi tải dữ liệu: ${response.status}`);
      }

      const rawData = await response.json();

      // Bổ sung dữ liệu mô phỏng thời gian thực để người dùng thấy rõ dữ liệu được làm mới
      const formattedData: Article[] = rawData.map((post: any) => ({
        id: post.id,
        title: post.title,
        body: post.body,
        views: Math.floor(Math.random() * 500) + 50,
        updatedAt: new Date().toLocaleTimeString(),
      }));

      setItems(formattedData);
      setLastUpdated(new Date().toLocaleTimeString());

      if (isPullToRefresh) {
        setRefreshCount((prev) => prev + 1);
      }
    } catch (error) {
      console.error("Lỗi fetch articles:", error);
    } finally {
      // ĐỒNG BỘ: Tắt cả loading và refreshing khi kết thúc request
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchArticles(false);
  }, [fetchArticles]);

  const onRefresh = () => {
    fetchArticles(true);
  };

  const renderArticleItem: ListRenderItem<Article> = ({ item }) => (
    <View className="bg-white p-4 mb-3 rounded-2xl border border-slate-200 shadow-xs">
      <View className="flex-row items-center justify-between mb-2">
        <View className="bg-indigo-50 px-2.5 py-0.5 rounded-md border border-indigo-100">
          <Text className="text-[11px] font-bold text-indigo-600">
            Bản tin #{item.id}
          </Text>
        </View>

        <View className="flex-row items-center gap-2">
          <Text className="text-[11px] text-slate-400">
            👀 {item.views} lượt xem
          </Text>
          <Text className="text-[10px] font-mono text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">
            {item.updatedAt}
          </Text>
        </View>
      </View>

      <Text
        numberOfLines={2}
        className="text-sm font-bold text-slate-800 leading-snug mb-1 capitalize"
      >
        {item.title}
      </Text>

      <Text numberOfLines={2} className="text-xs text-slate-500 leading-relaxed">
        {item.body}
      </Text>
    </View>
  );

  return (
    <View className="flex-1 bg-slate-100">
      {/* Khối giải thích & Bảng trạng thái đồng bộ */}
      <View className="bg-white px-4 pt-3 pb-3.5 border-b border-slate-200">
        {/* Thẻ hiển thị cơ chế đồng bộ */}
        {/* <View className="bg-slate-900 px-3.5 py-2.5 rounded-xl mb-3 border border-slate-800">
          <Text className="text-[10px] text-slate-400 font-mono">
            // Trạng thái đồng bộ (State Synchronization):
          </Text>
          <View className="flex-row items-center gap-4 mt-1.5">
            <View className="flex-row items-center gap-1.5">
              <View
                className={`w-2 h-2 rounded-full ${
                  loading ? "bg-amber-400 animate-pulse" : "bg-slate-600"
                }`}
              />
              <Text className="text-xs font-mono text-slate-300">
                loading: <Text className="font-bold text-white">{String(loading)}</Text>
              </Text>
            </View>

            <View className="flex-row items-center gap-1.5">
              <View
                className={`w-2 h-2 rounded-full ${
                  refreshing ? "bg-emerald-400 animate-pulse" : "bg-slate-600"
                }`}
              />
              <Text className="text-xs font-mono text-slate-300">
                refreshing: <Text className="font-bold text-white">{String(refreshing)}</Text>
              </Text>
            </View>
          </View>
        </View> */}

        {/* Thanh thông số & Nút kích hoạt làm mới */}
        <View className="flex-row items-center justify-between">
          <View>
            <Text className="text-xs text-slate-600 font-medium">
              Đã làm mới: <Text className="font-bold text-indigo-600">{refreshCount}</Text> lần
            </Text>
            {lastUpdated ? (
              <Text className="text-[11px] text-slate-400 mt-0.5">
                Cập nhật lúc: {lastUpdated}
              </Text>
            ) : null}
          </View>

          {/* Nút bấm kiểm thử làm mới (tiện lợi khi test trên trình duyệt máy tính) */}
          <TouchableOpacity
            onPress={onRefresh}
            disabled={refreshing || loading}
            className={`px-3 py-1.5 rounded-xl flex-row items-center gap-1.5 shadow-xs ${
              refreshing || loading
                ? "bg-indigo-300"
                : "bg-indigo-600 active:bg-indigo-700"
            }`}
          >
            {refreshing ? (
              <ActivityIndicator size="small" color="#ffffff" />
            ) : (
              <Text className="text-white text-xs font-bold">🔄 Kéo / Tải lại</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>

      {/* Danh sách dữ liệu chính */}
      <View className="flex-1 px-3.5 pt-3">
        {/* Trạng thái loading lần đầu: hiển thị xoay tròn toàn màn hình */}
        {loading && !refreshing ? (
          <View className="flex-1 justify-center items-center">
            <ActivityIndicator size="large" color="#4f46e5" />
            <Text className="text-slate-500 text-xs font-medium mt-3">
              Đang tải danh sách lần đầu (loading = true)...
            </Text>
          </View>
        ) : (
          /* Trạng thái danh sách kết hợp pull-to-refresh qua FlatList */
          <FlatList
            data={items}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderArticleItem}
            showsVerticalScrollIndicator={false}
            // Tích hợp RefreshControl chuẩn theo yêu cầu đề bài
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                colors={["#4f46e5"]} // Android
                tintColor="#4f46e5" // iOS
                title="Đang cập nhật tin tức mới..." // iOS
                titleColor="#4f46e5"
              />
            }
            ListHeaderComponent={
              <View className="bg-indigo-50/70 p-2.5 rounded-xl border border-indigo-100/80 mb-3 items-center">
                <Text className="text-[11px] text-indigo-700 font-medium">
                  ⬇️ Vuốt danh sách xuống để kích hoạt Pull-to-Refresh
                </Text>
              </View>
            }
          />
        )}
      </View>
    </View>
  );
}
