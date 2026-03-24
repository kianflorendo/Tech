"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { User, Cpu } from "lucide-react";

type GameMode = "pvp" | "pve";
type Difficulty = "easy" | "medium" | "hard";

interface GameModeSelectorProps {
  open: boolean;
  onSelect: (mode: GameMode, difficulty: Difficulty) => void;
  onClose?: () => void;
}

export default function GameModeSelector({
  open,
  onSelect,
  onClose,
}: GameModeSelectorProps) {
  const [mode, setMode] = useState<GameMode>("pve");
  const [difficulty, setDifficulty] = useState<Difficulty>("medium");

  const handleStart = () => {
    onSelect(mode, difficulty);
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen && onClose) {
      onClose();
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md bg-zinc-950 border border-zinc-800 shadow-2xl rounded-3xl overflow-hidden p-0">
        <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-transparent via-sky-500 to-transparent opacity-30" />
        
        <div className="p-8">
          <DialogHeader className="mb-8 items-center text-center sm:text-center">
            <DialogTitle className="text-3xl font-black text-white tracking-tight">
              Select <span className="text-sky-400">Mode</span>
            </DialogTitle>
            <DialogDescription className="text-zinc-400 font-medium pt-2">
              Choose how you want to play Sparky Tech Tac Toe
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-2 gap-4 py-2">
            <button
              type="button"
              onClick={() => setMode("pvp")}
              className={cn(
                "flex flex-col items-center justify-center p-6 rounded-2xl border-2 transition-all duration-300 space-y-3 group relative overflow-hidden",
                mode === "pvp"
                  ? "border-sky-500 bg-sky-500/10 text-white shadow-[0_0_20px_rgba(14,165,233,0.15)] scale-[1.02]"
                  : "border-zinc-800 bg-zinc-900/50 text-zinc-500 hover:border-zinc-700 hover:bg-zinc-800/50"
              )}
            >
              <div
                className={cn(
                  "p-4 rounded-xl transition-all duration-300",
                  mode === "pvp" ? "bg-sky-500 text-black shadow-lg rotate-0" : "bg-zinc-800 group-hover:bg-zinc-700 -rotate-3"
                )}
              >
                <User size={32} strokeWidth={2.5} />
              </div>
              <span className="font-black text-sm tracking-widest uppercase">Vs Player</span>
              {mode === "pvp" && (
                <motion.div 
                  layoutId="mode-indicator"
                  className="absolute bottom-0 left-0 w-full h-1 bg-sky-500"
                />
              )}
            </button>

            <button
              type="button"
              onClick={() => setMode("pve")}
              className={cn(
                "flex flex-col items-center justify-center p-6 rounded-2xl border-2 transition-all duration-300 space-y-3 group relative overflow-hidden",
                mode === "pve"
                  ? "border-sky-500 bg-sky-500/10 text-white shadow-[0_0_20px_rgba(14,165,233,0.15)] scale-[1.02]"
                  : "border-zinc-800 bg-zinc-900/50 text-zinc-500 hover:border-zinc-700 hover:bg-zinc-800/50"
              )}
            >
              <div
                className={cn(
                  "p-4 rounded-xl transition-all duration-300",
                  mode === "pve" ? "bg-sky-500 text-black shadow-lg rotate-0" : "bg-zinc-800 group-hover:bg-zinc-700 rotate-3"
                )}
              >
                <Cpu size={32} strokeWidth={2.5} />
              </div>
              <span className="font-black text-sm tracking-widest uppercase">Vs Sparky</span>
              {mode === "pve" && (
                <motion.div 
                  layoutId="mode-indicator"
                  className="absolute bottom-0 left-0 w-full h-1 bg-sky-500"
                />
              )}
            </button>
          </div>

          <AnimatePresence initial={false}>
            {mode === "pve" && (
              <motion.div 
                key="difficulty-section"
                initial={{ opacity: 0, height: 0, marginTop: 0 }}
                animate={{ opacity: 1, height: "auto", marginTop: 32 }}
                exit={{ opacity: 0, height: 0, marginTop: 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="overflow-hidden space-y-4"
              >
                <p className="text-xs font-black text-zinc-500 text-center uppercase tracking-[0.2em]">
                  Select Difficulty
                </p>
                <div className="flex justify-center gap-2">
                  {(["easy", "medium", "hard"] as Difficulty[]).map((d) => (
                    <button
                      key={d}
                      type="button"
                      onClick={() => setDifficulty(d)}
                      className={cn(
                        "flex-1 px-4 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all duration-200 border-2",
                        difficulty === d
                          ? "bg-white text-black border-white shadow-[0_0_15px_rgba(255,255,255,0.2)]"
                          : "bg-zinc-900 text-zinc-500 border-zinc-800 hover:border-zinc-700 hover:text-zinc-300"
                      )}
                    >
                      {d}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <DialogFooter className="mt-10">
            <Button
              onClick={handleStart}
              className="w-full bg-sky-500 hover:bg-sky-400 text-black py-7 text-xl font-black rounded-2xl shadow-[0_8px_30px_rgba(14,165,233,0.3)] hover:shadow-[0_12px_40px_rgba(14,165,233,0.4)] transition-all transform hover:scale-[1.02] active:scale-[0.98]"
            >
              INITIALIZE GAME
            </Button>
          </DialogFooter>

        </div>
      </DialogContent>
    </Dialog>
  );
}
