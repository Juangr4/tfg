"use client";

import { trpc } from "@/app/_trpc/client";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { signIn, useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCartStore } from "../_shoppingcart";
import { ItemPreview } from "./item-preview";

export const CartPreview = () => {
  const cartItems = useCartStore((store) => store.cartItems);
  const { data: session } = useSession();
  const router = useRouter();

  const subtotal = cartItems
    .map((item) => item.product.price * item.amount)
    .reduce((acc, current) => acc + current, 0);

  const { mutate, isLoading } = trpc.orders.create.useMutation();

  const performPayment = () => {
    mutate(cartItems, {
      onSuccess(data, variables, context) {
        if (data) {
          router.push(data);
        }
      },
    });
  };

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
      {!session?.user && (
        <p>
          <Button
            onClick={async () => {
              await signIn();
            }}
            variant={"link"}
            className="p-0 text-blue-900"
          >
            Click here
          </Button>{" "}
          to login.
        </p>
      )}
      {cartItems.length === 0 && (
        <p>
          You must add some products to buy.{" "}
          <Button variant={"link"} className="p-0 text-blue-900">
            <Link href={"/products"}>Click here to go</Link>
          </Button>
        </p>
      )}
      <Button
        onClick={performPayment}
        disabled={isLoading || cartItems.length === 0 || !session?.user}
      >
        Checkout
      </Button>
    </div>
  );
};
