"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import TechTacToe from "@/components/tech-tac-toe";
import LEDMemoryGame from "@/components/led-memory-game";
import RJ45Game from "@/components/rj45-game";
import {
  ArrowLeft,
  Grid3X3,
  Lightbulb,
  Cable,
  Home,
  QrCode,
  Trophy,
  Facebook,
  Instagram,
  Linkedin,
} from "lucide-react";

type GameType = "home" | "tech-tac-toe" | "led-memory" | "rj45-game";

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
            <div className="mb-6">
              <Button
                onClick={() => navigateTo("home")}
                variant="outline"
                className="bg-sky-50 border-sky-200 hover:bg-sky-100 text-sky-700 flex items-center gap-2 shadow-sm"
              >
                <ArrowLeft size={16} />
                Back to Games
              </Button>
            </div>
            <TechTacToe />
          </div>
        );
      case "led-memory":
        return (
          <div className="w-full max-w-4xl mx-auto">
            <div className="mb-6">
              <Button
                onClick={() => navigateTo("home")}
                variant="outline"
                className="bg-amber-50 border-amber-200 hover:bg-amber-100 text-amber-700 flex items-center gap-2 shadow-sm"
              >
                <ArrowLeft size={16} />
                Back to Games
              </Button>
            </div>
            <LEDMemoryGame />
          </div>
        );
      case "rj45-game":
        return (
          <div className="w-full max-w-4xl mx-auto">
            <div className="mb-6">
              <Button
                onClick={() => navigateTo("home")}
                variant="outline"
                className="bg-cyan-50 border-cyan-200 hover:bg-cyan-100 text-cyan-700 flex items-center gap-2 shadow-sm"
              >
                <ArrowLeft size={16} />
                Back to Games
              </Button>
            </div>
            <RJ45Game />
          </div>
        );
      default:
        return (
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-4xl sm:text-5xl font-bold text-sky-700 mb-4">
                Circuit Carnival
              </h1>
              <p className="text-slate-600 text-lg max-w-2xl mx-auto">
                Choose a game to play from our collection of tech-themed
                challenges
              </p>
            </div>

            {/* How to Join & Game Mechanics Sections */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
              {/* How to Join Section */}
              <Card className="overflow-hidden border border-slate-200 shadow-md">
                <div className="bg-gradient-to-r from-slate-50 to-blue-50 p-6">
                  <h2 className="text-2xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                    <QrCode size={24} className="text-blue-600" />
                    How to Join
                  </h2>

                  <ol className="list-decimal pl-5 space-y-2 text-slate-700 mb-6">
                    <li className="flex items-start">
                      <span>
                        Follow ICPEP.SE - PUP Manila on
                        <span className="inline-flex items-center mx-1 text-blue-600 font-medium">
                          <Facebook size={16} className="mr-1" /> Facebook,
                        </span>
                        <span className="inline-flex items-center mx-1 text-pink-600 font-medium">
                          <Instagram size={16} className="mr-1" /> Instagram,
                        </span>
                        and
                        <span className="inline-flex items-center mx-1 text-blue-700 font-medium">
                          <Linkedin size={16} className="mr-1" /> LinkedIn
                        </span>
                      </span>
                    </li>
                    <li>
                      Each social media follow grants one game entry (maximum of
                      three entries per player).
                    </li>
                  </ol>

                  <div className="flex justify-center">
                    <div className="border-2 border-dashed border-slate-300 rounded-lg p-4 w-32 h-32 flex flex-col items-center justify-center bg-white">
                      <QrCode size={64} className="text-slate-400 mb-2" />
                      <p className="text-xs text-slate-500 text-center">
                        Scan to follow our social media
                      </p>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Game Mechanics Section */}
              <Card className="overflow-hidden border border-slate-200 shadow-md">
                <div className="bg-gradient-to-r from-slate-50 to-purple-50 p-6">
                  <h2 className="text-2xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                    <Trophy size={24} className="text-purple-600" />
                    Game Mechanics
                  </h2>

                  <ul className="space-y-3 text-slate-700">
                    <li className="flex items-start">
                      <span className="bg-purple-100 text-purple-800 rounded-full w-6 h-6 flex items-center justify-center mr-2 flex-shrink-0">
                        •
                      </span>
                      <span>
                        Every player starts with one sticker by default.
                      </span>
                    </li>
                    <li className="flex items-start">
                      <span className="bg-purple-100 text-purple-800 rounded-full w-6 h-6 flex items-center justify-center mr-2 flex-shrink-0">
                        •
                      </span>
                      <span>In each game, the player bets their stickers:</span>
                    </li>
                    <li className="ml-8 flex items-start">
                      <span className="text-emerald-600 font-medium mr-2">
                        Win:
                      </span>
                      <span>
                        The player doubles their stickers and proceeds to the
                        next game.
                      </span>
                    </li>
                    <li className="ml-8 flex items-start">
                      <span className="text-amber-600 font-medium mr-2">
                        Lose:
                      </span>
                      <span>
                        The player retains their starting sticker count for that
                        game.
                      </span>
                    </li>
                    <li className="flex items-start">
                      <span className="bg-purple-100 text-purple-800 rounded-full w-6 h-6 flex items-center justify-center mr-2 flex-shrink-0">
                        •
                      </span>
                      <span>
                        This system applies across all three games, encouraging
                        strategic choices.
                      </span>
                    </li>
                    <li className="flex items-start">
                      <span className="bg-purple-100 text-purple-800 rounded-full w-6 h-6 flex items-center justify-center mr-2 flex-shrink-0">
                        •
                      </span>
                      <span>
                        Players can choose the order of the games they want to
                        play.
                      </span>
                    </li>
                  </ul>
                </div>
              </Card>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
              {/* Memory LED Challenge Card */}
              <motion.div
                whileHover={{ y: -5 }}
                transition={{ type: "spring", stiffness: 300 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
              >
                <Card className="overflow-hidden border-2 border-amber-200 shadow-md h-full">
                  <div className="bg-gradient-to-r from-amber-100 to-rose-100 p-6 h-full flex flex-col">
                    <div className="flex justify-center mb-4">
                      <div className="bg-white p-4 rounded-full shadow-md">
                        <Lightbulb size={48} className="text-amber-500" />
                      </div>
                    </div>
                    <h2 className="text-2xl font-bold text-amber-600 text-center mb-2">
                      Memory Heist: Guess the Pattern of Lights
                    </h2>
                    <p className="text-slate-600 text-center mb-6 flex-grow">
                      Test your memory by repeating a sequence of 6 LED patterns
                      in the correct order
                    </p>
                    <Button
                      onClick={() => navigateTo("led-memory")}
                      className="w-full bg-amber-500 hover:bg-amber-600 text-white shadow-sm"
                    >
                      Play Memory Heist
                    </Button>
                  </div>
                </Card>
              </motion.div>

              {/* Tech Tac Toe Card */}
              <motion.div
                whileHover={{ y: -5 }}
                transition={{ type: "spring", stiffness: 300 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.2 }}
              >
                <Card className="overflow-hidden border-2 border-sky-200 shadow-md h-full">
                  <div className="bg-gradient-to-r from-sky-100 to-indigo-100 p-6 h-full flex flex-col">
                    <div className="flex justify-center mb-4">
                      <div className="bg-white p-4 rounded-full shadow-md">
                        <Grid3X3 size={48} className="text-sky-600" />
                      </div>
                    </div>
                    <h2 className="text-2xl font-bold text-sky-700 text-center mb-2">
                      Tech-Tac-Toe
                    </h2>
                    <p className="text-slate-600 text-center mb-6 flex-grow">
                      A binary twist on the classic game with 1s and 0s instead
                      of Xs and Os
                    </p>
                    <Button
                      onClick={() => navigateTo("tech-tac-toe")}
                      className="w-full bg-sky-600 hover:bg-sky-700 text-white shadow-sm"
                    >
                      Play Tech-Tac-Toe
                    </Button>
                  </div>
                </Card>
              </motion.div>

              {/* RJ45 Wiring Game Card */}
              <motion.div
                whileHover={{ y: -5 }}
                transition={{ type: "spring", stiffness: 300 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.3 }}
              >
                <Card className="overflow-hidden border-2 border-cyan-200 shadow-md h-full">
                  <div className="bg-gradient-to-r from-cyan-100 to-blue-100 p-6 h-full flex flex-col">
                    <div className="flex justify-center mb-4">
                      <div className="bg-white p-4 rounded-full shadow-md">
                        <Cable size={48} className="text-cyan-600" />
                      </div>
                    </div>
                    <h2 className="text-2xl font-bold text-cyan-700 text-center mb-2">
                      Connect Me Not: Ethernet Color Coding Game
                    </h2>
                    <p className="text-slate-600 text-center mb-6 flex-grow">
                      Arrange T568A/B wires correctly within 20 seconds to test
                      your networking knowledge
                    </p>
                    <Button
                      onClick={() => navigateTo("rj45-game")}
                      className="w-full bg-cyan-600 hover:bg-cyan-700 text-white shadow-sm"
                    >
                      Play Connect Me Not
                    </Button>
                  </div>
                </Card>
              </motion.div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-sky-50 to-indigo-50 p-4 md:p-8">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentGame}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {renderContent()}
        </motion.div>
      </AnimatePresence>

      {currentGame !== "home" && (
        <div className="fixed bottom-4 right-4">
          <Button
            onClick={() => navigateTo("home")}
            size="icon"
            className="rounded-full bg-white text-sky-600 hover:bg-sky-50 shadow-md"
            aria-label="Return to home"
          >
            <Home size={20} />
          </Button>
        </div>
      )}
    </div>
  );
}
