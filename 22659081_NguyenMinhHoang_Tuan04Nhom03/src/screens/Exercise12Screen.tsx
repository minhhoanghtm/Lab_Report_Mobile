import React, { useState } from "react";
import {
  Text,
  View,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  ScrollView,
  Platform,
} from "react-native";
import { CustomError } from "../types/error";

export default function Exercise12Screen() {
  const [loading, setLoading] = useState<boolean>(false);
  const [lastError, setLastError] = useState<CustomError | null>(null);
  const [successData, setSuccessData] = useState<any>(null);

  // Hàm gọi API cố tình gây lỗi hoặc gọi đúng để đối chứng
  const makeApiRequest = async (targetUrl: string, errorType: "404" | "network" | "valid") => {
    try {
      setLoading(true);
      setLastError(null);
      setSuccessData(null);

      const response = await fetch(targetUrl);

      // Nếu mã trạng thái HTTP không thành công (vd: 404, 500) -> ném lỗi
      if (!response.ok) {
        const errorObj: CustomError = {
          name: "HttpNotFoundError",
          message: `Không tìm thấy tài nguyên trên server (Mã lỗi: ${response.status} ${response.statusText}).`,
          statusCode: response.status,
          url: targetUrl,
          timestamp: new Date().toLocaleTimeString(),
        };
        throw errorObj;
      }

      const data = await response.json();
      setSuccessData(data);

      Alert.alert(
        "Thành công",
        `Đã tải dữ liệu thành công từ: ${targetUrl}`
      );
    } catch (error) {
      // 1. Ép kiểu lỗi về cấu trúc CustomError theo đúng yêu cầu đề bài
      let customError: CustomError;

      if (error && typeof error === "object" && "name" in error && "message" in error) {
        // Trường hợp error đã mang cấu trúc mong muốn
        customError = error as CustomError;
      } else {
        // Trường hợp lỗi mạng do sai domain (Fetch TypeError)
        const err = error as Error;
        customError = {
          name: err?.name || "NetworkError",
          message: err?.message || "Không thể kết nối đến máy chủ do sai URL hoặc mất mạng.",
          statusCode: 0,
          url: targetUrl,
          timestamp: new Date().toLocaleTimeString(),
        } as CustomError;
      }

      // Lưu state để hiển thị trực quan lên giao diện
      setLastError(customError);

      // 2. Hiện thông báo lên Alert theo đúng yêu cầu đề bài
      const alertTitle = `⚠️ ${customError.name}`;
      const alertMessage = `${customError.message}\n\n• Mã lỗi: ${
        customError.statusCode ?? "N/A"
      }\n• URL: ${customError.url}\n• Thời gian: ${customError.timestamp || "N/A"}`;

      Alert.alert(alertTitle, alertMessage, [{ text: "Đã hiểu", style: "default" }]);

      // Đảm bảo tương thích Alert trên React Native Web
      if (Platform.OS === "web" && typeof window !== "undefined") {
        window.alert(`${alertTitle}\n\n${alertMessage}`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView className="flex-1 bg-slate-100" contentContainerStyle={{ padding: 16 }}>
      {/* Thẻ hướng dẫn & Mục tiêu bài tập */}
      {/* <View className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs mb-4">
        <View className="flex-row items-center gap-2 mb-2">
          <View className="bg-rose-50 px-2.5 py-0.5 rounded-md border border-rose-100">
            <Text className="text-xs font-bold text-rose-600 uppercase">
              Yêu cầu đề bài
            </Text>
          </View>
          <Text className="text-xs text-slate-500 font-medium">
            try...catch • CustomError • Alert
          </Text>
        </View>

        <Text className="text-sm text-slate-700 leading-5">
          Tạo request cố tình làm lỗi bằng cách truyền URL sai. Lỗi sẽ được bắt trong khối{" "}
          <Text className="font-mono text-indigo-600 font-bold">catch</Text>, ép kiểu sang{" "}
          <Text className="font-mono text-indigo-600 font-bold">CustomError</Text> và hiển thị qua{" "}
          <Text className="font-mono text-indigo-600 font-bold">Alert</Text>.
        </Text>
      </View> */}

      {/* Danh sách các nút kích hoạt thử nghiệm */}
      <View className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs mb-4">
        <Text className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
          Chọn kịch bản kiểm thử API
        </Text>

        <View className="gap-3">
          {/* Nút 1: Sai Endpoint (Lỗi 404 Not Found) */}
          <TouchableOpacity
            onPress={() =>
              makeApiRequest(
                "https://jsonplaceholder.typicode.com/sai-duong-dan-404-endpoint",
                "404"
              )
            }
            disabled={loading}
            className="bg-rose-600 active:bg-rose-700 p-4 rounded-2xl shadow-xs"
          >
            <View className="flex-row justify-between items-center">
              <View className="flex-1 pr-2">
                <Text className="text-white font-bold text-sm">
                  1. Cố tình lỗi 404 (Sai đường dẫn)
                </Text>
                <Text className="text-rose-100 text-xs mt-0.5 font-mono" numberOfLines={1}>
                  /sai-duong-dan-404-endpoint
                </Text>
              </View>
              <Text className="text-white text-lg">➔</Text>
            </View>
          </TouchableOpacity>

          {/* Nút 2: Sai Domain (Lỗi Network / Không tồn tại domain) */}
          <TouchableOpacity
            onPress={() =>
              makeApiRequest(
                "https://sai-ten-mien-khong-ton-tai-12345.xyz/api/data",
                "network"
              )
            }
            disabled={loading}
            className="bg-amber-600 active:bg-amber-700 p-4 rounded-2xl shadow-xs"
          >
            <View className="flex-row justify-between items-center">
              <View className="flex-1 pr-2">
                <Text className="text-white font-bold text-sm">
                  2. Cố tình lỗi mạng (Sai tên miền)
                </Text>
                <Text className="text-amber-100 text-xs mt-0.5 font-mono" numberOfLines={1}>
                  https://sai-ten-mien-khong-ton-tai-12345.xyz/...
                </Text>
              </View>
              <Text className="text-white text-lg">➔</Text>
            </View>
          </TouchableOpacity>

          {/* Nút 3: Đường dẫn đúng (Để đối chứng) */}
          <TouchableOpacity
            onPress={() =>
              makeApiRequest(
                "https://jsonplaceholder.typicode.com/todos/1",
                "valid"
              )
            }
            disabled={loading}
            className="bg-emerald-600 active:bg-emerald-700 p-4 rounded-2xl shadow-xs"
          >
            <View className="flex-row justify-between items-center">
              <View className="flex-1 pr-2">
                <Text className="text-white font-bold text-sm">
                  3. Đường dẫn đúng (Thành công)
                </Text>
                <Text className="text-emerald-100 text-xs mt-0.5 font-mono" numberOfLines={1}>
                  https://jsonplaceholder.typicode.com/todos/1
                </Text>
              </View>
              <Text className="text-white text-lg">➔</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>

      {/* Trạng thái đang tải */}
      {loading && (
        <View className="bg-white p-6 rounded-3xl border border-slate-200 items-center justify-center my-2">
          <ActivityIndicator size="large" color="#e11d48" />
          <Text className="text-slate-600 font-medium text-xs mt-3">
            Đang gửi request và bắt lỗi...
          </Text>
        </View>
      )}

      {/* Hiển thị chi tiết CustomError đã bắt được */}
      {lastError && !loading && (
        <View className="bg-rose-50 p-5 rounded-3xl border border-rose-200 shadow-xs mb-4">
          <View className="flex-row items-center justify-between mb-3">
            <View className="bg-rose-600 px-2.5 py-0.5 rounded-full">
              <Text className="text-white text-[11px] font-bold">
                ĐÃ BẮT ĐƯỢC LỖI (CATCH)
              </Text>
            </View>
            <Text className="text-[11px] text-rose-500 font-medium">
              {lastError.timestamp}
            </Text>
          </View>

          <Text className="text-base font-black text-rose-800 mb-1">
            {lastError.name}
          </Text>

          <Text className="text-sm text-rose-700 mb-3 leading-5">
            {lastError.message}
          </Text>

          {/* Chi tiết các trường của CustomError */}
          <View className="bg-white/80 p-3.5 rounded-2xl border border-rose-100 gap-2">
            <View className="flex-row justify-between">
              <Text className="text-xs text-slate-500 font-semibold">Tên lỗi (name):</Text>
              <Text className="text-xs font-mono font-bold text-rose-600">
                {lastError.name}
              </Text>
            </View>

            <View className="flex-row justify-between">
              <Text className="text-xs text-slate-500 font-semibold">Mã HTTP (statusCode):</Text>
              <Text className="text-xs font-mono font-bold text-slate-700">
                {lastError.statusCode ?? "N/A"}
              </Text>
            </View>

            <View className="pt-1 border-t border-rose-50">
              <Text className="text-[11px] text-slate-500 font-semibold mb-0.5">
                URL đã gọi:
              </Text>
              <Text className="text-[11px] font-mono text-slate-700 break-all">
                {lastError.url}
              </Text>
            </View>
          </View>
        </View>
      )}

      {/* Hiển thị khi request thành công (đối chứng) */}
      {successData && !loading && (
        <View className="bg-emerald-50 p-5 rounded-3xl border border-emerald-200 shadow-xs mb-4">
          <View className="flex-row items-center justify-between mb-2">
            <View className="bg-emerald-600 px-2.5 py-0.5 rounded-full">
              <Text className="text-white text-[11px] font-bold">
                KẾT QUẢ THÀNH CÔNG
              </Text>
            </View>
          </View>
          <Text className="text-sm font-bold text-emerald-800 mb-2">
            {successData.title}
          </Text>
          <Text className="text-xs font-mono text-emerald-700 bg-white/70 p-3 rounded-xl">
            {JSON.stringify(successData, null, 2)}
          </Text>
        </View>
      )}
    </ScrollView>
  );
}
