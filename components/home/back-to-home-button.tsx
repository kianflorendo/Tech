"use client";

import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import type { GameType } from "@/lib/types";

type BackToHomeButtonProps = {
  navigateTo: (game: GameType) => void;
  variant?: "sky" | "amber" | "cyan";
};

export default function BackToHomeButton({
  navigateTo,
}: BackToHomeButtonProps) {
  return (
    <Button
      onClick={() => navigateTo("home")}
      variant="ghost"
      className="mb-6 text-zinc-400 hover:text-white hover:bg-zinc-900 flex items-center gap-2 px-0 hover:px-4 transition-all group"
    >
      <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
      <span className="font-bold uppercase tracking-widest text-xs">Back to Hub</span>
    </Button>
  );
}
