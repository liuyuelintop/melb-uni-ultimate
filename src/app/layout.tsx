import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "../styles/globals.css";
import Header from "@shared/components/layout/Header";
import Footer from "@shared/components/layout/Footer";
import { Providers } from "./providers";
import NotificationToaster from "@shared/components/ui/NotificationToaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Melbourne University Ultimate Frisbee Club",
  description:
    "Official website of the Melbourne University Ultimate Frisbee Club. Join us for practices, tournaments, and the ultimate frisbee community.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-50 min-h-screen flex flex-col`}
      >
        <Providers>
          <Header />
          <NotificationToaster />
          <main className="flex-1">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
