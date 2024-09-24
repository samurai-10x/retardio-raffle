import type { Metadata } from "next";
import { Laila } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Toaster } from "@/components/ui/sonner";

import { cookieToInitialState } from "wagmi";

import { config } from "@/configs";
import Web3ModalProvider from "@/contexts/Web3Modal";
import Nav from "@/components/Nav";

const laila = Laila({ subsets: ["latin"], weight: ["300", "400", "500", "600", "700"], variable: "--font-laila" });

const detacher = localFont({
  src: "./fonts/detacher.otf",
  variable: "--font-detacher",
});

export const metadata: Metadata = {
  title: "Unique NFTs",
  description: "Explore, buy, and sell extraordinary NFTs on our decentralized marketplace.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // const initialState = cookieToInitialState(config, headers().get("cookie")) || null;

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn("bg-secondary", laila.variable, detacher.variable)}>
        <Web3ModalProvider>
          <Nav />
          {children}
        </Web3ModalProvider>
      </body>
      <Toaster richColors />
    </html>
  );
}
