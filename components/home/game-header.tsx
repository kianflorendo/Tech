"use client";

export default function GameHeader() {
  return (
    <div className="flex flex-col items-center justify-center text-center mb-12 mt-8">
      <h1 className="text-4xl sm:text-5xl md:text-7xl font-black text-white mb-4 tracking-tight">
        Sparky <span className="text-sky-500">Tech Tac Toe</span>
      </h1>
      <p className="text-zinc-400 text-lg md:text-xl max-w-2xl mx-auto font-medium">
        A binary twist on the classic game with 1s and 0s instead of Xs and Os
      </p>
    </div>
  );
}
