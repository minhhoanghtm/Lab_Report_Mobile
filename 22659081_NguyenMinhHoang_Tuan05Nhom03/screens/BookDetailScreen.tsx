import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BookGridItem } from '../components/BookGridCard';

export interface BookDetailScreenProps {
  book: BookGridItem;
  onBack: () => void;
  onAddToCart: (book: BookGridItem, quantity: number) => void;
}

/**
 * Màn hình Chi tiết 1 cuốn sách (Book Detail Screen):
 * 
 * Yêu cầu kỹ thuật:
 * • Ảnh bìa lớn: alignSelf: 'center', width cố định hoặc theo %, aspectRatio giữ tỉ lệ.
 * • Phần mô tả dài đặt trong ScrollView riêng (flex: 1) để không đẩy tràn thanh 'Thêm vào giỏ' cố định phía dưới.
 * • Thanh dưới cùng: flexDirection: 'row', justifyContent: 'space-between', không nằm trong ScrollView.
 * • Cấu trúc tổng thể: phần cố định (đầu/cuối) nằm ngoài ScrollView, phần nội dung dài nằm trong ScrollView ở giữa.
 */
export const BookDetailScreen: React.FC<BookDetailScreenProps> = ({
  book,
  onBack,
  onAddToCart,
}) => {
  const [quantity, setQuantity] = useState(1);

  const handleAddToCartPress = () => {
    onAddToCart(book, quantity);
    Alert.alert(
      'Thành công',
      `Đã thêm ${quantity} cuốn "${book.title}" vào giỏ hàng!`,
      [{ text: 'OK' }]
    );
  };

  return (
    <View style={styles.screenContainer}>
      {/* 1. Header chi tiết cố định phía trên: nút Quay lại & Tiêu đề */}
      <View style={styles.topHeader}>
        <TouchableOpacity
          onPress={onBack}
          style={styles.backButton}
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.topHeaderTitle} numberOfLines={1}>
          Chi tiết sách
        </Text>
        <View style={{ width: 40 }} />
      </View>

      {/* 2. Phần nội dung cuộn ở giữa: ScrollView (flex: 1) */}
      <ScrollView
        style={styles.scrollArea}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* 2.1. Ảnh bìa lớn: alignSelf: 'center', width: '55%', aspectRatio: 3/4 */}
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: book.coverUrl }}
            style={styles.largeCoverImage}
            resizeMode="cover"
          />
          {book.badge && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{book.badge}</Text>
            </View>
          )}
        </View>

        {/* 2.2. Khối thông tin: Tên sách + Tác giả */}
        <View style={styles.metaContainer}>
          <Text style={styles.bookTitle}>{book.title}</Text>
          <Text style={styles.authorName}>
            Tác giả: <Text style={styles.authorBold}>{book.author ?? 'Nguyễn Minh Hoàng'}</Text>
          </Text>

          {/* Giá tiền nổi bật */}
          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>Giá bán:</Text>
            <Text style={styles.bookPrice}>{book.price}</Text>
          </View>
        </View>

        {/* 2.3. Phần mô tả dài (Scrollable bên trong ScrollView) */}
        <View style={styles.descriptionSection}>
          <Text style={styles.sectionHeading}>Giới thiệu nội dung</Text>
          <Text style={styles.descriptionParagraph}>
            Cuốn sách này cung cấp nền tảng toàn diện và chuyên sâu về phát triển ứng dụng di động đa nền tảng hiện đại. Bạn sẽ được làm quen từ các khái niệm cơ bản nhất của Flexbox (flexDirection, justifyContent, alignItems, flexWrap, alignContent) cho đến các kỹ thuật bố cục phức tạp với absolute position và containing block lồng nhau.
          </Text>
          <Text style={styles.descriptionParagraph}>
            Nội dung sách được biên soạn kỹ lưỡng với phương pháp học tập kết hợp lý thuyết trọng tâm và bài tập thực hành theo từng giờ học (Giờ 1: Flexbox cơ bản, Giờ 2: Category Chips & Book Grid, Giờ 3: Position Absolute & Floating Action Button, Giờ 4: Hoàn thiện màn hình hoàn chỉnh).
          </Text>
          <Text style={styles.descriptionParagraph}>
            Đặc biệt, bạn sẽ nắm vững cách xây dựng ứng dụng BookStore thực tế chạy mượt mà trên cả Android, iOS và Web với công nghệ Expo SDK tiên tiến nhất. Đây là cẩm nang không thể thiếu dành cho mọi lập trình viên mobile.
          </Text>
        </View>
      </ScrollView>

      {/* 3. Thanh 'Thêm vào giỏ' CỐ ĐỊNH DƯỚI CÙNG (không nằm trong ScrollView) */}
      <View style={styles.bottomBar}>
        {/* Bên trái: Bộ chọn số lượng */}
        <View style={styles.quantityPicker}>
          <TouchableOpacity
            style={styles.qtyBtn}
            onPress={() => setQuantity((q) => Math.max(1, q - 1))}
          >
            <Ionicons name="remove" size={18} color="#1E293B" />
          </TouchableOpacity>
          <Text style={styles.qtyText}>{quantity}</Text>
          <TouchableOpacity
            style={styles.qtyBtn}
            onPress={() => setQuantity((q) => q + 1)}
          >
            <Ionicons name="add" size={18} color="#1E293B" />
          </TouchableOpacity>
        </View>

        {/* Bên phải: Nút Thêm vào giỏ */}
        <TouchableOpacity
          style={styles.addToCartButton}
          activeOpacity={0.8}
          onPress={handleAddToCartPress}
        >
          <Ionicons name="cart" size={20} color="#FFFFFF" style={{ marginRight: 8 }} />
          <Text style={styles.addToCartText}>Thêm vào giỏ</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },

  // Header trên cùng
  topHeader: {
    height: 56,
    backgroundColor: '#1A237E',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  backButton: {
    padding: 8,
  },
  topHeaderTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
  },

  // Phần cuộn nội dung ở giữa: ScrollView (flex: 1)
  scrollArea: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 24,
  },

  // Ảnh bìa lớn theo đúng yêu cầu kỹ thuật:
  // alignSelf: 'center', width theo %, aspectRatio giữ tỉ lệ
  imageContainer: {
    alignSelf: 'center',
    width: '55%', // Độ rộng chiếm 55% màn hình
    aspectRatio: 3 / 4, // Tỉ lệ bìa sách 3:4
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
    position: 'relative',
    marginBottom: 20,
  },
  largeCoverImage: {
    width: '100%',
    height: '100%',
  },
  badge: {
    position: 'absolute',
    top: 10,
    left: 10,
    backgroundColor: '#EF4444',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },

  // Khối thông tin
  metaContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  bookTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0F172A',
    lineHeight: 28,
    marginBottom: 6,
  },
  authorName: {
    fontSize: 14,
    color: '#64748B',
    marginBottom: 12,
  },
  authorBold: {
    color: '#334155',
    fontWeight: '600',
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  priceLabel: {
    fontSize: 14,
    color: '#64748B',
    marginRight: 8,
  },
  bookPrice: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#16A34A',
  },

  // Khối mô tả dài
  descriptionSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  sectionHeading: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 10,
  },
  descriptionParagraph: {
    fontSize: 14,
    color: '#475569',
    lineHeight: 22,
    marginBottom: 12,
    textAlign: 'justify',
  },

  // ==========================================
  // Thanh dưới cùng: Thêm vào giỏ hàng
  // flexDirection: 'row', justifyContent: 'space-between', KHÔNG nằm trong ScrollView
  // ==========================================
  bottomBar: {
    height: 72,
    backgroundColor: '#FFFFFF',
    flexDirection: 'row', // Sắp xếp theo hàng ngang
    justifyContent: 'space-between', // Đẩy bộ chọn số lượng và nút thêm sang 2 phía
    alignItems: 'center',
    paddingHorizontal: 20,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  quantityPicker: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#CBD5E1',
  },
  qtyBtn: {
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  qtyText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0F172A',
    minWidth: 24,
    textAlign: 'center',
  },
  addToCartButton: {
    backgroundColor: '#1A237E',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 10,
    elevation: 2,
  },
  addToCartText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: 'bold',
  },
});

export default BookDetailScreen;
