import type { Metadata } from "next";
import "./globals.css";
import { Onest } from "next/font/google";
import Navbar from "@/components/shared/Navbar";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: "Slot Sync - Dashboard",
  description: "Manage your slot bookings efficiently",
};

const onest = Onest({
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${onest.className} antialiased`}>
        <Navbar />
        {children}
        <Toaster richColors />
      </body>
    </html>
  );
}
