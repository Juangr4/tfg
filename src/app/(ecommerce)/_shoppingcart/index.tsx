"use client";

import {
  type selectImageSchemaType,
  type selectProductSchemaType,
} from "@/lib/types";
import { createContext, useContext, useState, type ReactNode } from "react";

export interface CartItem {
  product: selectProductSchemaType;
  image?: selectImageSchemaType;
  amount: number;
}

interface ShoppingCartContextType {
  cartItems: CartItem[];
  isInCart: (product: selectProductSchemaType) => CartItem | undefined;
  addToCart: (
    product: selectProductSchemaType,
    image?: selectImageSchemaType,
    amount?: number
  ) => void;
  removeFromCart: (product: selectProductSchemaType, amount?: number) => void;
}

const ShoppingCartContext = createContext<ShoppingCartContextType | null>(null);

export const ShoppingCartProvider = ({ children }: { children: ReactNode }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  const isInCart = (product: selectProductSchemaType) => {
    return cartItems.find((item) => item.product.id === product.id);
  };

  const addToCart = (
    product: selectProductSchemaType,
    image?: selectImageSchemaType,
    amount: number = 1
  ) => {
    const item = isInCart(product);
    if (item) {
      setCartItems(
        cartItems.map((item) =>
          item.product.id === product.id
            ? {
                product,
                amount: item.amount + amount,
                image: image ?? item.image,
              }
            : item
        )
      );
    } else {
      setCartItems([...cartItems, { product, image, amount }]);
    }
    console.log("Added product");
    console.log(cartItems);
  };

  const removeFromCart = (
    product: selectProductSchemaType,
    amount: number = 1
  ) => {
    const item = isInCart(product);
    if (!item) return;
    if (item.amount <= amount) {
      setCartItems(cartItems.filter((item) => item.product.id !== product.id));
    } else {
      setCartItems(
        cartItems.map((item) =>
          item.product.id === product.id
            ? {
                product,
                amount: item.amount - amount,
              }
            : item
        )
      );
    }
  };

  return (
    <ShoppingCartContext.Provider
      value={{
        cartItems,
        isInCart,
        addToCart,
        removeFromCart,
      }}
    >
      {children}
    </ShoppingCartContext.Provider>
  );
};

export const useShoppingCart = () => {
  const context = useContext<ShoppingCartContextType | null>(
    ShoppingCartContext
  );
  if (!context)
    throw new Error(
      "The Shopping Cart Hook requires a Shopping Cart Provider as context"
    );
  return {
    cartItems: context.cartItems,
    isInCart: context.isInCart,
    addToCart: context.addToCart,
    removeFromCart: context.removeFromCart,
  };
};
