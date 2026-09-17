import "./global.css";
import React from "react";
import { StatusBar } from "expo-status-bar";
import { Text, View } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import Exercise15Screen from "./src/screens/Exercise15Screen";

export default function App() {
  return (
    <SafeAreaProvider>
      <SafeAreaView className="flex-1 bg-slate-900" edges={["top", "left", "right"]}>
        <StatusBar style="light" />

        {/* Header thông tin sinh viên & Bài tập 15 */}
        {/* <View className="bg-slate-900 px-5 pt-3 pb-3.5 border-b border-slate-800">
          <View className="flex-row items-center justify-between">
            <View className="flex-1 pr-2">
              <View className="flex-row items-center gap-2 mb-0.5">
                <Text className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest">
                  BÀI TẬP 15 • TUẦN 04
                </Text>
                <Text className="text-[10px] text-slate-500">• Nhóm 03</Text>
              </View>
              <Text className="text-lg font-black text-white tracking-tight">
                Tải lại trang (Pull to Refresh)
              </Text>
            </View>

            <View className="bg-slate-800/90 border border-slate-700/80 px-3 py-1.5 rounded-xl items-end">
              <Text className="text-xs font-black text-indigo-300 tracking-wider">
                22659081
              </Text>
              <Text className="text-[10px] text-slate-300 font-medium">
                Nguyễn Minh Hoàng
              </Text>
            </View>
          </View>
        </View> */}

        {/* Nội dung chính: Bài tập 15 */}
        <View className="flex-1 bg-slate-100">
          <Exercise15Screen />
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
