import type React from "react";
// Game types
export type GameType = "home" | "tech-tac-toe";

// Social QR code types
export type SocialQRCode = {
  name: string;
  icon: React.ReactNode;
  color: string;
  url: string;
};

// Tech Tac Toe types
export type Player = "1" | "0";
export type BoardState = (Player | null)[];
export type WinPattern = [number, number, number];
