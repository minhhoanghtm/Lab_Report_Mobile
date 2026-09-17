import React, { useState, useEffect, useCallback } from "react";
import {
  Text,
  View,
  FlatList,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  RefreshControl,
  ListRenderItem,
} from "react-native";
import { Product, ProductSearchResponse } from "../types/product";

// Hàm gọi API đúng theo yêu cầu đề bài: fetchProducts(keyword: string, limit: number)
export const fetchProducts = async (
  keyword: string,
  limit: number
): Promise<ProductSearchResponse> => {
  const url = `https://dummyjson.com/products/search?q=${encodeURIComponent(
    keyword
  )}&limit=${limit}`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Lỗi kết nối API: ${response.status} ${response.statusText}`);
  }
  const data = (await response.json()) as ProductSearchResponse;
  return data;
};

const SUGGESTED_TAGS = ["phone", "laptop", "watch", "shoes", "fragrance"];

export default function Exercise11Screen() {
  const [keyword, setKeyword] = useState<string>("phone");
  const [limit, setLimit] = useState<number>(10);
  const [products, setProducts] = useState<Product[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = useCallback(
    async (searchWord: string = keyword, searchLimit: number = limit, isRefresh: boolean = false) => {
      try {
        if (isRefresh) {
          setRefreshing(true);
        } else {
          setLoading(true);
        }
        setError(null);

        const result = await fetchProducts(searchWord, searchLimit);
        setProducts(result.products);
        setTotal(result.total);
      } catch (err) {
        const msg =
          err instanceof Error ? err.message : "Đã có lỗi không xác định xảy ra.";
        setError(msg);
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [keyword, limit]
  );

  useEffect(() => {
    handleSearch(keyword, limit);
  }, [limit]);

  const selectTag = (tag: string) => {
    setKeyword(tag);
    handleSearch(tag, limit);
  };

  const renderProductItem: ListRenderItem<Product> = ({ item }) => {
    return (
      <View className="bg-white p-3.5 mb-3 rounded-2xl border border-slate-200 shadow-xs flex-row gap-3.5 items-center">
        {/* Hình ảnh sản phẩm (Thumbnail) */}
        <View className="w-20 h-20 rounded-xl bg-slate-50 border border-slate-100 items-center justify-center overflow-hidden shrink-0">
          {item.thumbnail ? (
            <Image
              source={{ uri: item.thumbnail }}
              className="w-full h-full"
              resizeMode="contain"
            />
          ) : (
            <Text className="text-2xl">📦</Text>
          )}
        </View>

        {/* Thông tin sản phẩm */}
        <View className="flex-1 justify-between py-0.5">
          {/* Danh mục & Đánh giá sao */}
          <View className="flex-row items-center justify-between mb-1">
            <Text
              numberOfLines={1}
              className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md uppercase tracking-wider max-w-[140px]"
            >
              {item.category}
            </Text>
            <View className="flex-row items-center bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200/60">
              <Text className="text-[11px] font-bold text-amber-700">
                ★ {item.rating}
              </Text>
            </View>
          </View>

          {/* Tiêu đề sản phẩm (cho phép hiển thị 2 dòng, không bị cụt) */}
          <Text
            numberOfLines={2}
            className="text-sm font-bold text-slate-800 leading-snug mb-1"
          >
            {item.title}
          </Text>

          {/* Thương hiệu (nếu có) */}
          {item.brand ? (
            <Text className="text-[11px] text-slate-400 mb-1" numberOfLines={1}>
              Hãng: <Text className="font-semibold text-slate-600">{item.brand}</Text>
            </Text>
          ) : null}

          {/* Giá, Giảm giá và Số lượng kho */}
          <View className="flex-row items-center justify-between pt-1.5 border-t border-slate-100">
            <View className="flex-row items-baseline gap-1.5">
              <Text className="text-base font-black text-indigo-600">
                ${item.price}
              </Text>
              {item.discountPercentage > 0 && (
                <View className="bg-rose-50 px-1.5 py-0.5 rounded border border-rose-200/50">
                  <Text className="text-[10px] font-black text-rose-600">
                    -{item.discountPercentage}%
                  </Text>
                </View>
              )}
            </View>

            <Text className="text-[11px] font-medium text-slate-400">
              Kho: <Text className="text-slate-700 font-semibold">{item.stock}</Text>
            </Text>
          </View>
        </View>
      </View>
    );
  };

  return (
    <View className="flex-1 bg-slate-100">
      {/* Khối tìm kiếm & Bộ lọc tinh gọn */}
      <View className="bg-white px-4 pt-3 pb-3.5 border-b border-slate-200">
        {/* Khung nhập tìm kiếm */}
        <View className="flex-row gap-2 items-center">
          <View className="flex-1 flex-row items-center bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200">
            <Text className="text-slate-400 mr-2 text-sm">🔍</Text>
            <TextInput
              className="flex-1 text-slate-800 text-sm py-1 font-medium"
              placeholder="Nhập từ khóa (phone, laptop...)"
              placeholderTextColor="#94a3b8"
              value={keyword}
              onChangeText={setKeyword}
              onSubmitEditing={() => handleSearch(keyword, limit)}
              returnKeyType="search"
              clearButtonMode="while-editing"
            />
            {keyword.length > 0 && (
              <TouchableOpacity onPress={() => setKeyword("")} className="p-1">
                <Text className="text-slate-400 text-xs font-bold">✕</Text>
              </TouchableOpacity>
            )}
          </View>

          <TouchableOpacity
            onPress={() => handleSearch(keyword, limit)}
            disabled={loading}
            className="bg-indigo-600 active:bg-indigo-700 px-4 py-2.5 rounded-xl shadow-xs"
          >
            <Text className="text-white text-xs font-bold">Tìm kiếm</Text>
          </TouchableOpacity>
        </View>

        {/* Gợi ý từ khóa nhanh (Tag chips) */}
        <View className="flex-row items-center gap-1.5 mt-2.5">
          <Text className="text-[11px] text-slate-400 font-medium">Gợi ý:</Text>
          <View className="flex-row flex-wrap gap-1.5 flex-1">
            {SUGGESTED_TAGS.map((tag) => (
              <TouchableOpacity
                key={tag}
                onPress={() => selectTag(tag)}
                className={`px-2 py-0.5 rounded-md border ${
                  keyword.toLowerCase() === tag
                    ? "bg-indigo-50 border-indigo-200"
                    : "bg-slate-50 border-slate-200"
                }`}
              >
                <Text
                  className={`text-[11px] ${
                    keyword.toLowerCase() === tag
                      ? "text-indigo-600 font-bold"
                      : "text-slate-500"
                  }`}
                >
                  {tag}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Thanh chọn Limit & Số lượng kết quả */}
        <View className="flex-row items-center justify-between mt-3 pt-2.5 border-t border-slate-100">
          <View className="flex-row items-center gap-1.5">
            <Text className="text-xs text-slate-500 font-medium">Limit:</Text>
            {[5, 10, 20, 30].map((num) => (
              <TouchableOpacity
                key={num}
                onPress={() => setLimit(num)}
                className={`px-2.5 py-1 rounded-lg ${
                  limit === num
                    ? "bg-indigo-600 shadow-xs"
                    : "bg-slate-100 border border-slate-200/60"
                }`}
              >
                <Text
                  className={`text-xs font-bold ${
                    limit === num ? "text-white" : "text-slate-600"
                  }`}
                >
                  {num}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {!loading && !error && (
            <Text className="text-xs text-slate-500 font-medium">
              Đang hiện: <Text className="font-bold text-indigo-600">{products.length}</Text>/{total}
            </Text>
          )}
        </View>
      </View>

      {/* Danh sách kết quả */}
      {loading ? (
        <View className="flex-1 justify-center items-center p-6">
          <ActivityIndicator size="large" color="#4f46e5" />
          <Text className="text-slate-500 mt-3 text-sm font-medium">
            Đang tìm kiếm sản phẩm...
          </Text>
        </View>
      ) : error ? (
        <View className="flex-1 justify-center items-center p-6">
          <View className="bg-rose-50 p-5 rounded-2xl border border-rose-200 items-center max-w-sm w-full">
            <Text className="text-rose-600 font-bold mb-1">Lỗi tìm kiếm</Text>
            <Text className="text-slate-600 text-xs text-center mb-3">
              {error}
            </Text>
            <TouchableOpacity
              onPress={() => handleSearch(keyword, limit)}
              className="bg-rose-600 px-4 py-2 rounded-xl"
            >
              <Text className="text-white font-semibold text-xs">Thử lại</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <FlatList
          data={products}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderProductItem}
          contentContainerStyle={{ padding: 14, paddingBottom: 28 }}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => handleSearch(keyword, limit, true)}
              colors={["#4f46e5"]}
              tintColor="#4f46e5"
            />
          }
          ListEmptyComponent={
            <View className="py-20 items-center">
              <Text className="text-3xl mb-2">🔍</Text>
              <Text className="text-slate-700 font-bold text-base">
                Không tìm thấy sản phẩm
              </Text>
              <Text className="text-slate-400 text-xs mt-1">
                Không có sản phẩm nào phù hợp với từ khóa "{keyword}".
              </Text>
            </View>
          }
        />
      )}
    </View>
  );
}
