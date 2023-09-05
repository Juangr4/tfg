"use client";

import { useCartStore } from "@/app/(ecommerce)/_shoppingcart";

export const ClearCart = () => {
  const clearCart = useCartStore((store) => store.clearCart);
  clearCart();
  return null;
};
