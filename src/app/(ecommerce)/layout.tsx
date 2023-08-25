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
    <div className="flex flex-col h-screen">
      <MainHeader />
      <Navbar />
      <main className="w-full flex justify-center">{children}</main>
    </div>
  );
}
