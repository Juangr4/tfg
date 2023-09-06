"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  type selectImageSchemaType,
  type selectProductSchemaType,
} from "@/lib/types";
import { imageHref } from "@/lib/utils";
import { Separator } from "@radix-ui/react-dropdown-menu";
import { MinusIcon, PlusIcon, ShoppingCartIcon } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { type FC } from "react";
import { useCartStore } from "../_shoppingcart";

interface EcommerceCardProps {
  product: selectProductSchemaType;
  image: selectImageSchemaType | null;
}

const EcommerceCard: FC<EcommerceCardProps> = ({ product, image }) => {
  const router = useRouter();

  const addToCart = useCartStore((store) => store.addToCart);
  const removeFromCart = useCartStore((store) => store.removeFromCart);
  const isInCart = useCartStore((store) => store.isInCart);
  // Added cartItems to enforce a re-render when it changes.
  const cartItems = useCartStore((store) => store.cartItems);

  const productIn = isInCart(product);

  return (
    <Card
      onClick={() => {
        router.push(`/products/${product.id}`);
      }}
      className="w-full hover:cursor-pointer grid p-2"
    >
      <CardContent className="grid place-items-center h-full">
        <div className="grid place-items-center">
          <Image
            src={imageHref(image)}
            alt={product.name}
            width="512"
            height="512"
            layout="responsive"
          />
        </div>
        <Separator />
      </CardContent>
      <CardHeader>
        <CardTitle>{product.name}</CardTitle>
        <CardDescription>${product.price}</CardDescription>
        {!productIn && (
          <Button
            onClick={(event) => {
              event.stopPropagation();
              addToCart(product, image ?? undefined);
            }}
            variant={"default"}
          >
            <ShoppingCartIcon />
            <PlusIcon className="h-4 w-4" />
          </Button>
        )}
        {productIn && (
          <>
            <div className="grid grid-cols-2">
              <Button
                variant={"link"}
                onClick={(ev) => {
                  ev.stopPropagation();
                  addToCart(product, image ?? undefined, 1);
                }}
              >
                <ShoppingCartIcon />
                <PlusIcon />
              </Button>
              <Button
                variant={"link"}
                onClick={(ev) => {
                  ev.stopPropagation();
                  removeFromCart(product, 1);
                }}
              >
                <ShoppingCartIcon />
                <MinusIcon />
              </Button>
            </div>
            <div>
              <p className="border rounded-md p-2 text-md font-semibold text-center">
                {productIn.amount} inside the cart.
              </p>
            </div>
          </>
        )}
      </CardHeader>
    </Card>
  );
};

export default EcommerceCard;
