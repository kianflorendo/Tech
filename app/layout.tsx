import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Sparky Tech Tac Toe",
  description: "A binary twist on the classic game with 1s and 0s.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="icon" href="/icon1.png" type="image/png" sizes="32x32" />
        <link
          href="https://fonts.googleapis.com/css2?family=Geist:wght@100..900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased bg-black text-white">{children}</body>
    </html>
  );
}
