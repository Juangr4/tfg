import {
  cartItem,
  selectImageSchema,
  type selectImageSchemaType,
  type selectProductSchemaType,
} from "@/lib/types";
import { z } from "zod";
import { create } from "zustand";

export const CartItemWithPhoto = cartItem.augment({
  image: selectImageSchema.optional(),
});
export type CartItemWithPhotoType = z.infer<typeof CartItemWithPhoto>;

interface State {
  cartItems: CartItemWithPhotoType[];
  isInCart: (
    product: selectProductSchemaType
  ) => CartItemWithPhotoType | undefined;
  addToCart: (
    product: selectProductSchemaType,
    image?: selectImageSchemaType,
    amount?: number
  ) => void;
  removeFromCart: (product: selectProductSchemaType, amount?: number) => void;
  clearCart: () => void;
  loaded: boolean;
  load: () => void;
  save: () => void;
}

export const useCartStore = create<State>()((set, get) => ({
  cartItems: [],
  loaded: false,
  isInCart: (product) =>
    get().cartItems.find((item) => item.product.id === product.id),
  addToCart: (product, image, amount = 1) => {
    const item = get().isInCart(product);
    if (item) {
      set((state) => ({
        cartItems: state.cartItems.map((item) =>
          item.product.id === product.id
            ? {
                product,
                amount: item.amount + amount,
                image: image ?? item.image,
              }
            : item
        ),
      }));
    } else {
      set((state) => ({
        cartItems: [...state.cartItems, { product, image, amount }],
      }));
    }
    get().save();
  },
  removeFromCart: (product, amount = 1) => {
    const item = get().isInCart(product);
    if (!item) return;
    if (item.amount <= amount) {
      set((state) => ({
        cartItems: state.cartItems.filter(
          (item) => item.product.id !== product.id
        ),
      }));
    } else {
      set((state) => ({
        cartItems: state.cartItems.map((item) =>
          item.product.id === product.id
            ? { product, amount: item.amount - amount }
            : item
        ),
      }));
    }
    get().save();
  },
  clearCart: () => {
    set((state) => ({ cartItems: [] }));
    get().save();
  },
  load: () => {
    if (get().loaded) return;
    try {
      const cartItems = z
        .array(CartItemWithPhoto)
        .parse(JSON.parse(localStorage.getItem("cartItems") ?? "[]"));
      set((state) => ({ cartItems, loaded: true }));
    } catch (error) {
      console.log("Shopping Cart Corrupted");
      set((state) => ({ loaded: true }));
    }
  },
  save: () => {
    localStorage.setItem("cartItems", JSON.stringify(get().cartItems));
  },
}));
