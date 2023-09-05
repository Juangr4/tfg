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
import { CheckIcon, PlusIcon, ShoppingCartIcon } from "lucide-react";
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
  const isInCart = useCartStore((store) => store.isInCart);
  // Added cartItems to enforce a re-render when it changes.
  const cartItems = useCartStore((store) => store.cartItems);

  const isIn = isInCart(product) !== undefined;

  return (
    <Card
      onClick={() => {
        router.push(`/products/${product.id}`);
      }}
      className="w-full hover:cursor-pointer grid p-2"
    >
      <CardContent className="grid place-items-center border h-full">
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
        <Button
          onClick={(event) => {
            event.stopPropagation();
            addToCart(product, image ?? undefined);
          }}
          variant={isIn ? "link" : "default"}
        >
          <ShoppingCartIcon />
          {isIn ? (
            <CheckIcon className="h-4 w-4" />
          ) : (
            <PlusIcon className="h-4 w-4" />
          )}
        </Button>
      </CardHeader>
    </Card>
  );
};

export default EcommerceCard;
