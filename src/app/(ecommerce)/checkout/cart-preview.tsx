"use client";

import { Separator } from "@/components/ui/separator";
import { useShoppingCart } from "../_shoppingcart";
import { ItemPreview } from "./item-preview";

export const CartPreview = () => {
  const { cartItems } = useShoppingCart();

  const subtotal = cartItems
    .map((item) => item.product.price * item.amount)
    .reduce((acc, current) => acc + current, 0);

  return (
    <div className="flex flex-col items-center p-2 gap-4">
      <div className="w-full grid gap-4">
        {cartItems.map((item) => (
          <ItemPreview key={item.product.id} item={item} />
        ))}
      </div>
      <div className="grid grid-cols-2 gap-2 w-full">
        <div className="text-left">Subtotal:</div>
        <div className="text-right mr-4 font-semibold">${subtotal}</div>
        <div className="text-left">Taxes:</div>
        <div className="text-right mr-4 font-semibold">$0</div>
        <div className="text-left">Shipping:</div>
        <div className="text-right mr-4 font-semibold">$0</div>
      </div>
      <Separator />
      <div className="grid grid-cols-2 w-full gap-2">
        <div className="text-left font-semibold">Total:</div>
        <div className="text-right mr-4 font-semibold">${subtotal}</div>
      </div>
    </div>
  );
};
