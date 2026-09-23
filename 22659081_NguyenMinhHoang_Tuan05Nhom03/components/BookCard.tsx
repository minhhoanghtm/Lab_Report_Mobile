import React from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';

export interface BookCardProps {
  title?: string;
  author?: string;
  price?: string;
  coverUrl?: string;
  alignItemsMode?: 'flex-start' | 'center';
  onPress?: () => void;
}

/**
 * Bài tập 2: Thẻ sách (Book Card) đơn
 * 
 * Yêu cầu kỹ thuật:
 * • Card ngoài cùng: flexDirection: 'row', alignItems: 'flex-start' (hoặc 'center').
 * • Ảnh bìa: width/height cố định (80x110), borderRadius.
 * • Cột thông tin: flex: 1 để chiếm phần không gian còn lại, flexDirection: 'column'.
 * • Giá tiền căn dưới cùng của cột thông tin bằng justifyContent: 'space-between' trên trục dọc.
 * • Gợi ý: numberOfLines={2} trên Text tên sách để layout ổn định.
 */
export const BookCard: React.FC<BookCardProps> = ({
  title = 'Lập Trình Di Động Nâng Cao Với React Native & Expo',
  author = 'Nguyễn Minh Hoàng',
  price = '189.000 đ',
  coverUrl = 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&q=80',
  alignItemsMode = 'flex-start',
  onPress,
}) => {
  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={onPress}
      style={[
        styles.cardContainer,
        { alignItems: alignItemsMode }, // Cho phép linh hoạt 'flex-start' hoặc 'center'
      ]}
    >
      {/* 1. Ảnh bìa bên trái: Kích thước cố định 80x110, borderRadius */}
      <Image
        source={{ uri: coverUrl }}
        style={styles.coverImage}
        resizeMode="cover"
      />

      {/* 2. Cột thông tin bên phải: flex: 1, flexDirection: 'column', justifyContent: 'space-between' */}
      <View style={styles.infoColumn}>
        {/* Nhóm trên: Tên sách (tối đa 2 dòng) + Tác giả */}
        <View style={styles.topInfoGroup}>
          <Text style={styles.bookTitle} numberOfLines={2}>
            {title}
          </Text>
          <Text style={styles.authorText} numberOfLines={1}>
            {author}
          </Text>
        </View>

        {/* Nhóm dưới: Giá tiền căn dưới cùng bằng justifyContent: 'space-between' */}
        <View style={styles.priceContainer}>
          <Text style={styles.priceText}>{price}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  // ==========================================
  // Card ngoài cùng theo đúng Yêu cầu kỹ thuật
  // ==========================================
  cardContainer: {
    flexDirection: 'row', // Sắp xếp ảnh bìa và cột thông tin theo hàng ngang
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    marginHorizontal: 16,
    marginVertical: 12,

    // Hiệu ứng bóng (Shadow / Elevation) giúp card nổi bật
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,

    // Viền nhẹ
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },

  // Ảnh bìa: width/height cố định (80x110), borderRadius
  coverImage: {
    width: 80,
    height: 110,
    borderRadius: 8,
    backgroundColor: '#E2E8F0',
  },

  // Cột thông tin: flex: 1, flexDirection: 'column', justifyContent: 'space-between'
  infoColumn: {
    flex: 1, // Chiếm trọn không gian còn lại bên phải
    height: 110, // Khớp chiều cao ảnh bìa để trục dọc đủ không gian căn dưới
    flexDirection: 'column', // Xếp thông tin theo chiều dọc
    justifyContent: 'space-between', // Đẩy nhóm tên+tác giả lên trên và giá xuống đáy
    marginLeft: 14, // Khoảng cách giữa ảnh bìa và thông tin
  },

  topInfoGroup: {
    // Nhóm tên sách và tác giả ở phần trên
  },

  bookTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
    lineHeight: 22,
    marginBottom: 4,
  },

  authorText: {
    fontSize: 13,
    color: '#64748B',
    fontWeight: '500',
  },

  // Giá tiền nằm ở đáy cột thông tin
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },

  priceText: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#16A34A', // Màu xanh lá nổi bật cho giá tiền
  },
});

export default BookCard;
