import React, { useState } from "react";
import {
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { User } from "../types/user";

export default function Exercise10Screen() {
  // 1. Dùng kiểu User | null theo đúng yêu cầu đề bài
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Hàm gọi API lấy chi tiết user 1
  const fetchUser = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(
        "https://jsonplaceholder.typicode.com/users/1"
      );

      if (!response.ok) {
        throw new Error(`Lỗi tải dữ liệu: ${response.status}`);
      }

      const data = (await response.json()) as User;
      setUser(data);
    } catch (err) {
      const msg =
        err instanceof Error ? err.message : "Đã có lỗi không xác định xảy ra.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  // Hàm xóa dữ liệu về null để kiểm tra trạng thái màn hình trống
  const resetUser = () => {
    setUser(null);
    setError(null);
  };

  return (
    <View className="flex-1 bg-slate-100">
      {/* Control Bar để test 2 trạng thái: Có dữ liệu và Màn hình trống */}
      <View className="bg-white p-4 border-b border-slate-200 flex-row gap-3 items-center justify-between">
        <View className="flex-1">
          <Text className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Trạng thái hiện tại:
          </Text>
          <Text className="text-sm font-semibold text-slate-800">
            {loading
              ? "Đang tải..."
              : user
              ? "✓ Đã có dữ liệu (User #1)"
              : "∅ Chưa có dữ liệu (Màn hình trống)"}
          </Text>
        </View>

        <View className="flex-row gap-2">
          <TouchableOpacity
            onPress={fetchUser}
            disabled={loading}
            className="bg-indigo-600 active:bg-indigo-700 px-4 py-2 rounded-xl shadow-sm"
          >
            <Text className="text-white text-xs font-bold">
              {loading ? "Đang tải..." : "Tải User #1"}
            </Text>
          </TouchableOpacity>

          {user && (
            <TouchableOpacity
              onPress={resetUser}
              className="bg-slate-200 active:bg-slate-300 px-3 py-2 rounded-xl"
            >
              <Text className="text-slate-700 text-xs font-semibold">Xóa về rỗng</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* 2. Khi chưa có dữ liệu thì hiện màn hình trống; có dữ liệu thì đổ vào UI */}
      {loading ? (
        <View className="flex-1 justify-center items-center p-6">
          <ActivityIndicator size="large" color="#4f46e5" />
          <Text className="text-slate-500 mt-3 text-sm">
            Đang gọi API https://jsonplaceholder.typicode.com/users/1...
          </Text>
        </View>
      ) : error ? (
        <View className="flex-1 justify-center items-center p-6">
          <View className="bg-rose-50 p-5 rounded-2xl border border-rose-200 items-center max-w-sm w-full">
            <Text className="text-rose-600 font-bold mb-1">Lỗi khi tải User</Text>
            <Text className="text-slate-600 text-xs text-center mb-3">
              {error}
            </Text>
            <TouchableOpacity
              onPress={fetchUser}
              className="bg-rose-600 px-4 py-2 rounded-xl"
            >
              <Text className="text-white font-semibold text-xs">Thử lại</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : user === null ? (
        /* Màn hình trống hoàn toàn khi chưa có dữ liệu */
        <View className="flex-1 justify-center items-center p-6">
          <View className="w-16 h-16 rounded-full bg-slate-200 items-center justify-center mb-3">
            <Text className="text-2xl text-slate-400">👤</Text>
          </View>
          <Text className="text-slate-600 font-bold text-base">
            Màn hình trống (Chưa có dữ liệu)
          </Text>
          <Text className="text-slate-400 text-xs text-center mt-1 mb-4 max-w-xs">
            Kiểu dữ liệu hiện tại là null. Bấm nút bên dưới để fetch dữ liệu từ API.
          </Text>
          <TouchableOpacity
            onPress={fetchUser}
            className="bg-indigo-600 active:bg-indigo-700 px-5 py-2.5 rounded-xl shadow-sm"
          >
            <Text className="text-white font-semibold text-sm">
              📥 Gọi API lấy User #1
            </Text>
          </TouchableOpacity>
        </View>
      ) : (
        /* Đổ dữ liệu vào UI sử dụng Optional Chaining (user?.prop) */
        <ScrollView contentContainerStyle={{ padding: 16 }}>
          {/* Avatar & Tên chính */}
          <View className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm items-center mb-4">
            <View className="w-20 h-20 rounded-full bg-indigo-100 border-2 border-indigo-200 items-center justify-center mb-3">
              <Text className="text-2xl font-black text-indigo-700">
                {user?.name?.charAt(0)}
              </Text>
            </View>

            {/* Optional Chaining: user?.name */}
            <Text className="text-xl font-bold text-slate-900 text-center">
              {user?.name}
            </Text>

            {/* Optional Chaining: user?.username */}
            <Text className="text-xs font-semibold text-indigo-600 mt-0.5">
              @{user?.username}
            </Text>

            {/* Badge User ID */}
            <View className="mt-2 bg-slate-100 px-3 py-0.5 rounded-full">
              <Text className="text-[11px] font-medium text-slate-500">
                User ID: #{user?.id}
              </Text>
            </View>
          </View>

          {/* Thông tin liên hệ */}
          <View className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm mb-4">
            <Text className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
              Thông tin liên hệ
            </Text>

            <View className="gap-3">
              {/* Optional Chaining: user?.email */}
              <View className="flex-row items-center justify-between py-1 border-b border-slate-100">
                <Text className="text-xs text-slate-500 font-medium">Email</Text>
                <Text className="text-sm font-semibold text-slate-800">
                  {user?.email}
                </Text>
              </View>

              {/* Optional Chaining: user?.phone */}
              <View className="flex-row items-center justify-between py-1 border-b border-slate-100">
                <Text className="text-xs text-slate-500 font-medium">Số điện thoại</Text>
                <Text className="text-sm font-semibold text-slate-800">
                  {user?.phone}
                </Text>
              </View>

              {/* Optional Chaining: user?.website */}
              <View className="flex-row items-center justify-between py-1">
                <Text className="text-xs text-slate-500 font-medium">Website</Text>
                <Text className="text-sm font-semibold text-indigo-600">
                  {user?.website}
                </Text>
              </View>
            </View>
          </View>

          {/* Địa chỉ (Address) - Optional Chaining 2 cấp: user?.address?.street */}
          <View className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm mb-4">
            <Text className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
              Địa chỉ cư trú
            </Text>

            <View className="gap-3">
              <View className="flex-row items-center justify-between py-1 border-b border-slate-100">
                <Text className="text-xs text-slate-500 font-medium">Đường & Suite</Text>
                <Text className="text-sm font-semibold text-slate-800">
                  {user?.address?.street}, {user?.address?.suite}
                </Text>
              </View>

              <View className="flex-row items-center justify-between py-1 border-b border-slate-100">
                <Text className="text-xs text-slate-500 font-medium">Thành phố</Text>
                <Text className="text-sm font-semibold text-slate-800">
                  {user?.address?.city}
                </Text>
              </View>

              <View className="flex-row items-center justify-between py-1 border-b border-slate-100">
                <Text className="text-xs text-slate-500 font-medium">Mã bưu chính</Text>
                <Text className="text-sm font-semibold text-slate-800">
                  {user?.address?.zipcode}
                </Text>
              </View>

              <View className="flex-row items-center justify-between py-1">
                <Text className="text-xs text-slate-500 font-medium">Tọa độ Geo</Text>
                <Text className="text-xs text-slate-600 font-mono">
                  {user?.address?.geo?.lat}, {user?.address?.geo?.lng}
                </Text>
              </View>
            </View>
          </View>

          {/* Công ty (Company) - Optional Chaining: user?.company?.name */}
          <View className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm mb-6">
            <Text className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
              Thông tin công ty
            </Text>

            <View className="gap-3">
              <View className="flex-row items-center justify-between py-1 border-b border-slate-100">
                <Text className="text-xs text-slate-500 font-medium">Tên công ty</Text>
                <Text className="text-sm font-semibold text-slate-800">
                  {user?.company?.name}
                </Text>
              </View>

              <View className="py-1 border-b border-slate-100">
                <Text className="text-xs text-slate-500 font-medium mb-1">Khẩu hiệu (Catchphrase)</Text>
                <Text className="text-xs italic text-slate-700">
                  "{user?.company?.catchPhrase}"
                </Text>
              </View>

              <View className="py-1">
                <Text className="text-xs text-slate-500 font-medium mb-1">Lĩnh vực hoạt động</Text>
                <Text className="text-xs text-slate-600">
                  {user?.company?.bs}
                </Text>
              </View>
            </View>
          </View>
        </ScrollView>
      )}
    </View>
  );
}
