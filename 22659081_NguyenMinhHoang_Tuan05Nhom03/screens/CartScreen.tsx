import React from 'react';
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

export interface CartItem {
  id: string;
  title: string;
  price: string;
  priceNum: number;
  quantity: number;
  coverUrl: string;
}

export interface CartScreenProps {
  items: CartItem[];
  onUpdateQuantity: (id: string, delta: number) => void;
  onRemoveItem: (id: string) => void;
  onCheckout: () => void;
}

/**
 * Màn hình Giỏ hàng:
 * 
 * Yêu cầu kỹ thuật:
 * • Mỗi dòng sản phẩm: flexDirection: 'row', alignItems: 'center'
 *   - Ảnh cố định (54x72, borderRadius: 6)
 *   - Tên sản phẩm flex: 1 (chiếm không gian giữa)
 *   - Bộ chọn số lượng + Giá tiền có width cố định bên phải
 * • Danh sách cuộn được (ScrollView với flex: 1)
 * • Phần tổng tiền + nút 'Thanh toán' KHÔNG cuộn, nằm cố định ngay trên Tab Bar
 * • Toàn màn hình xử lý đủ 3 vùng: Nội dung cuộn ở giữa, Thanh tổng tiền cố định, Tab Bar cố định.
 */
export const CartScreen: React.FC<CartScreenProps> = ({
  items,
  onUpdateQuantity,
  onRemoveItem,
  onCheckout,
}) => {
  // Tính tổng tiền tự động
  const totalPrice = items.reduce(
    (sum, item) => sum + item.priceNum * item.quantity,
    0
  );

  const formattedTotal = totalPrice.toLocaleString('vi-VN') + ' đ';

  return (
    <View style={styles.cartContainer}>
      {/* ======================================================== */}
      {/* VÙNG 1: NỘI DUNG CUỘN Ở GIỮA (ScrollView với flex: 1)     */}
      {/* ======================================================== */}
      <ScrollView
        style={styles.scrollArea}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.headerTitleRow}>
          <Text style={styles.headerTitle}>Giỏ hàng ({items.length} đầu sách)</Text>
          {items.length > 0 && (
            <Text style={styles.headerSubtitle}>
              Tổng số lượng: {items.reduce((s, i) => s + i.quantity, 0)} cuốn
            </Text>
          )}
        </View>

        {items.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="cart-outline" size={64} color="#CBD5E1" />
            <Text style={styles.emptyText}>Giỏ hàng của bạn đang trống</Text>
          </View>
        ) : (
          items.map((item) => (
            <View key={item.id} style={styles.cartItemRow}>
              {/* 1. Ảnh bìa nhỏ cố định */}
              <Image
                source={{ uri: item.coverUrl }}
                style={styles.itemImage}
                resizeMode="cover"
              />

              {/* 2. Phần thông tin ở giữa: flex: 1 */}
              <View style={styles.itemInfo}>
                <Text style={styles.itemTitle} numberOfLines={2}>
                  {item.title}
                </Text>
                <Text style={styles.itemUnitPrice}>{item.price}</Text>

                {/* Bộ nút tăng / giảm số lượng */}
                <View style={styles.quantityControl}>
                  <TouchableOpacity
                    style={styles.qtyBtn}
                    onPress={() => onUpdateQuantity(item.id, -1)}
                  >
                    <Ionicons name="remove" size={14} color="#475569" />
                  </TouchableOpacity>
                  <Text style={styles.qtyValue}>{item.quantity}</Text>
                  <TouchableOpacity
                    style={styles.qtyBtn}
                    onPress={() => onUpdateQuantity(item.id, 1)}
                  >
                    <Ionicons name="add" size={14} color="#475569" />
                  </TouchableOpacity>

                  {/* Nút xóa item */}
                  <TouchableOpacity
                    style={styles.deleteBtn}
                    onPress={() => onRemoveItem(item.id)}
                  >
                    <Ionicons name="trash-outline" size={16} color="#EF4444" />
                  </TouchableOpacity>
                </View>
              </View>

              {/* 3. Tổng giá cho từng item (width cố định bên phải) */}
              <View style={styles.itemPriceColumn}>
                <Text style={styles.itemTotalPrice}>
                  {(item.priceNum * item.quantity).toLocaleString('vi-VN')} đ
                </Text>
              </View>
            </View>
          ))
        )}
      </ScrollView>

      {/* ======================================================== */}
      {/* VÙNG 2: THANH TỔNG TIỀN + NÚT THANH TOÁN (CỐ ĐỊNH PHÍA DƯỚI,*/}
      {/*        KHÔNG CUỘN, NẰM NGAY TRÊN TAB BAR)                */}
      {/* ======================================================== */}
      <View style={styles.checkoutBar}>
        {/* Bên trái: Thông tin tổng tiền */}
        <View style={styles.totalInfo}>
          <Text style={styles.totalLabel}>Tổng thanh toán:</Text>
          <Text style={styles.totalAmount}>{formattedTotal}</Text>
        </View>

        {/* Bên phải: Nút thanh toán */}
        <TouchableOpacity
          activeOpacity={0.8}
          style={[
            styles.checkoutBtn,
            items.length === 0 && styles.checkoutBtnDisabled,
          ]}
          disabled={items.length === 0}
          onPress={onCheckout}
        >
          <Text style={styles.checkoutBtnText}>Thanh toán</Text>
          <Ionicons name="arrow-forward" size={18} color="#FFFFFF" style={{ marginLeft: 4 }} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  cartContainer: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },

  // Vùng 1: Cuộn được ở giữa
  scrollArea: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 20,
  },
  headerTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginBottom: 14,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0F172A',
  },
  headerSubtitle: {
    fontSize: 13,
    color: '#64748B',
  },

  // ==========================================
  // Dòng sản phẩm theo đúng Yêu cầu kỹ thuật
  // ==========================================
  cartItemRow: {
    flexDirection: 'row', // Sắp xếp theo hàng ngang
    alignItems: 'center', // Căn giữa theo trục chéo
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },

  // Ảnh bìa nhỏ cố định
  itemImage: {
    width: 56,
    height: 76,
    borderRadius: 6,
    backgroundColor: '#E2E8F0',
  },

  // Tên sản phẩm flex: 1 chiếm không gian ở giữa
  itemInfo: {
    flex: 1,
    marginLeft: 12,
    marginRight: 8,
    justifyContent: 'center',
  },
  itemTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1E293B',
    lineHeight: 19,
    marginBottom: 3,
  },
  itemUnitPrice: {
    fontSize: 12,
    color: '#64748B',
    marginBottom: 6,
  },

  quantityControl: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  qtyBtn: {
    width: 26,
    height: 26,
    borderRadius: 4,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#CBD5E1',
  },
  qtyValue: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#0F172A',
    minWidth: 20,
    textAlign: 'center',
  },
  deleteBtn: {
    padding: 5,
    marginLeft: 8,
  },

  // Giá thành tiền có width cố định bên phải
  itemPriceColumn: {
    width: 86,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  itemTotalPrice: {
    fontSize: 14,
    fontWeight: '700',
    color: '#16A34A',
  },

  emptyContainer: {
    paddingVertical: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    marginTop: 12,
    fontSize: 15,
    color: '#94A3B8',
  },

  // ==========================================
  // Vùng 2: Thanh tổng tiền + Thanh toán CỐ ĐỊNH
  // ==========================================
  checkoutBar: {
    height: 72,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    flexDirection: 'row', // Sắp xếp ngang
    justifyContent: 'space-between', // Đẩy tổng tiền sang trái, nút sang phải
    alignItems: 'center',
    paddingHorizontal: 16,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  totalInfo: {
    flexDirection: 'column',
  },
  totalLabel: {
    fontSize: 12,
    color: '#64748B',
    marginBottom: 2,
  },
  totalAmount: {
    fontSize: 19,
    fontWeight: 'bold',
    color: '#EF4444', // Màu đỏ nổi bật cho tổng tiền
  },
  checkoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1A237E', // Màu Navy / Indigo
    paddingVertical: 12,
    paddingHorizontal: 22,
    borderRadius: 8,
    elevation: 2,
  },
  checkoutBtnDisabled: {
    backgroundColor: '#94A3B8',
  },
  checkoutBtnText: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
});

export default CartScreen;
