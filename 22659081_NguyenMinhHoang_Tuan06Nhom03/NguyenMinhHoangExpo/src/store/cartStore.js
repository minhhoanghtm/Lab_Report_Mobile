import { create } from "zustand";

export const useCartStore = create((set, get) => ({
  items: [],

  // Thêm sách vào giỏ
  addToCart: (book) => {
    set((state) => {
      const existingItem = state.items.find(
        (item) => item.bookId === book.id
      );

      if (existingItem) {
        return {
          items: state.items.map((item) =>
            item.bookId === book.id
              ? {
                  ...item,
                  quantity: item.quantity + 1,
                }
              : item
          ),
        };
      }

      return {
        items: [
          ...state.items,
          {
            bookId: book.id,
            title: book.title,
            price: book.price,
            quantity: 1,
          },
        ],
      };
    });
  },

  // Xóa sản phẩm
  removeFromCart: (bookId) => {
    set((state) => ({
      items: state.items.filter(
        (item) => item.bookId !== bookId
      ),
    }));
  },

  // Cập nhật số lượng
  updateQuantity: (bookId, quantity) => {
    if (quantity <= 0) {
      get().removeFromCart(bookId);
      return;
    }

    set((state) => ({
      items: state.items.map((item) =>
        item.bookId === bookId
          ? {
              ...item,
              quantity,
            }
          : item
      ),
    }));
  },

  // Tổng số lượng sách
  getTotalQuantity: () => {
    return get().items.reduce(
      (total, item) => total + item.quantity,
      0
    );
  },

  // Tổng tiền
  getTotalPrice: () => {
    return get().items.reduce(
      (total, item) =>
        total + item.price * item.quantity,
      0
    );
  },

  // Xóa toàn bộ giỏ
  clearCart: () => {
    set({
      items: [],
    });
  },
}));