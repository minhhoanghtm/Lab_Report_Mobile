import React, { useState, useMemo } from "react";
import {
  Text,
  View,
  FlatList,
  TextInput,
  TouchableOpacity,
  ListRenderItem,
} from "react-native";
import { filterByName } from "../utils/filter";

// 1. Định nghĩa các kiểu dữ liệu khác nhau để kiểm thử Generic <T>
export interface Student {
  id: number;
  name: string;
  mssv: string;
  major: string;
  gpa: number;
}

export interface TechProduct {
  id: number;
  name: string;
  brand: string;
  price: number;
  category: string;
}

export interface City {
  id: number;
  name: string;
  country: string;
  population: string;
  continent: string;
}

// Dữ liệu mẫu kiểm thử
const STUDENTS_DATA: Student[] = [
  { id: 1, name: "Nguyễn Minh Hoàng", mssv: "22659081", major: "Khoa CNTT", gpa: 3.85 },
  { id: 2, name: "Trần Mai Anh", mssv: "22659082", major: "Khoa học Dữ liệu", gpa: 3.7 },
  { id: 3, name: "Lê Hoàng Nam", mssv: "22659083", major: "Kỹ thuật Phần mềm", gpa: 3.6 },
  { id: 4, name: "Phạm Quốc Bảo", mssv: "22659084", major: "Hệ thống Thông tin", gpa: 3.9 },
  { id: 5, name: "Võ Thảo Vy", mssv: "22659085", major: "An toàn Thông tin", gpa: 3.75 },
  { id: 6, name: "Đặng Tiến Dũng", mssv: "22659086", major: "Mạng máy tính", gpa: 3.5 },
];

const PRODUCTS_DATA: TechProduct[] = [
  { id: 101, name: "iPhone 16 Pro Max", brand: "Apple", price: 1299, category: "Smartphone" },
  { id: 102, name: "Samsung Galaxy S25 Ultra", brand: "Samsung", price: 1199, category: "Smartphone" },
  { id: 103, name: "MacBook Pro M4", brand: "Apple", price: 1999, category: "Laptop" },
  { id: 104, name: "Sony WH-1000XM5", brand: "Sony", price: 349, category: "Tai nghe" },
  { id: 105, name: "Dell XPS 16", brand: "Dell", price: 1799, category: "Laptop" },
  { id: 106, name: "iPad Pro M4", brand: "Apple", price: 999, category: "Tablet" },
];

const CITIES_DATA: City[] = [
  { id: 201, name: "TP. Hồ Chí Minh", country: "Việt Nam", population: "9.3 triệu", continent: "Châu Á" },
  { id: 202, name: "Hà Nội", country: "Việt Nam", population: "8.5 triệu", continent: "Châu Á" },
  { id: 203, name: "Tokyo", country: "Nhật Bản", population: "14.0 triệu", continent: "Châu Á" },
  { id: 204, name: "Paris", country: "Pháp", population: "2.1 triệu", continent: "Châu Âu" },
  { id: 205, name: "New York", country: "Hoa Kỳ", population: "8.3 triệu", continent: "Châu Mỹ" },
  { id: 206, name: "London", country: "Anh Quốc", population: "9.0 triệu", continent: "Châu Âu" },
];

type DatasetType = "students" | "products" | "cities";

export default function Exercise13Screen() {
  const [selectedDataset, setSelectedDataset] = useState<DatasetType>("students");
  const [keyword, setKeyword] = useState<string>("");

  // 2. Áp dụng hàm Generic filterByName<T> cho từng kiểu dữ liệu
  const filteredStudents = useMemo(() => {
    return filterByName<Student>(STUDENTS_DATA, keyword);
  }, [keyword]);

  const filteredProducts = useMemo(() => {
    return filterByName<TechProduct>(PRODUCTS_DATA, keyword);
  }, [keyword]);

  const filteredCities = useMemo(() => {
    return filterByName<City>(CITIES_DATA, keyword);
  }, [keyword]);

  // Render thẻ Sinh viên (Student)
  const renderStudentItem: ListRenderItem<Student> = ({ item }) => (
    <View className="bg-white p-4 mb-3 rounded-2xl border border-slate-200 shadow-xs flex-row justify-between items-center">
      <View className="flex-row items-center gap-3">
        <View className="w-12 h-12 rounded-xl bg-indigo-100 items-center justify-center border border-indigo-200">
          <Text className="text-xl">👨‍🎓</Text>
        </View>
        <View>
          <Text className="text-base font-bold text-slate-800">{item.name}</Text>
          <Text className="text-xs text-slate-500 mt-0.5">
            MSSV: <Text className="font-semibold text-slate-700">{item.mssv}</Text> • {item.major}
          </Text>
        </View>
      </View>
      <View className="bg-indigo-50 px-2.5 py-1 rounded-lg border border-indigo-100 items-end">
        <Text className="text-[10px] text-slate-400 font-medium">GPA</Text>
        <Text className="text-xs font-black text-indigo-600">{item.gpa}</Text>
      </View>
    </View>
  );

  // Render thẻ Sản phẩm (TechProduct)
  const renderProductItem: ListRenderItem<TechProduct> = ({ item }) => (
    <View className="bg-white p-4 mb-3 rounded-2xl border border-slate-200 shadow-xs flex-row justify-between items-center">
      <View className="flex-row items-center gap-3">
        <View className="w-12 h-12 rounded-xl bg-blue-100 items-center justify-center border border-blue-200">
          <Text className="text-xl">💻</Text>
        </View>
        <View>
          <Text className="text-base font-bold text-slate-800">{item.name}</Text>
          <Text className="text-xs text-slate-500 mt-0.5">
            Hãng: <Text className="font-semibold text-slate-700">{item.brand}</Text> • {item.category}
          </Text>
        </View>
      </View>
      <View className="items-end">
        <Text className="text-base font-black text-blue-600">${item.price}</Text>
      </View>
    </View>
  );

  // Render thẻ Thành phố (City)
  const renderCityItem: ListRenderItem<City> = ({ item }) => (
    <View className="bg-white p-4 mb-3 rounded-2xl border border-slate-200 shadow-xs flex-row justify-between items-center">
      <View className="flex-row items-center gap-3">
        <View className="w-12 h-12 rounded-xl bg-teal-100 items-center justify-center border border-teal-200">
          <Text className="text-xl">🏙️</Text>
        </View>
        <View>
          <Text className="text-base font-bold text-slate-800">{item.name}</Text>
          <Text className="text-xs text-slate-500 mt-0.5">
            Quốc gia: <Text className="font-semibold text-slate-700">{item.country}</Text> • {item.continent}
          </Text>
        </View>
      </View>
      <View className="bg-teal-50 px-2.5 py-1 rounded-lg border border-teal-100 items-end">
        <Text className="text-[10px] text-teal-600 font-medium">Dân số</Text>
        <Text className="text-xs font-bold text-teal-800">{item.population}</Text>
      </View>
    </View>
  );

  return (
    <View className="flex-1 bg-slate-100">
      {/* Khối điều khiển & Chọn Dataset để kiểm thử tính Generic */}
      <View className="bg-white px-4 pt-3 pb-3.5 border-b border-slate-200">
        {/* Chữ ký hàm Generic minh họa */}
        {/* <View className="bg-slate-900 px-3 py-2 rounded-xl mb-3 border border-slate-800">
          <Text className="text-[10px] text-slate-400 font-mono">
            // Cú pháp Generic Function:
          </Text>
          <Text className="text-xs text-indigo-300 font-mono font-bold mt-0.5">
            filterByName&lt;T extends &#123; name: string &#125;&gt;(items: T[], keyword: string): T[]
          </Text>
        </View> */}

        {/* Thanh chuyển đổi tập dữ liệu (Dataset Selector) */}
        <View className="flex-row gap-2 mb-3">
          <TouchableOpacity
            onPress={() => setSelectedDataset("students")}
            className={`flex-1 py-2 rounded-xl items-center border ${
              selectedDataset === "students"
                ? "bg-indigo-600 border-indigo-600"
                : "bg-slate-50 border-slate-200"
            }`}
          >
            <Text
              className={`text-xs font-bold ${
                selectedDataset === "students" ? "text-white" : "text-slate-600"
              }`}
            >
              👨‍🎓 Sinh viên
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setSelectedDataset("products")}
            className={`flex-1 py-2 rounded-xl items-center border ${
              selectedDataset === "products"
                ? "bg-blue-600 border-blue-600"
                : "bg-slate-50 border-slate-200"
            }`}
          >
            <Text
              className={`text-xs font-bold ${
                selectedDataset === "products" ? "text-white" : "text-slate-600"
              }`}
            >
              💻 Sản phẩm
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setSelectedDataset("cities")}
            className={`flex-1 py-2 rounded-xl items-center border ${
              selectedDataset === "cities"
                ? "bg-teal-600 border-teal-600"
                : "bg-slate-50 border-slate-200"
            }`}
          >
            <Text
              className={`text-xs font-bold ${
                selectedDataset === "cities" ? "text-white" : "text-slate-600"
              }`}
            >
              🏙️ Thành phố
            </Text>
          </TouchableOpacity>
        </View>

        {/* Ô nhập từ khóa tìm kiếm (lọc theo thuộc tính 'name') */}
        <View className="flex-row items-center bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200">
          <Text className="text-slate-400 mr-2 text-sm">🔍</Text>
          <TextInput
            className="flex-1 text-slate-800 text-sm py-1 font-medium"
            placeholder={
              selectedDataset === "students"
                ? "Lọc theo tên sinh viên (vd: Hoàng, Mai, Nam)..."
                : selectedDataset === "products"
                ? "Lọc theo tên sản phẩm (vd: iPhone, Mac, Dell)..."
                : "Lọc theo tên thành phố (vd: Hồ Chí Minh, Tokyo)..."
            }
            placeholderTextColor="#94a3b8"
            value={keyword}
            onChangeText={setKeyword}
            clearButtonMode="while-editing"
          />
          {keyword.length > 0 && (
            <TouchableOpacity onPress={() => setKeyword("")} className="p-1">
              <Text className="text-slate-400 text-xs font-bold">✕</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Thống kê kết quả lọc */}
        <View className="flex-row justify-between items-center mt-2.5 pt-2 border-t border-slate-100">
          <Text className="text-[11px] text-slate-400">
            Kiểu dữ liệu Generic:{" "}
            <Text className="font-mono text-indigo-600 font-bold">
              {selectedDataset === "students"
                ? "<Student>"
                : selectedDataset === "products"
                ? "<TechProduct>"
                : "<City>"}
            </Text>
          </Text>
          <Text className="text-xs font-semibold text-slate-600">
            Kết quả:{" "}
            <Text className="font-bold text-indigo-600">
              {selectedDataset === "students"
                ? filteredStudents.length
                : selectedDataset === "products"
                ? filteredProducts.length
                : filteredCities.length}
            </Text>
            /6 phần tử
          </Text>
        </View>
      </View>

      {/* Danh sách FlatList hiển thị kết quả lọc */}
      <View className="flex-1 p-3.5">
        {selectedDataset === "students" && (
          <FlatList
            data={filteredStudents}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderStudentItem}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              <View className="py-16 items-center">
                <Text className="text-slate-400 text-sm">
                  Không tìm thấy sinh viên nào có tên khớp với "{keyword}".
                </Text>
              </View>
            }
          />
        )}

        {selectedDataset === "products" && (
          <FlatList
            data={filteredProducts}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderProductItem}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              <View className="py-16 items-center">
                <Text className="text-slate-400 text-sm">
                  Không tìm thấy sản phẩm nào có tên khớp với "{keyword}".
                </Text>
              </View>
            }
          />
        )}

        {selectedDataset === "cities" && (
          <FlatList
            data={filteredCities}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderCityItem}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              <View className="py-16 items-center">
                <Text className="text-slate-400 text-sm">
                  Không tìm thấy thành phố nào có tên khớp với "{keyword}".
                </Text>
              </View>
            }
          />
        )}
      </View>
    </View>
  );
}
