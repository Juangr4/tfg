"use client";

import { useEffect } from "react";
import { useCartStore } from "./_shoppingcart";
import Footer from "./footer";
import MainHeader from "./header";
import Navbar from "./navbar";

export const revalidate = 0;
export const fetchCache = "default-no-store";

export default function EcommerceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const loadCartItems = useCartStore((state) => state.load);

  useEffect(() => {
    loadCartItems();
  }, []);

  return (
    <div className="flex flex-col h-screen">
      <MainHeader />
      <Navbar />
      <main className="w-full grid place-items-center h-full">{children}</main>
      <Footer />
    </div>
  );
}
