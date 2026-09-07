import React, { memo, useCallback, useMemo, useState } from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

interface Product {
  id: string;
  name: string;
  price: number;
}

const initialProducts: Product[] = [
  { id: '1', name: 'Áo thun', price: 200000 },
  { id: '2', name: 'Quần jean', price: 450000 },
  { id: '3', name: 'Giày thể thao', price: 800000 },
  { id: '4', name: 'Áo khoác gió', price: 350000 },
  { id: '5', name: 'Mũ lưỡi trai', price: 150000 },
  { id: '6', name: 'Balo laptop', price: 600000 },
];

// 3. Mở rộng: Sử dụng React.memo để tránh re-render khi props không đổi
interface ProductItemProps {
  item: Product;
  onSelect: (product: Product) => void;
}

const ProductItem = memo(function ProductItem({ item, onSelect }: ProductItemProps) {
  // 4. Mở rộng: Theo dõi render của từng item qua console log
  console.log(`[Render] ProductItem: ${item.name}`);

  return (
    <TouchableOpacity
      style={styles.itemContainer}
      onPress={() => onSelect(item)}
    >
      <Text style={styles.itemName}>{item.name}</Text>
      <Text style={styles.itemPrice}>
        {item.price.toLocaleString('vi-VN')} đ
      </Text>
    </TouchableOpacity>
  );
});

const Bai5UseMemoCallback = () => {
  const [keyword, setKeyword] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [sortOrder, setSortOrder] = useState<'none' | 'asc' | 'desc'>('none');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // 1 & 2. Mở rộng: Dùng useMemo để lọc theo tên, lọc theo giá tối đa và sắp xếp
  const filteredProducts = useMemo(() => {
    let result = initialProducts.filter(product =>
      product.name.toLowerCase().includes(keyword.trim().toLowerCase())
    );

    const max = parseFloat(maxPrice);
    if (!isNaN(max) && max > 0) {
      result = result.filter(product => product.price <= max);
    }

    if (sortOrder === 'asc') {
      result = [...result].sort((a, b) => a.price - b.price);
    } else if (sortOrder === 'desc') {
      result = [...result].sort((a, b) => b.price - a.price);
    }

    return result;
  }, [keyword, maxPrice, sortOrder]);

  // Dùng useMemo để tính tổng giá các sản phẩm đang hiển thị
  const totalPrice = useMemo(() => {
    return filteredProducts.reduce((total, item) => total + item.price, 0);
  }, [filteredProducts]);

  // Dùng useCallback để giữ ổn định tham chiếu hàm onSelect
  const handleSelect = useCallback((product: Product) => {
    setSelectedProduct(product);
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bài 5: useMemo & useCallback</Text>

      {/* Ô tìm kiếm theo tên */}
      <TextInput
        style={styles.input}
        value={keyword}
        onChangeText={setKeyword}
        placeholder="🔍 Tìm kiếm sản phẩm theo tên..."
        placeholderTextColor="#999"
      />

      {/* 2. Mở rộng: Ô lọc theo mức giá tối đa */}
      <TextInput
        style={styles.input}
        value={maxPrice}
        onChangeText={setMaxPrice}
        placeholder="💵 Mức giá tối đa (VD: 500000)..."
        placeholderTextColor="#999"
        keyboardType="numeric"
      />

      {/* 1. Mở rộng: Nút chọn sắp xếp giá */}
      <View style={styles.sortRow}>
        <Text style={styles.sortLabel}>Sắp xếp giá:</Text>
        <View style={styles.sortButtonGroup}>
          <TouchableOpacity
            style={[styles.sortBtn, sortOrder === 'none' && styles.sortBtnActive]}
            onPress={() => setSortOrder('none')}
          >
            <Text style={[styles.sortBtnText, sortOrder === 'none' && styles.sortBtnTextActive]}>
              Mặc định
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.sortBtn, sortOrder === 'asc' && styles.sortBtnActive]}
            onPress={() => setSortOrder('asc')}
          >
            <Text style={[styles.sortBtnText, sortOrder === 'asc' && styles.sortBtnTextActive]}>
              Tăng dần ↑
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.sortBtn, sortOrder === 'desc' && styles.sortBtnActive]}
            onPress={() => setSortOrder('desc')}
          >
            <Text style={[styles.sortBtnText, sortOrder === 'desc' && styles.sortBtnTextActive]}>
              Giảm dần ↓
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Thông tin sản phẩm đã chọn */}
      {selectedProduct && (
        <View style={styles.selectedBox}>
          <Text style={styles.selectedText}>
            Đã chọn: <Text style={styles.boldText}>{selectedProduct.name}</Text> ({selectedProduct.price.toLocaleString('vi-VN')} đ)
          </Text>
        </View>
      )}

      {/* Danh sách sản phẩm */}
      <FlatList
        data={filteredProducts}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <ProductItem item={item} onSelect={handleSelect} />
        )}
        ListEmptyComponent={
          <Text style={styles.emptyText}>Không tìm thấy sản phẩm phù hợp</Text>
        }
        style={styles.list}
        scrollEnabled={false}
      />

      {/* Hiển thị tổng giá trị */}
      <View style={styles.totalBox}>
        <Text style={styles.totalLabel}>
          Tổng giá ({filteredProducts.length} sản phẩm):
        </Text>
        <Text style={styles.totalValue}>
          {totalPrice.toLocaleString('vi-VN')} đ
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '90%',
    maxWidth: 380,
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
    textAlign: 'center',
  },
  input: {
    height: 42,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 14,
    marginBottom: 10,
    backgroundColor: '#f9f9f9',
  },
  sortRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    flexWrap: 'wrap',
    gap: 6,
  },
  sortLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#555',
  },
  sortButtonGroup: {
    flexDirection: 'row',
    gap: 4,
  },
  sortBtn: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 6,
    backgroundColor: '#f0f0f0',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  sortBtnActive: {
    backgroundColor: '#007bff',
    borderColor: '#007bff',
  },
  sortBtnText: {
    fontSize: 12,
    color: '#555',
  },
  sortBtnTextActive: {
    color: '#fff',
    fontWeight: 'bold',
  },
  selectedBox: {
    padding: 10,
    backgroundColor: '#e6f7ff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#91d5ff',
    marginBottom: 10,
  },
  selectedText: {
    fontSize: 13,
    color: '#0050b3',
  },
  boldText: {
    fontWeight: 'bold',
  },
  list: {
    marginVertical: 4,
  },
  itemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: '#fafafa',
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#eee',
  },
  itemName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },
  itemPrice: {
    fontSize: 14,
    fontWeight: '600',
    color: '#28a745',
  },
  emptyText: {
    textAlign: 'center',
    color: '#888',
    paddingVertical: 16,
    fontStyle: 'italic',
  },
  totalBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    marginTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  totalLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  totalValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#d9534f',
  },
});

export default Bai5UseMemoCallback;
