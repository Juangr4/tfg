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
import { ShoppingCartIcon } from "lucide-react";
import Link from "next/link";

const ShoppingCartMenu = () => {
  const cartProducts = [];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="p-4 relative">
        <ShoppingCartIcon />
        <span className="absolute top-1 right-2 rounded-md">
          {cartProducts.length}
        </span>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {cartProducts.length === 0 && (
          <DropdownMenuLabel>No products in cart</DropdownMenuLabel>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Button variant={"ghost"} className="m-2" asChild>
            <Link href={"/checkout"}>Checkout</Link>
          </Button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ShoppingCartMenu;
