"use client";

import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import type { BoardState } from "@/lib/types";

type GameBoardProps = {
  board: BoardState;
  winningPattern: number[] | null;
  handleCellClick: (index: number) => void;
};

export default function GameBoard({
  board,
  winningPattern,
  handleCellClick,
}: GameBoardProps) {
  return (
    <div className="grid grid-cols-3 gap-3 sm:gap-4 p-4 sm:p-6 rounded-3xl bg-zinc-900/50 border border-zinc-800 backdrop-blur-md shadow-2xl">
      {board.map((cell, index) => (
        <motion.div
          key={index}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          whileHover={{ scale: cell ? 1 : 1.05 }}
          transition={{ duration: 0.2 }}
        >
          <Card
            className={`relative w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 cursor-pointer flex items-center justify-center transition-all duration-300 rounded-2xl border-2 ${
              cell
                ? "bg-zinc-800/80 border-zinc-700 shadow-inner"
                : "bg-zinc-900/40 border-zinc-800 hover:border-sky-500/50 hover:bg-zinc-800/50 shadow-sm"
            } ${
              winningPattern?.includes(index)
                ? "border-sky-500 shadow-[0_0_20px_rgba(14,165,233,0.4)] bg-sky-500/10"
                : ""
            }`}
            onClick={() => handleCellClick(index)}
          >
            {cell && (
              <motion.div
                initial={{ opacity: 0, scale: 0.5, rotate: -45 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                className={`text-4xl sm:text-5xl md:text-6xl font-black ${
                  cell === "1" ? "text-emerald-400 drop-shadow-[0_0_8px_rgba(52,211,153,0.5)]" : "text-rose-400 drop-shadow-[0_0_8px_rgba(251,113,133,0.5)]"
                }`}
              >
                {cell}
              </motion.div>
            )}
            
            {winningPattern?.includes(index) && (
              <motion.div
                layoutId="win-glow"
                className="absolute inset-0 rounded-2xl bg-sky-500/5 animate-pulse"
              />
            )}
          </Card>
        </motion.div>
      ))}
    </div>
  );
}
