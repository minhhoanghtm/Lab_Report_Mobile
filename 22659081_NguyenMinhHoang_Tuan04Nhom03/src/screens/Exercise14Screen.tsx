import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  Text,
  View,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  RefreshControl,
  ListRenderItem,
} from "react-native";
import { ApiResponse } from "../types/api";
import { Product } from "../types/product";

// 1. Áp dụng Generic Interface ApiResponse<Product> cho hàm gọi API phân trang
export const fetchProductsPaginated = async (
  page: number = 1,
  limit: number = 5
): Promise<ApiResponse<Product>> => {
  const skip = (page - 1) * limit;
  const url = `https://dummyjson.com/products?limit=${limit}&skip=${skip}`;

  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Lỗi tải dữ liệu phân trang: ${res.status}`);
  }

  const json = await res.json();

  // Trả về đúng định dạng cấu trúc ApiResponse<T>
  const apiResponse: ApiResponse<Product> = {
    data: json.products as Product[],
    total: json.total,
    page: page,
  };

  return apiResponse;
};

export default function Exercise14Screen() {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(5);
  // State lưu trữ dữ liệu với kiểu Generic ApiResponse<Product>
  const [apiResponse, setApiResponse] = useState<ApiResponse<Product> | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const flatListRef = useRef<FlatList>(null);

  const loadData = useCallback(
    async (pageToLoad: number, pageSize: number, isRefresh: boolean = false) => {
      try {
        if (isRefresh) {
          setRefreshing(true);
        } else {
          setLoading(true);
        }
        setError(null);

        // Gọi hàm và nhận kết quả kiểu ApiResponse<Product>
        const res: ApiResponse<Product> = await fetchProductsPaginated(
          pageToLoad,
          pageSize
        );
        setApiResponse(res);

        // Cuộn lên đầu danh sách mỗi khi chuyển trang
        flatListRef.current?.scrollToOffset({ offset: 0, animated: true });
      } catch (err) {
        const msg =
          err instanceof Error ? err.message : "Đã có lỗi không xác định xảy ra.";
        setError(msg);
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    []
  );

  useEffect(() => {
    loadData(currentPage, limit);
  }, [currentPage, limit, loadData]);

  const totalPages = apiResponse ? Math.ceil(apiResponse.total / limit) : 1;

  const goToPage = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages && newPage !== currentPage) {
      setCurrentPage(newPage);
    }
  };

  const renderProductItem: ListRenderItem<Product> = ({ item }) => (
    <View className="bg-white p-3.5 mb-3 rounded-2xl border border-slate-200 shadow-xs flex-row gap-3.5 items-center">
      {/* Ảnh thumbnail */}
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
        <View className="flex-row items-center justify-between mb-1">
          <Text
            numberOfLines={1}
            className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md uppercase tracking-wider max-w-[140px]"
          >
            {item.category}
          </Text>
          <View className="flex-row items-center bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200/60">
            <Text className="text-[10px] font-bold text-amber-700">
              ★ {item.rating}
            </Text>
          </View>
        </View>

        <Text
          numberOfLines={2}
          className="text-sm font-bold text-slate-800 leading-snug mb-1"
        >
          {item.title}
        </Text>

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

  return (
    <View className="flex-1 bg-slate-100">
      {/* Khối hiển thị cấu trúc ApiResponse<T> & Tùy chọn Limit */}
      <View className="bg-white px-4 pt-3 pb-3 border-b border-slate-200">
        {/* Banner code Generic Interface */}
        {/* <View className="bg-slate-900 px-3 py-2 rounded-xl mb-3 border border-slate-800">
          <Text className="text-[10px] text-slate-400 font-mono">
            // Generic Interface ApiResponse&lt;T&gt;:
          </Text>
          <Text className="text-xs text-indigo-300 font-mono font-bold mt-0.5">
            interface ApiResponse&lt;T&gt; &#123; data: T[]; total: number; page: number &#125;
          </Text>
        </View> */}

        {/* Thanh trạng thái phân trang & Chọn số sản phẩm/trang */}
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center gap-1.5">
            <Text className="text-xs text-slate-500 font-medium">Mỗi trang:</Text>
            {[5, 8, 10].map((size) => (
              <TouchableOpacity
                key={size}
                onPress={() => {
                  setLimit(size);
                  setCurrentPage(1); // Reset về trang 1 khi đổi limit
                }}
                className={`px-2.5 py-1 rounded-lg border ${
                  limit === size
                    ? "bg-indigo-600 border-indigo-600 shadow-xs"
                    : "bg-slate-100 border-slate-200/60"
                }`}
              >
                <Text
                  className={`text-xs font-bold ${
                    limit === size ? "text-white" : "text-slate-600"
                  }`}
                >
                  {size}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {apiResponse && (
            <View className="items-end">
              <Text className="text-xs text-slate-600 font-medium">
                Tổng cộng: <Text className="font-bold text-indigo-600">{apiResponse.total}</Text> SP
              </Text>
              <Text className="text-[11px] text-slate-400">
                ({totalPages} trang)
              </Text>
            </View>
          )}
        </View>
      </View>

      {/* Danh sách dữ liệu ApiResponse.data */}
      <View className="flex-1 px-3.5 pt-3">
        {loading && !refreshing ? (
          <View className="flex-1 justify-center items-center">
            <ActivityIndicator size="large" color="#4f46e5" />
            <Text className="text-slate-500 text-xs font-medium mt-3">
              Đang tải dữ liệu trang {currentPage}...
            </Text>
          </View>
        ) : error ? (
          <View className="flex-1 justify-center items-center p-6">
            <View className="bg-rose-50 p-5 rounded-2xl border border-rose-200 items-center max-w-sm w-full">
              <Text className="text-rose-600 font-bold mb-1">Lỗi tải dữ liệu</Text>
              <Text className="text-slate-600 text-xs text-center mb-3">
                {error}
              </Text>
              <TouchableOpacity
                onPress={() => loadData(currentPage, limit)}
                className="bg-rose-600 px-4 py-2 rounded-xl"
              >
                <Text className="text-white font-semibold text-xs">Thử lại</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <FlatList
            ref={flatListRef}
            data={apiResponse?.data || []}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderProductItem}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={() => loadData(currentPage, limit, true)}
                colors={["#4f46e5"]}
                tintColor="#4f46e5"
              />
            }
          />
        )}
      </View>

      {/* Thanh điều hướng phân trang (Pagination Footer Bar) */}
      <View className="bg-white px-4 py-3 border-t border-slate-200 flex-row items-center justify-between">
        {/* Nút Trang trước */}
        <TouchableOpacity
          onPress={() => goToPage(currentPage - 1)}
          disabled={currentPage <= 1 || loading}
          className={`px-3.5 py-2 rounded-xl border flex-row items-center gap-1 ${
            currentPage <= 1 || loading
              ? "bg-slate-100 border-slate-200 opacity-50"
              : "bg-white border-slate-300 active:bg-slate-50"
          }`}
        >
          <Text className="text-xs font-bold text-slate-700">‹ Trước</Text>
        </TouchableOpacity>

        {/* Hiển thị số trang hiện tại / Tổng số trang */}
        <View className="flex-row items-center gap-1">
          <View className="bg-indigo-50 px-2.5 py-1 rounded-lg border border-indigo-200">
            <Text className="text-xs font-bold text-indigo-600">
              Trang {currentPage}
            </Text>
          </View>
          <Text className="text-xs text-slate-400 font-medium">/</Text>
          <Text className="text-xs text-slate-500 font-semibold">{totalPages}</Text>
        </View>

        {/* Nút Trang sau */}
        <TouchableOpacity
          onPress={() => goToPage(currentPage + 1)}
          disabled={currentPage >= totalPages || loading}
          className={`px-3.5 py-2 rounded-xl border flex-row items-center gap-1 ${
            currentPage >= totalPages || loading
              ? "bg-slate-100 border-slate-200 opacity-50"
              : "bg-white border-slate-300 active:bg-slate-50"
          }`}
        >
          <Text className="text-xs font-bold text-slate-700">Sau ›</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
