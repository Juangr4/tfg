"use client";

import { Button } from "@/components/ui/button";
import {
  type selectImageSchemaType,
  type selectProductSchemaType,
} from "@/lib/types";
import { MinusIcon, PlusIcon } from "lucide-react";
import { type FC } from "react";
import { useCartStore } from "../../_shoppingcart";

interface ActionsMenuProps {
  product: selectProductSchemaType;
  image?: selectImageSchemaType;
}

export const ActionsMenu: FC<ActionsMenuProps> = ({ product, image }) => {
  const addToCart = useCartStore((store) => store.addToCart);
  const removeFromCart = useCartStore((store) => store.removeFromCart);
  const isInCart = useCartStore((store) => store.isInCart);
  // Used to perform a re-render on cart change.
  const cartItems = useCartStore((store) => store.cartItems);

  const itemIn = isInCart(product);
  return (
    <div className="text-xl grid grid-cols-4 place-items-center gap-2">
      {!itemIn && (
        <Button
          onClick={() => {
            addToCart(product, image);
          }}
          className="col-span-4 w-full"
        >
          Add to cart
        </Button>
      )}
      {itemIn && (
        <>
          <p className="col-span-2 text-lg font-medium">
            {itemIn.amount} already in the cart.
          </p>
          <Button
            onClick={() => {
              addToCart(product, image);
            }}
            className="w-full"
          >
            <PlusIcon />
          </Button>
          <Button
            onClick={() => {
              removeFromCart(product, 1);
            }}
            className="w-full"
          >
            <MinusIcon />
          </Button>
        </>
      )}
    </div>
  );
};
