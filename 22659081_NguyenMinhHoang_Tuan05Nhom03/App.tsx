import React, { useState } from 'react';
import { StyleSheet, View, Text, StatusBar, Alert, ScrollView } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { Header } from './components/Header';
import { CategoryChips } from './components/CategoryChips';
import { BookGridCard, BookGridItem } from './components/BookGridCard';
import { FloatingCartButton } from './components/FloatingCartButton';
import { BottomTabBar, TabKey } from './components/BottomTabBar';
import { BookDetailScreen } from './screens/BookDetailScreen';
import { CartScreen, CartItem } from './screens/CartScreen';

const SAMPLE_BOOKS: BookGridItem[] = [
  {
    id: '1',
    title: 'Lập Trình Di Động Nâng Cao React Native',
    author: 'Nguyễn Minh Hoàng',
    price: '189.000 đ',
    coverUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&q=80',
    badge: '-20%',
  },
  {
    id: '2',
    title: 'Clean Code - Nghệ Thuật Viết Code Sạch',
    author: 'Robert C. Martin',
    price: '245.000 đ',
    coverUrl: 'https://images.unsplash.com/photo-1532012164546-f432f2e3edd4?w=400&q=80',
    badge: 'MỚI',
  },
  {
    id: '3',
    title: 'JavaScript & TypeScript Hiện Đại',
    author: 'Kyle Simpson',
    price: '155.000 đ',
    coverUrl: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&q=80',
    badge: '-15%',
  },
  {
    id: '4',
    title: 'Thiết Kế UI/UX Cho Ứng Dụng Mobile',
    author: 'Don Norman',
    price: '210.000 đ',
    coverUrl: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=400&q=80',
    badge: 'HOT',
  },
  {
    id: '5',
    title: 'Cấu Trúc Dữ Liệu & Giải Thuật',
    author: 'Thomas H. Cormen',
    price: '175.000 đ',
    coverUrl: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=400&q=80',
    badge: '-30%',
  },
  {
    id: '6',
    title: 'Lập Trình Hướng Đối Tượng Java',
    author: 'Herbert Schildt',
    price: '160.000 đ',
    coverUrl: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=400&q=80',
    badge: '-10%',
  },
];

// Dữ liệu khởi tạo giỏ hàng (4 sản phẩm như sơ đồ)
const INITIAL_CART_ITEMS: CartItem[] = [
  {
    id: '1',
    title: 'Lập Trình Di Động Nâng Cao React Native',
    price: '189.000 đ',
    priceNum: 189000,
    quantity: 1,
    coverUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&q=80',
  },
  {
    id: '2',
    title: 'Clean Code - Nghệ Thuật Viết Code Sạch',
    price: '245.000 đ',
    priceNum: 245000,
    quantity: 1,
    coverUrl: 'https://images.unsplash.com/photo-1532012164546-f432f2e3edd4?w=400&q=80',
  },
  {
    id: '3',
    title: 'JavaScript & TypeScript Hiện Đại',
    price: '155.000 đ',
    priceNum: 155000,
    quantity: 1,
    coverUrl: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&q=80',
  },
  {
    id: '4',
    title: 'Thiết Kế UI/UX Cho Ứng Dụng Mobile',
    price: '210.000 đ',
    priceNum: 210000,
    quantity: 1,
    coverUrl: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=400&q=80',
  },
];

export default function App() {
  const [activeTab, setActiveTab] = useState<TabKey>('home');
  const [cartItems, setCartItems] = useState<CartItem[]>(INITIAL_CART_ITEMS);
  const [selectedCategory, setSelectedCategory] = useState('Văn học');
  const [selectedBook, setSelectedBook] = useState<BookGridItem | null>(null);

  // Tổng số lượng cuốn sách trong giỏ
  const totalCartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  // Thêm sách vào giỏ
  const handleAddToCart = (book: BookGridItem, quantity: number = 1) => {
    setCartItems((prevItems) => {
      const existing = prevItems.find((item) => item.id === book.id);
      const priceNum = parseInt(book.price.replace(/[^\d]/g, ''), 10) || 100000;

      if (existing) {
        return prevItems.map((item) =>
          item.id === book.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        return [
          ...prevItems,
          {
            id: book.id,
            title: book.title,
            price: book.price,
            priceNum: priceNum,
            quantity: quantity,
            coverUrl: book.coverUrl,
          },
        ];
      }
    });
  };

  // Cập nhật số lượng (+ / -)
  const handleUpdateQuantity = (id: string, delta: number) => {
    setCartItems((prev) =>
      prev
        .map((item) => {
          if (item.id === id) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter((item): item is CartItem => item !== null)
    );
  };

  // Xóa item khỏi giỏ
  const handleRemoveItem = (id: string) => {
    Alert.alert('Xác nhận', 'Bạn có chắc chắn muốn xóa sản phẩm này khỏi giỏ hàng?', [
      { text: 'Hủy', style: 'cancel' },
      {
        text: 'Xóa',
        style: 'destructive',
        onPress: () => {
          setCartItems((prev) => prev.filter((item) => item.id !== id));
        },
      },
    ]);
  };

  // Thanh toán
  const handleCheckout = () => {
    const totalAmount = cartItems.reduce(
      (sum, item) => sum + item.priceNum * item.quantity,
      0
    );
    Alert.alert(
      'Thanh toán thành công 🎉',
      `Đơn hàng trị giá ${totalAmount.toLocaleString('vi-VN')} đ đã được tiếp nhận!`,
      [
        {
          text: 'OK',
          onPress: () => {
            setCartItems([]);
            setActiveTab('home');
          },
        },
      ]
    );
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
        <StatusBar barStyle="light-content" backgroundColor="#1A237E" />

        {/* 
          THỬ THÁCH PART_01: GHÉP NỐI TOÀN BỘ 5 MÀN HÌNH HOÀN CHỈNH BẰNG USESTATE
          1. Màn hình Chi tiết sách (Detail Screen)
          2. Màn hình Home (Home Screen)
          3. Màn hình Giỏ hàng (Cart Screen)
          4. Màn hình Danh mục (Categories Screen)
          5. Màn hình Tài khoản (Account Screen)
        */}
        {selectedBook ? (
          <BookDetailScreen
            book={selectedBook}
            onBack={() => setSelectedBook(null)}
            onAddToCart={(book, qty) => handleAddToCart(book, qty)}
          />
        ) : (
          <View style={styles.appContainer}>
            {/* Header cố định trên cùng */}
            <Header
              appName="BookStore"
              cartCount={totalCartCount}
              onSearchPress={() => Alert.alert('Tìm kiếm', 'Nhập tên sách cần tìm...')}
              onCartPress={() => setActiveTab('cart')}
            />

            {/* Khung nội dung chính theo Tab */}
            <View style={styles.contentWrapper}>
              {/* TAB 1: TRANG CHỦ */}
              {activeTab === 'home' && (
                <>
                  <ScrollView
                    style={styles.scrollView}
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                  >
                    <View style={styles.sectionHeader}>
                      <Text style={styles.sectionTitle}>Danh mục sách</Text>
                    </View>
                    <View style={styles.chipsWrapper}>
                      <CategoryChips
                        selectedCategory={selectedCategory}
                        onSelectCategory={(cat) => setSelectedCategory(cat)}
                      />
                    </View>

                    <View style={styles.sectionHeader}>
                      <Text style={styles.sectionTitle}>Sách nổi bật (Chạm xem chi tiết)</Text>
                    </View>
                    <View style={styles.gridContainer}>
                      {SAMPLE_BOOKS.map((book) => (
                        <BookGridCard
                          key={book.id}
                          item={book}
                          columns={2}
                          onPress={() => setSelectedBook(book)}
                        />
                      ))}
                    </View>
                  </ScrollView>

                  {/* Nút giỏ hàng nổi góc dưới - phải màn hình Home */}
                  <FloatingCartButton
                    count={totalCartCount}
                    onPress={() => setActiveTab('cart')}
                  />
                </>
              )}

              {/* TAB 2: DANH MỤC */}
              {activeTab === 'categories' && (
                <ScrollView
                  style={styles.scrollView}
                  contentContainerStyle={styles.scrollContent}
                  showsVerticalScrollIndicator={false}
                >
                  <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Tất cả thể loại sách</Text>
                  </View>
                  <View style={styles.chipsWrapper}>
                    <CategoryChips
                      selectedCategory={selectedCategory}
                      onSelectCategory={(cat) => {
                        setSelectedCategory(cat);
                        setActiveTab('home');
                      }}
                    />
                  </View>
                </ScrollView>
              )}

              {/* TAB 3: GIỎ HÀNG (MÀN HÌNH GIỎ HÀNG VỚI 3 VÙNG CHUẨN) */}
              {activeTab === 'cart' && (
                <CartScreen
                  items={cartItems}
                  onUpdateQuantity={handleUpdateQuantity}
                  onRemoveItem={handleRemoveItem}
                  onCheckout={handleCheckout}
                />
              )}

              {/* TAB 4: TÀI KHOẢN */}
              {activeTab === 'account' && (
                <View style={styles.accountContainer}>
                  <View style={styles.accountCard}>
                    <View style={styles.avatarCircle}>
                      <Text style={styles.avatarText}>H</Text>
                    </View>
                    <Text style={styles.accountName}>Nguyễn Minh Hoàng</Text>
                    <Text style={styles.accountInfo}>MSSV: 22659081</Text>
                    <Text style={styles.accountInfo}>Lớp: Tuần 05 - Nhóm 03</Text>
                    <View style={styles.badgeSuccess}>
                      <Text style={styles.badgeSuccessText}>
                        Hoàn thành 100% Lab React Native & Flexbox
                      </Text>
                    </View>
                  </View>
                </View>
              )}
            </View>

            {/* Thanh Bottom Tab Bar CỐ ĐỊNH Ở ĐÁY MÀN HÌNH (dùng chung cho toàn bộ các tab) */}
            <BottomTabBar
              activeTab={activeTab}
              onTabChange={(tab) => setActiveTab(tab)}
              cartCount={totalCartCount}
            />
          </View>
        )}
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#1A237E',
  },
  appContainer: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  contentWrapper: {
    flex: 1,
    position: 'relative',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 90,
  },
  sectionHeader: {
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 8,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#0F172A',
  },
  chipsWrapper: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 8,
  },

  // Màn hình tài khoản sinh viên
  accountContainer: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  accountCard: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  avatarCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#1A237E',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 14,
  },
  avatarText: {
    color: '#FFFFFF',
    fontSize: 30,
    fontWeight: 'bold',
  },
  accountName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0F172A',
    marginBottom: 6,
  },
  accountInfo: {
    fontSize: 14,
    color: '#64748B',
    marginBottom: 4,
  },
  badgeSuccess: {
    marginTop: 16,
    backgroundColor: '#DCFCE7',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#86EFAC',
  },
  badgeSuccessText: {
    color: '#15803D',
    fontSize: 12,
    fontWeight: '700',
  },
});
