import { useCartStore } from "../store/cartStore";

export function useCart() {
  const items = useCartStore((state) => state.items);
  const addToCart = useCartStore(
    (state) => state.addToCart
  );
  const removeFromCart = useCartStore(
    (state) => state.removeFromCart
  );
  const updateQuantity = useCartStore(
    (state) => state.updateQuantity
  );
  const getTotalQuantity = useCartStore(
    (state) => state.getTotalQuantity
  );
  const getTotalPrice = useCartStore(
    (state) => state.getTotalPrice
  );
  const clearCart = useCartStore(
    (state) => state.clearCart
  );

  return {
    items,

    addToCart,
    removeFromCart,
    updateQuantity,

    totalQuantity: getTotalQuantity(),
    totalPrice: getTotalPrice(),

    clearCart,
  };
}