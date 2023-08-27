import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { imageHref } from "@/lib/utils";
import Image from "next/image";
import { useRef, useState } from "react";
import { useShoppingCart, type CartItem } from "../_shoppingcart";

export const ItemPreview = ({ item }: { item: CartItem }) => {
  const { removeFromCart, addToCart } = useShoppingCart();
  const inputRef = useRef<HTMLInputElement>(null);
  const [editing, setEditing] = useState(false);

  const updateAmount = (inputElement: HTMLInputElement) => {
    const newValue = Number(inputElement.value);
    if (newValue > item.amount) {
      addToCart(item.product, undefined, newValue - item.amount);
    } else if (newValue < item.amount) {
      removeFromCart(item.product, item.amount - newValue);
    } else if (newValue === 0) {
      removeFromCart(item.product, item.amount);
    }
  };

  const blurInput = () => inputRef.current?.blur();
  return (
    <div className="flex gap-6 relative w-full">
      <Image
        src={imageHref(item.image)}
        alt=""
        width={128}
        height={128}
        className="border"
      />
      <div>
        <p className="text-lg font-semibold">{item.product.name}</p>
        <p className="text-lg font-semibold">${item.product.price}</p>
        {!editing && (
          <p className="text-md font-normal">Amount: {item.amount}</p>
        )}
        {editing && (
          <Input
            ref={inputRef}
            type="number"
            placeholder={`Amount: ${item.amount}`}
            onBlur={(ev) => {
              updateAmount(ev.target);
            }}
            onKeyDown={(ev) => {
              if (ev.key === "Enter") blurInput();
            }}
          />
        )}
      </div>
      <div className="flex absolute top-0 right-8">
        <Button
          variant={"link"}
          onClick={() => {
            setEditing(!editing);
          }}
        >
          Edit
        </Button>
        <div className="border-l"></div>
        <Button
          variant={"link"}
          onClick={() => {
            removeFromCart(item.product, item.amount);
          }}
        >
          Remove
        </Button>
      </div>
    </div>
  );
};
