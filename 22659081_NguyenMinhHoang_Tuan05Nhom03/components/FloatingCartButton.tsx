import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export interface FloatingCartButtonProps {
  count?: number;
  onPress?: () => void;
}

/**
 * Floating Cart Button (Nút giỏ hàng nổi góc dưới - phải màn hình):
 * 
 * Yêu cầu kỹ thuật:
 * • Nút chính: position: 'absolute', bottom: 24, right: 20, width/height bằng nhau + borderRadius = width/2 để tạo hình tròn.
 * • Số lượng sản phẩm: View nhỏ position: 'absolute' đặt ở góc trên-phải của chính nút tròn (containing block lồng nhau).
 * • Container ngoài cùng của màn hình cần flex: 1 và position: 'relative' để nút định vị theo toàn màn hình.
 */
export const FloatingCartButton: React.FC<FloatingCartButtonProps> = ({
  count = 4,
  onPress,
}) => {
  return (
    <TouchableOpacity
      activeOpacity={0.85}
      style={styles.floatingButton}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel="Xem giỏ hàng"
    >
      {/* Icon giỏ hàng bên trong nút tròn */}
      <Ionicons name="cart" size={26} color="#FFFFFF" />

      {/* Badge số lượng sản phẩm: Containing block lồng nhau (định vị theo chính nút tròn này) */}
      {count > 0 && (
        <View style={styles.badgeContainer}>
          <Text style={styles.badgeText}>{count}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  // Nút giỏ hàng chính nổi cố định ở góc dưới - phải màn hình
  floatingButton: {
    position: 'absolute', // Định vị tuyệt đối theo màn hình cha (containing block ngoài)
    bottom: 24, // Cách đáy 24dp
    right: 20, // Cách mép phải 20dp
    width: 58,
    height: 58,
    borderRadius: 29, // borderRadius = width / 2 để tạo hình tròn hoàn hảo
    backgroundColor: '#2563EB', // Màu xanh dương / indigo nổi bật
    justifyContent: 'center',
    alignItems: 'center',

    // Đổ bóng đậm giúp nút nổi hẳn lên trên danh sách cuộn
    elevation: 8, // Android
    shadowColor: '#000', // iOS
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 6,
    zIndex: 999, // Đảm bảo luôn nằm trên các nội dung khác
  },

  // Badge số lượng sản phẩm: Định vị theo góc trên-phải của NÚT TRÒN
  badgeContainer: {
    position: 'absolute', // Định vị tuyệt đối theo nút tròn (containing block con)
    top: -4, // Lệch lên trên mép nút tròn 4dp
    right: -4, // Lệch sang phải mép nút tròn 4dp
    backgroundColor: '#EF4444', // Màu đỏ cảnh báo nổi bật
    minWidth: 22,
    height: 22,
    borderRadius: 11,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
    borderWidth: 2,
    borderColor: '#FFFFFF', // Viền trắng phân cách rõ nét với nút tròn
  },

  badgeText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: 'bold',
  },
});

export default FloatingCartButton;
