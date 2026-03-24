import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist",
});

export const metadata: Metadata = {
  title: "Sparky Tech Tac Toe",
  description: "A binary twist on the classic game with 1s and 0s.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${geist.variable} dark`}>
      <head>
        <link rel="icon" href="/icon1.png" type="image/png" sizes="32x32" />
      </head>
      <body className="antialiased bg-black text-white font-sans">{children}</body>
    </html>
  );
}
