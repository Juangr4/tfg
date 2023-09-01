import {
  selectImageSchema,
  selectProductSchema,
  type selectImageSchemaType,
  type selectProductSchemaType,
} from "@/lib/types";
import { z } from "zod";
import { create } from "zustand";

export const CartItem = z.object({
  product: selectProductSchema,
  image: selectImageSchema.optional(),
  amount: z.number().gte(0),
});
export type CartItemType = z.infer<typeof CartItem>;

interface State {
  cartItems: CartItemType[];
  isInCart: (product: selectProductSchemaType) => CartItemType | undefined;
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
  },
  load: () => {
    if (get().loaded) return;
    try {
      const cartItems = z
        .array(CartItem)
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
