import React from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';

export interface BookGridItem {
  id: string;
  title: string;
  author?: string;
  price: string;
  coverUrl: string;
  badge?: string; // Ví dụ: '-20%', 'MỚI', '-15%'
}

export interface BookGridCardProps {
  item: BookGridItem;
  columns?: 2 | 3;
  onPress?: () => void;
}

/**
 * Item Thẻ sách hiển thị dạng lưới (Grid Item):
 * • Ảnh bìa phía trên: width 100%, aspectRatio: 3/4.
 * • View chứa ảnh bìa có position: 'relative' làm containing block.
 * • Badge nhãn giảm giá / Mới dùng position: 'absolute', top: 6, left: 6 chồng lên ảnh.
 * • Tên sách + Giá tiền ở phía dưới.
 */
export const BookGridCard: React.FC<BookGridCardProps> = ({
  item,
  columns = 2,
  onPress,
}) => {
  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={onPress}
      style={[
        styles.card,
        columns === 2 ? styles.cardTwoCol : styles.cardThreeCol,
      ]}
    >
      {/* 1. View chứa ảnh bìa: position: 'relative' để làm containing block */}
      <View style={styles.imageWrapper}>
        <Image
          source={{ uri: item.coverUrl }}
          style={styles.coverImage}
          resizeMode="cover"
        />

        {/* 2. Badge nổi ở góc trên-trái (position: 'absolute', top: 6, left: 6) */}
        {item.badge && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{item.badge}</Text>
          </View>
        )}
      </View>

      {/* 3. Tên + Giá phía dưới */}
      <View style={styles.infoWrapper}>
        <Text
          style={[styles.title, columns === 3 && styles.titleSmall]}
          numberOfLines={2}
        >
          {item.title}
        </Text>
        <Text style={[styles.price, columns === 3 && styles.priceSmall]}>
          {item.price}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    overflow: 'hidden',
    marginBottom: 16, // Khoảng cách giữa các hàng
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },

  // 2 cột dùng width: '48%'
  cardTwoCol: {
    width: '48%',
  },

  // 3 cột dùng width: '31%' khi kết hợp với gap
  cardThreeCol: {
    width: '31%',
  },

  // View chứa ảnh bìa: BẮT BUỘC position: 'relative' để làm containing block
  imageWrapper: {
    width: '100%',
    aspectRatio: 3 / 4, // Thuộc tính giữ đúng tỉ lệ 3:4 của bìa sách
    backgroundColor: '#E2E8F0',
    position: 'relative', // Chứa badge absolute bên trong
  },

  coverImage: {
    width: '100%',
    height: '100%',
  },

  // ==========================================
  // Badge theo đúng Yêu cầu kỹ thuật
  // ==========================================
  badge: {
    position: 'absolute', // Chồng lên ảnh chứ không đẩy layout
    top: 6, // Cách mép trên 6dp
    left: 6, // Cách mép trái 6dp
    backgroundColor: '#EF4444', // Màu đỏ nổi bật (hoặc cam)
    paddingHorizontal: 6, // Padding vừa đủ ôm chữ
    paddingVertical: 3,
    borderRadius: 4, // borderRadius nhỏ
    zIndex: 1, // Đảm bảo nổi trên ảnh bìa
    elevation: 3, // Nổi trên Android
  },

  badgeText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: 'bold',
    letterSpacing: 0.2,
  },

  infoWrapper: {
    padding: 8,
    justifyContent: 'space-between',
    minHeight: 64,
  },

  title: {
    fontSize: 13,
    fontWeight: '600',
    color: '#0F172A',
    lineHeight: 18,
    marginBottom: 4,
  },

  titleSmall: {
    fontSize: 11,
    lineHeight: 15,
  },

  price: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#16A34A',
  },

  priceSmall: {
    fontSize: 12,
  },
});

export default BookGridCard;
