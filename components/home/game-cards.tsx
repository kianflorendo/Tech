"use client";

import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Grid3X3 } from "lucide-react";
import type { GameType } from "@/lib/types";

type GameCardsProps = {
  navigateTo: (game: GameType) => void;
};

export default function GameCards({ navigateTo }: GameCardsProps) {
  return (
    <div className="flex justify-center mt-4 px-4 relative">
      <motion.div
        whileHover={{ y: -10, scale: 1.02 }}
        transition={{
          type: "spring",
          stiffness: 300,
          damping: 20,
        }}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-lg relative group"
      >
        {/* Sparky Mascot - Integrated into card layout */}
        <div className="absolute -left-32 md:-left-72 top-32 md:top-60 z-20 pointer-events-none select-none">
          <motion.div
            animate={{ 
              y: [0, -15, 0],
              rotate: [-2, 2, -2],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <video
              src="/sparky.webm"
              autoPlay
              loop
              muted
              playsInline
              className="w-56 h-56 md:w-96 md:h-96 object-contain drop-shadow-[0_0_50px_rgba(14,165,233,0.3)] contrast-[1.2] saturate-[1.15]"
            />
          </motion.div>
        </div>

        <Card className="overflow-hidden border border-zinc-800 bg-zinc-900/60 backdrop-blur-2xl shadow-[0_0_80px_-20px_rgba(14,165,233,0.4)] rounded-[2.5rem] relative z-10">
          <div className="p-8 md:p-12 flex flex-col items-center">
            <div className="bg-zinc-800/80 p-6 rounded-2xl shadow-inner border border-zinc-700/50 mb-10 group transition-all duration-300 hover:border-sky-500/50 hover:bg-zinc-800 hover:shadow-[0_0_30px_rgba(14,165,233,0.1)]">
              <Grid3X3 size={72} className="text-sky-400 group-hover:text-sky-300 transition-all duration-300 group-hover:scale-110" />
            </div>

            <h2 className="text-4xl md:text-5xl font-black text-white text-center mb-6 tracking-tight">
              Ready for <span className="text-sky-400">Battle?</span>
            </h2>

            <p className="text-zinc-400 text-center text-lg md:text-xl mb-12 max-w-sm leading-relaxed font-medium">
              Binary logic meets classic strategy. Outsmart the AI or challenge a friend in this high-stakes 1s and 0s showdown!
            </p>

            <Button
              onClick={() => navigateTo("tech-tac-toe")}
              className="w-full bg-white hover:bg-zinc-100 text-black text-2xl font-black py-10 rounded-3xl shadow-2xl transition-all transform hover:scale-[1.03] active:scale-[0.97]"
            >
              START GAME
            </Button>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}

