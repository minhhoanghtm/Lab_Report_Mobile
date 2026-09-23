import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export type TabKey = 'home' | 'categories' | 'cart' | 'account';

export interface TabItemConfig {
  key: TabKey;
  label: string;
  iconActive: keyof typeof Ionicons.glyphMap;
  iconInactive: keyof typeof Ionicons.glyphMap;
}

const TAB_ITEMS: TabItemConfig[] = [
  {
    key: 'home',
    label: 'Trang chủ',
    iconActive: 'home',
    iconInactive: 'home-outline',
  },
  {
    key: 'categories',
    label: 'Danh mục',
    iconActive: 'grid',
    iconInactive: 'grid-outline',
  },
  {
    key: 'cart',
    label: 'Giỏ hàng',
    iconActive: 'cart',
    iconInactive: 'cart-outline',
  },
  {
    key: 'account',
    label: 'Tài khoản',
    iconActive: 'person',
    iconInactive: 'person-outline',
  },
];

export interface BottomTabBarProps {
  activeTab: TabKey;
  onTabChange: (tab: TabKey) => void;
  cartCount?: number;
  positionMode?: 'fixed-outside' | 'absolute';
}

/**
 * Thanh Tab Bar cố định ở đáy màn hình:
 * 
 * Yêu cầu kỹ thuật:
 * • Container tab bar: flexDirection: 'row', mỗi mục flex: 1 để chia đều 4 phần bằng nhau.
 * • Mỗi mục: flexDirection: 'column', alignItems: 'center', justifyContent: 'center'.
 * • Icon phía trên, chữ phía dưới, mục đang chọn có màu nổi bật.
 * • Hỗ trợ cả 2 cách định vị: đặt cố định ngoài ScrollView HOẶC position: 'absolute'.
 */
export const BottomTabBar: React.FC<BottomTabBarProps> = ({
  activeTab,
  onTabChange,
  cartCount = 0,
  positionMode = 'fixed-outside',
}) => {
  return (
    <View
      style={[
        styles.tabBarContainer,
        positionMode === 'absolute' && styles.tabBarAbsolute,
      ]}
    >
      {TAB_ITEMS.map((item) => {
        const isActive = activeTab === item.key;
        const iconName = isActive ? item.iconActive : item.iconInactive;
        const iconColor = isActive ? '#1A237E' : '#94A3B8';
        const textColor = isActive ? '#1A237E' : '#64748B';

        return (
          <TouchableOpacity
            key={item.key}
            activeOpacity={0.7}
            style={styles.tabItem}
            onPress={() => onTabChange(item.key)}
          >
            {/* View chứa Icon + Badge số lượng nếu là tab Giỏ hàng */}
            <View style={styles.iconWrapper}>
              <Ionicons name={iconName} size={22} color={iconColor} />
              {item.key === 'cart' && cartCount > 0 && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>
                    {cartCount > 99 ? '99+' : cartCount}
                  </Text>
                </View>
              )}
            </View>

            {/* Chữ nhãn bên dưới */}
            <Text
              style={[
                styles.tabLabel,
                { color: textColor },
                isActive && styles.tabLabelActive,
              ]}
            >
              {item.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  // ==========================================
  // Container Tab Bar: flexDirection: 'row'
  // ==========================================
  tabBarContainer: {
    height: 60,
    backgroundColor: '#FFFFFF',
    flexDirection: 'row', // Sắp xếp 4 mục theo hàng ngang
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    elevation: 12, // Đổ bóng nổi trên Android
    shadowColor: '#000', // Đổ bóng trên iOS
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.08,
    shadowRadius: 5,
  },

  // Cách đặt: position: 'absolute' ở đáy màn hình
  tabBarAbsolute: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 100,
  },

  // ==========================================
  // Mỗi mục con: flex: 1, flexDirection: 'column'
  // ==========================================
  tabItem: {
    flex: 1, // Chia đều 4 phần bằng nhau (25% mỗi mục)
    flexDirection: 'column', // Icon trên, chữ dưới
    alignItems: 'center', // Căn giữa trục ngang
    justifyContent: 'center', // Căn giữa trục dọc
    paddingVertical: 6,
  },

  iconWrapper: {
    position: 'relative',
    height: 26,
    justifyContent: 'center',
    alignItems: 'center',
  },

  badge: {
    position: 'absolute',
    top: -4,
    right: -10,
    backgroundColor: '#EF4444',
    borderRadius: 8,
    minWidth: 16,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 3,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: 'bold',
  },

  tabLabel: {
    fontSize: 11,
    fontWeight: '500',
    marginTop: 2,
  },
  tabLabelActive: {
    fontWeight: '700',
  },
});

export default BottomTabBar;
