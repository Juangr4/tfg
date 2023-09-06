"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { imageHref } from "@/lib/utils";
import { ShoppingCartIcon, TrashIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useCartStore } from "../_shoppingcart";

const ShoppingCartMenu = () => {
  const cartItems = useCartStore((state) => state.cartItems);
  const removeFromCart = useCartStore((state) => state.removeFromCart);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="p-4 relative">
        <ShoppingCartIcon />
        <span className="absolute top-1 right-2 rounded-md">
          {cartItems.length}
        </span>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {cartItems.length === 0 && (
          <DropdownMenuLabel>No products in cart</DropdownMenuLabel>
        )}
        {cartItems.map((item) => (
          <DropdownMenuLabel
            key={item.product.id}
            className="flex items-center gap-4"
          >
            <div className="h-full w-auto">
              <Image
                src={imageHref(item.image)}
                alt=""
                width={64}
                height={64}
              />
            </div>
            <div>
              <p className="capitalize">{item.product.name}</p>
              <p className="text-xs font-thin">Amount: {item.amount}</p>
            </div>
            <Button
              variant={"ghost"}
              onClick={() => {
                removeFromCart(item.product, item.amount);
              }}
              className="p-2"
            >
              <TrashIcon className="h-4 w-4 text-red-600" />
            </Button>
          </DropdownMenuLabel>
        ))}
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Button variant={"secondary"} className="m-2 cursor-pointer" asChild>
            <Link href={"/checkout"}>Checkout</Link>
          </Button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ShoppingCartMenu;
