"use client";

import { useState, useEffect, useRef } from "react";
import { motion, Reorder, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { AlertCircle, Clock, RotateCcw, Info, Award } from "lucide-react";
import { useMediaQuery } from "@/hooks/use-media-query";

// Wire color definitions
type WireStandard = "T568A" | "T568B";

type Wire = {
  id: number;
  color1: string;
  color2: string | null;
  name: string;
  bgClass: string;
  stripeClass: string | null;
};

// Define the T568A and T568B wire standards
const WIRE_STANDARDS: Record<WireStandard, Wire[]> = {
  T568A: [
    {
      id: 1,
      color1: "white",
      color2: "green",
      name: "White/Green",
      bgClass: "bg-white",
      stripeClass: "bg-green-500",
    },
    {
      id: 2,
      color1: "green",
      color2: null,
      name: "Green",
      bgClass: "bg-green-500",
      stripeClass: null,
    },
    {
      id: 3,
      color1: "white",
      color2: "orange",
      name: "White/Orange",
      bgClass: "bg-white",
      stripeClass: "bg-orange-500",
    },
    {
      id: 4,
      color1: "blue",
      color2: null,
      name: "Blue",
      bgClass: "bg-blue-500",
      stripeClass: null,
    },
    {
      id: 5,
      color1: "white",
      color2: "blue",
      name: "White/Blue",
      bgClass: "bg-white",
      stripeClass: "bg-blue-500",
    },
    {
      id: 6,
      color1: "orange",
      color2: null,
      name: "Orange",
      bgClass: "bg-orange-500",
      stripeClass: null,
    },
    {
      id: 7,
      color1: "white",
      color2: "brown",
      name: "White/Brown",
      bgClass: "bg-white",
      stripeClass: "bg-amber-800",
    },
    {
      id: 8,
      color1: "brown",
      color2: null,
      name: "Brown",
      bgClass: "bg-amber-800",
      stripeClass: null,
    },
  ],
  T568B: [
    {
      id: 1,
      color1: "white",
      color2: "orange",
      name: "White/Orange",
      bgClass: "bg-white",
      stripeClass: "bg-orange-500",
    },
    {
      id: 2,
      color1: "orange",
      color2: null,
      name: "Orange",
      bgClass: "bg-orange-500",
      stripeClass: null,
    },
    {
      id: 3,
      color1: "white",
      color2: "green",
      name: "White/Green",
      bgClass: "bg-white",
      stripeClass: "bg-green-500",
    },
    {
      id: 4,
      color1: "blue",
      color2: null,
      name: "Blue",
      bgClass: "bg-blue-500",
      stripeClass: null,
    },
    {
      id: 5,
      color1: "white",
      color2: "blue",
      name: "White/Blue",
      bgClass: "bg-white",
      stripeClass: "bg-blue-500",
    },
    {
      id: 6,
      color1: "green",
      color2: null,
      name: "Green",
      bgClass: "bg-green-500",
      stripeClass: null,
    },
    {
      id: 7,
      color1: "white",
      color2: "brown",
      name: "White/Brown",
      bgClass: "bg-white",
      stripeClass: "bg-amber-800",
    },
    {
      id: 8,
      color1: "brown",
      color2: null,
      name: "Brown",
      bgClass: "bg-amber-800",
      stripeClass: null,
    },
  ],
};

type GameState = "select" | "learn" | "arrange" | "success" | "failure";

export default function RJ45Game() {
  const [gameState, setGameState] = useState<GameState>("select");
  const [standard, setStandard] = useState<WireStandard>("T568A");
  const [wires, setWires] = useState<Wire[]>([]);
  const [correctWires, setCorrectWires] = useState<Wire[]>([]);
  const [timeLeft, setTimeLeft] = useState(20);
  const [showCorrectPattern, setShowCorrectPattern] = useState(true);
  const [showInfo, setShowInfo] = useState(false);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const gameContainerRef = useRef<HTMLDivElement>(null);

  // Check if screen is mobile
  const isMobile = useMediaQuery("(max-width: 640px)");
  const isTablet = useMediaQuery("(max-width: 1024px)");
  const isLargeScreen = useMediaQuery("(min-width: 768px)");

  // Select a standard and start the game
  const selectStandard = (selected: WireStandard) => {
    setStandard(selected);
    setCorrectWires([...WIRE_STANDARDS[selected]]);
    setGameState("learn");

    // Show the correct pattern for 5 seconds
    setTimeout(() => {
      // Jumble the wires
      const jumbledWires = [...WIRE_STANDARDS[selected]].sort(
        () => Math.random() - 0.5
      );
      setWires(jumbledWires);
      setShowCorrectPattern(false);
      setGameState("arrange");
      startArrangeTimer();
    }, 5000);
  };

  // Start the 20-second timer for arranging wires
  const startArrangeTimer = () => {
    setTimeLeft(20);

    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current!);
          // Automatically check arrangement when time runs out
          checkArrangement();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  // Check if the arrangement is correct
  const checkArrangement = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    const isCorrect = wires.every(
      (wire, index) => wire.id === correctWires[index].id
    );

    if (isCorrect) {
      // Success!
      setGameState("success");
      toast(
        "Perfect arrangement! You've successfully wired the RJ45 connector!",
        {
          className: "bg-green-100 text-green-800 border-green-200",
        }
      );
    } else {
      // Game over - wrong arrangement
      setGameState("failure");
      setShowCorrectPattern(true); // Show the correct pattern
      toast("Incorrect wire arrangement! Check the correct pattern.", {
        className: "bg-red-100 text-red-800 border-red-200",
      });
    }
  };

  // Reset the game
  const resetGame = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    setGameState("select");
    setWires([]);
    setCorrectWires([]);
    setTimeLeft(20);
    setShowCorrectPattern(true);
  };

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  // Render a wire for the correct pattern display
  const renderWire = (wire: Wire, index: number) => (
    <div className="flex flex-col items-center">
      <div className="text-center text-slate-500 font-medium mb-1">
        {index + 1}
      </div>
      <div
        className={`h-12 sm:h-16 w-6 sm:w-8 rounded-md flex items-center justify-center relative ${wire.bgClass} border border-slate-300 shadow-sm`}
      >
        {wire.stripeClass && (
          <div
            className={`absolute top-0 left-0 w-full h-full ${wire.stripeClass} opacity-70`}
            style={{
              backgroundImage:
                "repeating-linear-gradient(45deg, transparent, transparent 5px, currentColor 5px, currentColor 10px)",
              backgroundSize: "14px 14px",
              mixBlendMode: "multiply",
            }}
          ></div>
        )}
      </div>
      <div className="text-xs font-medium text-slate-700 bg-white px-2 py-1 rounded mt-1 shadow-sm whitespace-nowrap">
        {wire.name}
      </div>
    </div>
  );

  return (
    <div
      ref={gameContainerRef}
      className="flex flex-col items-center justify-center p-4 md:p-8 space-y-6 bg-gradient-to-br from-cyan-50 via-sky-50 to-blue-50 rounded-xl shadow-md relative"
    >
      <div className="text-center space-y-3 max-w-md mx-auto">
        <div className="flex items-center justify-center gap-2">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-cyan-700 tracking-tight">
            RJ45 Wiring Challenge
          </h1>
          <button
            onClick={() => setShowInfo(!showInfo)}
            className="text-cyan-600 hover:text-cyan-800 transition-colors"
            aria-label="Show information about RJ45 wiring"
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
                  RJ45 connectors use specific color patterns for network
                  cables. T568A and T568B are the two standard wiring patterns
                  used in Ethernet cables.
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {gameState === "select" && (
          <div className="bg-white/70 backdrop-blur-sm p-4 rounded-lg shadow-sm">
            <p className="text-slate-700 text-base sm:text-lg">
              Select a wiring standard to begin. You'll need to memorize the
              pattern, then arrange the wires correctly in 20 seconds.
            </p>
          </div>
        )}

        {gameState === "learn" && (
          <div className="flex items-center justify-center space-x-2 text-emerald-600 bg-emerald-50 p-3 rounded-lg shadow-sm">
            <AlertCircle size={20} />
            <p className="font-medium text-base sm:text-lg">
              Memorize this pattern! Jumbling in 5 seconds...
            </p>
          </div>
        )}

        {gameState === "arrange" && (
          <div className="flex items-center justify-center space-x-2 text-amber-600 bg-amber-50 p-3 rounded-lg shadow-sm">
            <Clock size={20} />
            <p className="font-medium text-base sm:text-lg">
              Arrange the wires correctly! Time left: {timeLeft}s
            </p>
          </div>
        )}

        {gameState === "success" && (
          <div className="flex items-center justify-center space-x-2 text-emerald-600 bg-emerald-50 p-3 rounded-lg shadow-sm">
            <Award size={20} />
            <p className="font-medium text-base sm:text-lg">
              Perfect wiring! You win!
            </p>
          </div>
        )}

        {gameState === "failure" && (
          <div className="flex items-center justify-center space-x-2 text-red-600 bg-red-50 p-3 rounded-lg shadow-sm">
            <AlertCircle size={20} />
            <p className="font-medium text-base sm:text-lg">
              Incorrect wiring! Try again.
            </p>
          </div>
        )}
      </div>

      <div className="w-full max-w-4xl">
        {gameState === "select" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Card
                className="overflow-hidden border-2 border-cyan-200 hover:border-cyan-400 transition-all duration-200 cursor-pointer"
                onClick={() => selectStandard("T568A")}
              >
                <div className="bg-gradient-to-r from-cyan-50 to-blue-50 p-4 sm:p-6">
                  <div className="text-center mb-4">
                    <span className="text-lg sm:text-xl font-bold text-cyan-700 bg-white px-3 py-1 rounded-full shadow-sm">
                      T568A
                    </span>
                  </div>
                  <div className="bg-white rounded-lg p-3 shadow-sm">
                    <div className="flex justify-center gap-1 sm:gap-2">
                      {WIRE_STANDARDS["T568A"].map((wire, i) => (
                        <div
                          key={i}
                          className={`h-12 sm:h-16 w-6 sm:w-8 ${wire.bgClass} border border-slate-300 rounded-sm`}
                          style={{
                            backgroundImage: wire.stripeClass
                              ? `repeating-linear-gradient(45deg, transparent, transparent 2px, ${wire.stripeClass.replace(
                                  "bg-",
                                  ""
                                )} 2px, ${wire.stripeClass.replace(
                                  "bg-",
                                  ""
                                )} 4px)`
                              : "none",
                          }}
                        ></div>
                      ))}
                    </div>
                    <div className="flex justify-center gap-1 sm:gap-2 mt-2">
                      {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                        <div
                          key={num}
                          className="text-center text-xs font-medium text-slate-500 w-6 sm:w-8"
                        >
                          {num}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>

            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Card
                className="overflow-hidden border-2 border-blue-200 hover:border-blue-400 transition-all duration-200 cursor-pointer"
                onClick={() => selectStandard("T568B")}
              >
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 sm:p-6">
                  <div className="text-center mb-4">
                    <span className="text-lg sm:text-xl font-bold text-blue-700 bg-white px-3 py-1 rounded-full shadow-sm">
                      T568B
                    </span>
                  </div>
                  <div className="bg-white rounded-lg p-3 shadow-sm">
                    <div className="flex justify-center gap-1 sm:gap-2">
                      {WIRE_STANDARDS["T568B"].map((wire, i) => (
                        <div
                          key={i}
                          className={`h-12 sm:h-16 w-6 sm:w-8 ${wire.bgClass} border border-slate-300 rounded-sm`}
                          style={{
                            backgroundImage: wire.stripeClass
                              ? `repeating-linear-gradient(45deg, transparent, transparent 2px, ${wire.stripeClass.replace(
                                  "bg-",
                                  ""
                                )} 2px, ${wire.stripeClass.replace(
                                  "bg-",
                                  ""
                                )} 4px)`
                              : "none",
                          }}
                        ></div>
                      ))}
                    </div>
                    <div className="flex justify-center gap-1 sm:gap-2 mt-2">
                      {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                        <div
                          key={num}
                          className="text-center text-xs font-medium text-slate-500 w-6 sm:w-8"
                        >
                          {num}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          </div>
        )}

        {(gameState === "learn" ||
          (showCorrectPattern && gameState === "failure")) && (
          <Card className="p-4 bg-white shadow-md">
            <h3 className="text-lg font-semibold text-center mb-4 text-cyan-700 flex items-center justify-center gap-2">
              <span className="bg-cyan-100 text-cyan-700 px-2 py-1 rounded text-sm font-bold">
                {standard}
              </span>
              Standard Pattern
            </h3>
            <div className="flex flex-wrap justify-center gap-2 sm:gap-4 p-2 sm:p-4">
              {correctWires.map((wire, index) => renderWire(wire, index))}
            </div>
          </Card>
        )}

        {gameState === "arrange" && (
          <Card className="p-4 bg-white shadow-md">
            <h3 className="text-lg font-semibold text-center mb-4 text-cyan-700">
              Arrange the wires in the correct order
            </h3>

            {/* Responsive wire arrangement - vertical on mobile, horizontal on larger screens */}
            <div className="flex flex-col items-center">
              <Reorder.Group
                axis={isMobile ? "y" : "x"}
                values={wires}
                onReorder={setWires}
                className={`${
                  isMobile
                    ? "flex flex-col gap-2"
                    : "flex flex-row gap-2 justify-center overflow-x-auto"
                } p-4 bg-slate-50 rounded-lg min-h-[120px] w-full`}
              >
                {wires.map((wire, index) => (
                  <Reorder.Item
                    key={wire.id}
                    value={wire}
                    className="cursor-grab active:cursor-grabbing"
                  >
                    <motion.div
                      className={`flex ${
                        isMobile
                          ? "flex-row items-center"
                          : "flex-col items-center"
                      } p-2 bg-white rounded-md hover:bg-slate-100 border border-slate-200 shadow-sm ${
                        isLargeScreen ? "min-w-[80px]" : ""
                      }`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="text-center text-slate-500 font-medium mb-1 mx-2">
                        {index + 1}
                      </div>
                      <div
                        className={`h-12 sm:h-16 w-6 sm:w-8 rounded-md flex items-center justify-center relative ${wire.bgClass} border border-slate-300`}
                      >
                        {wire.stripeClass && (
                          <div
                            className={`absolute top-0 left-0 w-full h-full ${wire.stripeClass} opacity-70`}
                            style={{
                              backgroundImage:
                                "repeating-linear-gradient(45deg, transparent, transparent 5px, currentColor 5px, currentColor 10px)",
                              backgroundSize: "14px 14px",
                              mixBlendMode: "multiply",
                            }}
                          ></div>
                        )}
                      </div>
                      <div className="text-xs font-medium text-slate-700 bg-white px-2 py-1 rounded mx-2 my-1 shadow-sm whitespace-nowrap">
                        {wire.name}
                      </div>
                      <div
                        className={`text-slate-400 ${
                          isMobile ? "ml-auto" : "mt-1"
                        }`}
                      >
                        {isMobile ? "⋮⋮" : "≡"}
                      </div>
                    </motion.div>
                  </Reorder.Item>
                ))}
              </Reorder.Group>
            </div>

            <div className="mt-6 flex justify-center">
              <Button
                onClick={checkArrangement}
                className="bg-cyan-600 hover:bg-cyan-700 text-white shadow-md text-base sm:text-lg px-4 sm:px-6 py-2"
              >
                Check Wiring
              </Button>
            </div>
          </Card>
        )}
      </div>

      {(gameState === "success" || gameState === "failure") && (
        <Button
          onClick={resetGame}
          variant="outline"
          size="lg"
          className="bg-white border-cyan-200 hover:bg-cyan-50 hover:border-cyan-300 text-cyan-700 shadow-md flex items-center gap-2"
        >
          <RotateCcw size={16} />
          Play Again
        </Button>
      )}
    </div>
  );
}
