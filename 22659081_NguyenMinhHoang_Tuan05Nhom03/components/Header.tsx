import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export interface HeaderProps {
  appName?: string;
  onSearchPress?: () => void;
  onCartPress?: () => void;
  cartCount?: number;
}

/**
 * Bài tập 1: Header ứng dụng BookStore
 * 
 * Yêu cầu kỹ thuật:
 * • Container header dùng flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'.
 * • Padding ngang 16, chiều cao cố định 56.
 * • Nền header dùng màu navy/indigo theo bảng màu chung của khóa học (#1A237E).
 * • Gợi ý: Hai icon bên phải đặt trong một View con dùng flexDirection: 'row' với khoảng cách (gap hoặc marginLeft).
 */
export const Header: React.FC<HeaderProps> = ({
  appName = 'BookStore',
  onSearchPress,
  onCartPress,
  cartCount = 2,
}) => {
  return (
    <View style={styles.headerContainer}>
      {/* 1. Khối bên trái: Logo / Tên ứng dụng */}
      <View style={styles.leftContainer}>
        <Ionicons name="book" size={24} color="#FFFFFF" style={styles.logoIcon} />
        <Text style={styles.appNameText}>{appName}</Text>
      </View>

      {/* 2. Khối bên phải (Gợi ý): View con dùng flexDirection: 'row' */}
      <View style={styles.rightActionsContainer}>
        {/* Nút / Icon Tìm kiếm */}
        <TouchableOpacity
          accessibilityLabel="Tìm kiếm"
          accessibilityRole="button"
          activeOpacity={0.7}
          style={styles.actionButton}
          onPress={onSearchPress}
        >
          <Ionicons name="search" size={22} color="#FFFFFF" />
        </TouchableOpacity>

        {/* Nút / Icon Giỏ hàng */}
        <TouchableOpacity
          accessibilityLabel="Giỏ hàng"
          accessibilityRole="button"
          activeOpacity={0.7}
          style={styles.actionButton}
          onPress={onCartPress}
        >
          <Ionicons name="cart-outline" size={24} color="#FFFFFF" />
          {cartCount > 0 && (
            <View style={styles.badgeContainer}>
              <Text style={styles.badgeText}>{cartCount}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  // ==========================================
  // Container Header theo đúng Yêu cầu kỹ thuật
  // ==========================================
  headerContainer: {
    height: 56, // Chiều cao cố định 56
    paddingHorizontal: 16, // Padding ngang 16
    backgroundColor: '#1A237E', // Màu Navy / Indigo của khóa học
    flexDirection: 'row', // Sắp xếp các con theo hàng ngang
    justifyContent: 'space-between', // Đẩy logo sang trái, cụm icon sang phải
    alignItems: 'center', // Căn giữa theo trục chéo (chiều dọc)

    // Đổ bóng thẩm mỹ cho header
    elevation: 4, // Android
    shadowColor: '#000', // iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.5,
  },

  // Khối bên trái: Logo + Tên app
  leftContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoIcon: {
    marginRight: 8,
  },
  appNameText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },

  // Khối 2 icon bên phải theo Gợi ý đề bài:
  // "Hai icon bên phải đặt trong một View con dùng flexDirection: 'row' với khoảng cách (gap hoặc marginLeft)"
  rightActionsContainer: {
    flexDirection: 'row', // Hàng ngang
    alignItems: 'center', // Căn giữa theo chiều dọc
    gap: 12, // Khoảng cách giữa 2 icon
  },

  actionButton: {
    padding: 8,
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
  },

  // Badge số lượng hiển thị trên giỏ hàng
  badgeContainer: {
    position: 'absolute',
    top: 2,
    right: 2,
    backgroundColor: '#EF4444',
    borderRadius: 9,
    minWidth: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 3,
    borderWidth: 1.5,
    borderColor: '#1A237E',
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: 'bold',
  },
});

export default Header;
