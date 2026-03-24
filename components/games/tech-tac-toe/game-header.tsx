"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Info, Trophy, Cpu } from "lucide-react";
import type { Player } from "@/lib/types";
import { cn } from "@/lib/utils";

type GameHeaderProps = {
  winner: Player | "draw" | null;
  currentPlayer: Player;
  showInfo: boolean;
  setShowInfo: (show: boolean) => void;
  isAIThinking?: boolean;
  gameMode?: "pvp" | "pve" | null;
  p1Streak?: number;
  p0Streak?: number;
};

export default function GameHeader({
  winner,
  currentPlayer,
  showInfo,
  setShowInfo,
  isAIThinking,
  gameMode,
  p1Streak = 0,
  p0Streak = 0,
}: GameHeaderProps) {
  const getPlayerLabel = (player: Player) => {
    if (gameMode === "pve") {
      return player === "1" ? "Player" : "AI";
    }
    return `Player ${player}`;
  };

  return (
    <div className="text-center space-y-4 w-full max-w-md">
      <div className="flex items-center justify-center gap-3">
        <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
          Tech Tac <span className="text-sky-400">Toe</span>
        </h1>
        <button
          onClick={() => setShowInfo(!showInfo)}
          className="text-zinc-500 hover:text-sky-400 transition-colors bg-zinc-900/50 p-1.5 rounded-full border border-zinc-800"
          aria-label="Show information about Tech Tac Toe"
        >
          <Info size={18} />
        </button>
      </div>

      <AnimatePresence>
        {showInfo && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="bg-zinc-900/50 backdrop-blur-sm p-4 rounded-xl border border-zinc-800 text-sm text-zinc-400 mb-2 leading-relaxed text-left shadow-2xl">
              <p>
                A binary twist on the classic game with <span className="text-emerald-400 font-bold">1s</span> and <span className="text-rose-400 font-bold">0s</span>. Get three in a row to win and build your win streak!
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className={cn(
          "bg-zinc-900/50 backdrop-blur-sm rounded-2xl p-3 shadow-xl border transition-all duration-300",
          currentPlayer === "1" && !winner 
            ? "border-sky-500 shadow-sky-500/10 scale-[1.02]" 
            : "border-zinc-800 opacity-60 grayscale-[0.5]"
        )}>
          <div className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-1">Player 1</div>
          <div className="text-2xl font-black text-emerald-400 flex items-center justify-center gap-2">
            <span>1</span>
            {p1Streak > 0 && (
              <span className="text-[10px] bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-500/20 flex items-center gap-1 font-bold">
                <Trophy size={10} /> {p1Streak}
              </span>
            )}
          </div>
        </div>

        <div className={cn(
          "bg-zinc-900/50 backdrop-blur-sm rounded-2xl p-3 shadow-xl border transition-all duration-300",
          currentPlayer === "0" && !winner 
            ? "border-sky-500 shadow-sky-500/10 scale-[1.02]" 
            : "border-zinc-800 opacity-60 grayscale-[0.5]"
        )}>
          <div className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-1">
            {gameMode === "pve" ? "AI" : "Player 2"}
          </div>
          <div className="text-2xl font-black text-rose-400 flex items-center justify-center gap-2">
            <span>0</span>
            {p0Streak > 0 && (
              <span className="text-[10px] bg-rose-500/10 text-rose-400 px-2 py-0.5 rounded-full border border-rose-500/20 flex items-center gap-1 font-bold">
                <Trophy size={10} /> {p0Streak}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="bg-zinc-900/50 backdrop-blur-md rounded-2xl p-4 border border-zinc-800 shadow-2xl">
        <div className="text-white font-bold text-lg">
          {winner ? (
            winner === "draw" ? (
              <span className="text-zinc-400">Game ended in a draw!</span>
            ) : (
              <motion.span 
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="flex items-center justify-center gap-2 text-emerald-400"
              >
                <Trophy size={20} />
                {getPlayerLabel(winner)} wins!
              </motion.span>
            )
          ) : isAIThinking ? (
            <span className="flex items-center justify-center gap-2 text-sky-400 animate-pulse">
              <Cpu size={20} />
              AI is computing...
            </span>
          ) : (
            <span className="flex items-center justify-center gap-2 text-zinc-300">
              <span className="w-2 h-2 rounded-full bg-sky-500 animate-pulse" />
              {getPlayerLabel(currentPlayer)}&apos;s Turn
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
