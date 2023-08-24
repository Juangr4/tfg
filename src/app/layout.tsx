import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import TRPCProvider from "./_trpc/provider";
import "./globals.css";

const montserrat = Montserrat({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "What a commerce",
  description: "Best ecommerce website",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={montserrat.className}>
        <TRPCProvider>{children}</TRPCProvider>
      </body>
    </html>
  );
}
