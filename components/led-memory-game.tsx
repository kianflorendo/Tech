"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import {
  Brain,
  RotateCcw,
  AlertCircle,
  Info,
  Lightbulb,
  Clock,
} from "lucide-react";

type GameState = "idle" | "showing" | "guessing" | "gameover" | "success";
type LED = 1 | 2 | 3 | 4 | 5 | 6;

// Light mode colors
const LED_COLORS = {
  1: "bg-red-500 shadow-red-500/50",
  2: "bg-amber-500 shadow-amber-500/50",
  3: "bg-emerald-500 shadow-emerald-500/50",
  4: "bg-sky-500 shadow-sky-500/50",
  5: "bg-purple-500 shadow-purple-500/50",
  6: "bg-pink-500 shadow-pink-500/50",
};

const LED_INACTIVE_COLORS = {
  1: "bg-red-100 border-red-300",
  2: "bg-amber-100 border-amber-300",
  3: "bg-emerald-100 border-emerald-300",
  4: "bg-sky-100 border-sky-300",
  5: "bg-purple-100 border-purple-300",
  6: "bg-pink-100 border-pink-300",
};

// Fixed pattern length
const PATTERN_LENGTH = 6;

export default function LEDMemoryGame() {
  const [gameState, setGameState] = useState<GameState>("idle");
  const [sequence, setSequence] = useState<LED[]>([]);
  const [playerSequence, setPlayerSequence] = useState<LED[]>([]);
  const [activeLED, setActiveLED] = useState<LED | null>(null);
  const [showInfo, setShowInfo] = useState(false);
  const [timeLeft, setTimeLeft] = useState(20);

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Generate a random LED number (1-6)
  const getRandomLED = (): LED => {
    return (Math.floor(Math.random() * 6) + 1) as LED;
  };

  // Generate a full sequence of 6 patterns
  const generateFullSequence = (): LED[] => {
    const newSequence: LED[] = [];
    for (let i = 0; i < PATTERN_LENGTH; i++) {
      newSequence.push(getRandomLED());
    }
    return newSequence;
  };

  // Start the 20-second timer for guessing
  const startGuessingTimer = useCallback(() => {
    setTimeLeft(20);

    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current!);
          // Time's up - game over
          setGameState("gameover");
          toast(
            `Time's up! You remembered ${playerSequence.length} out of ${PATTERN_LENGTH} correctly.`,
            {
              className: "bg-amber-100 text-amber-800 border-amber-200",
            }
          );
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, [playerSequence.length]);

  // Start a new game
  const startGame = useCallback(() => {
    const fullSequence = generateFullSequence();
    setSequence(fullSequence);
    setPlayerSequence([]);
    setGameState("showing");
    showSequence(fullSequence);
  }, []);

  // Show the sequence to the player
  const showSequence = useCallback(
    (currentSequence: LED[]) => {
      let step = 0;

      // Clear any existing timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      const playStep = () => {
        if (step < currentSequence.length) {
          // Light up the LED
          setActiveLED(currentSequence[step]);

          // Turn off after a delay
          timeoutRef.current = setTimeout(() => {
            setActiveLED(null);

            // Wait before showing the next LED
            timeoutRef.current = setTimeout(() => {
              step++;
              playStep();
            }, 400); // Longer delay between LEDs to make it easier
          }, 800); // Longer display time to make it easier
        } else {
          // Sequence finished, player's turn
          setActiveLED(null);
          setGameState("guessing");
          setPlayerSequence([]);
          startGuessingTimer(); // Start the 20-second timer
        }
      };

      // Start playing the sequence after a short delay
      timeoutRef.current = setTimeout(playStep, 1000);
    },
    [startGuessingTimer]
  );

  // Handle player clicking an LED
  const handleLEDClick = (led: LED) => {
    if (gameState !== "guessing") return;

    // Light up the LED briefly
    setActiveLED(led);
    setTimeout(() => setActiveLED(null), 200);

    // Add to player sequence
    const newPlayerSequence = [...playerSequence, led];
    setPlayerSequence(newPlayerSequence);

    // Check if the player's input is correct so far
    const isCorrectSoFar = newPlayerSequence.every(
      (led, index) => led === sequence[index]
    );

    if (!isCorrectSoFar) {
      // Wrong input, game over
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      setGameState("gameover");

      const currentScore = newPlayerSequence.length - 1;
      toast(
        `Game Over! You remembered ${currentScore} out of ${PATTERN_LENGTH} correctly.`,
        {
          className: "bg-amber-100 text-amber-800 border-amber-200",
        }
      );
      return;
    }

    // Check if the player completed the full sequence
    if (newPlayerSequence.length === sequence.length) {
      // Correct sequence!
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      setGameState("success");

      toast(
        `Success! You memorized all ${PATTERN_LENGTH} patterns correctly!`,
        {
          className: "bg-emerald-100 text-emerald-800 border-emerald-200",
        }
      );
    }
  };

  // Clean up timeouts when component unmounts or game resets
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  // Reset game and clear timers
  const resetGame = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    setGameState("idle");
    setTimeLeft(20);
  };

  return (
    <div className="flex flex-col items-center justify-center p-4 space-y-6 bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50 rounded-xl shadow-md">
      <div className="text-center space-y-3">
        <div className="flex items-center justify-center gap-2">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-amber-600">
            Memory LED Challenge
          </h1>
          <button
            onClick={() => setShowInfo(!showInfo)}
            className="text-amber-600 hover:text-amber-800 transition-colors"
            aria-label="Show information about LED Memory Challenge"
          >
            <Info size={20} />
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
              <div className="bg-white/80 backdrop-blur-sm p-3 rounded-lg shadow-sm text-sm text-slate-700">
                <p>
                  Watch the sequence of 6 LED lights and repeat it from memory
                  within 20 seconds.
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="bg-white/80 backdrop-blur-sm rounded-lg p-3 shadow-sm">
          <div className="flex justify-center text-slate-700 font-medium">
            {gameState === "idle" && (
              <div className="flex items-center gap-2">
                <Brain size={18} />
                <p>Press Start to test your memory!</p>
              </div>
            )}
            {gameState === "showing" && (
              <div className="flex items-center gap-2 text-blue-600">
                <AlertCircle size={18} />
                <p>Memorize the pattern...</p>
              </div>
            )}
            {gameState === "guessing" && (
              <div className="flex items-center gap-2">
                <Clock size={18} className="text-amber-600" />
                <p>
                  Repeat the pattern! ({playerSequence.length}/{PATTERN_LENGTH})
                  - Time: {timeLeft}s
                </p>
              </div>
            )}
            {gameState === "gameover" && "Game Over! Try again?"}
            {gameState === "success" && "Perfect memory! Try again?"}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3 sm:gap-4 md:gap-6 p-4 sm:p-6 rounded-xl bg-white/80 backdrop-blur-sm shadow-md">
        {[1, 2, 3, 4, 5, 6].map((led) => (
          <motion.div
            key={led}
            whileHover={{ scale: gameState === "guessing" ? 1.05 : 1 }}
            whileTap={{ scale: gameState === "guessing" ? 0.95 : 1 }}
          >
            <Card
              className={`relative w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-full cursor-pointer flex items-center justify-center border-4 transition-all duration-200 ${
                activeLED === led
                  ? `${LED_COLORS[led as LED]} shadow-lg border-white`
                  : `${LED_INACTIVE_COLORS[led as LED]}`
              }`}
              onClick={() => handleLEDClick(led as LED)}
            >
              <div
                className={`absolute inset-0 rounded-full ${
                  activeLED === led ? "opacity-70" : "opacity-0"
                } transition-opacity duration-200 blur-md ${
                  LED_COLORS[led as LED]
                }`}
              />
              <span
                className={`text-xl sm:text-2xl md:text-3xl font-bold ${
                  activeLED === led ? "text-white" : "text-slate-700"
                }`}
              >
                {led}
              </span>
              {gameState === "guessing" && (
                <Lightbulb
                  size={16}
                  className="absolute bottom-2 right-2 text-slate-500 opacity-70"
                />
              )}
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="flex space-x-4">
        <Button
          onClick={startGame}
          variant="outline"
          size="lg"
          className="bg-white border-amber-200 hover:bg-amber-50 hover:border-amber-300 text-amber-700 shadow-sm flex items-center gap-2"
        >
          <RotateCcw size={16} />
          {gameState === "idle" ||
          gameState === "gameover" ||
          gameState === "success"
            ? "Start Challenge"
            : "Restart"}
        </Button>
      </div>
    </div>
  );
}
