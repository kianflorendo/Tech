"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";

// Game components
import TechTacToe from "@/components/games/tech-tac-toe/tech-tac-toe";

// Home page components
import GameHeader from "@/components/home/game-header";
import GameCards from "@/components/home/game-cards";
import BackToHomeButton from "@/components/home/back-to-home-button";

// Types
import { GameType } from "@/lib/types";

export default function GameHub() {
  const [currentGame, setCurrentGame] = useState<GameType>("home");

  const navigateTo = (game: GameType) => {
    setCurrentGame(game);
  };

  // Render the current game or home screen
  const renderContent = () => {
    switch (currentGame) {
      case "tech-tac-toe":
        return (
          <div className="w-full max-w-4xl mx-auto">
            <BackToHomeButton navigateTo={navigateTo} variant="sky" />
            <TechTacToe />
          </div>
        );
      default:
        return (
          <div className="max-w-5xl mx-auto">
            <GameHeader />
            <GameCards navigateTo={navigateTo} />
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-4 md:p-8 selection:bg-sky-500/30">
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(14,165,233,0.1),transparent_70%)] pointer-events-none" />
      
      <AnimatePresence mode="wait">
        <motion.div
          key={currentGame}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="relative z-10"
        >
          {renderContent()}
        </motion.div>
      </AnimatePresence>

      {currentGame !== "home" && (
        <div className="fixed bottom-6 right-6 z-50">
          <Button
            onClick={() => navigateTo("home")}
            size="icon"
            className="rounded-full bg-zinc-900 border border-zinc-800 text-sky-400 hover:bg-zinc-800 hover:border-sky-500 shadow-2xl w-14 h-14 transition-all"
            aria-label="Return to home"
          >
            <Home size={28} />
          </Button>
        </div>
      )}
    </div>
  );
}
