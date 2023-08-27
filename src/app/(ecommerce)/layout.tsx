import { ShoppingCartProvider } from "./_shoppingcart";
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
  return (
    <ShoppingCartProvider>
      <div className="flex flex-col h-screen">
        <MainHeader />
        <Navbar />
        <main className="w-full flex-1 justify-center h-auto">{children}</main>
        <Footer />
      </div>
    </ShoppingCartProvider>
  );
}
