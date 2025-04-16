import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
// import { AuthProvider } from "@/contexts/AuthContext"
import { Toaster } from "sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Prime Logic Solutions",
  description: "A platform for freelancers and clients",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
      <link rel="icon" href="/favicon.ico" />
      </head>
      <body className={inter.className}>
        <MobileRestriction>{children}</MobileRestriction>
        <Toaster />
      </body>
    </html>
  );
}

import "./globals.css";
import MobileRestriction from "@/components/MobileRestriction";
