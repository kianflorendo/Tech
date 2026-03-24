"use client";

import { useEffect, useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import { Trophy, Medal } from "lucide-react";

type LeaderboardEntry = {
  name: string;
  score: number;
  createdAt: string;
};

type LeaderboardGame = {
  metric: string;
  order: "asc" | "desc";
  entries: LeaderboardEntry[];
};

type LeaderboardFile = {
  version: number;
  generatedAt: string;
  games: Record<string, LeaderboardGame>;
};

type LeaderboardPanelProps = {
  gameId: string;
  limit?: number;
  className?: string;
  leaderboardKey?: number;
};

export default function LeaderboardPanel({
  gameId,
  limit = 5,
  className,
  leaderboardKey = 0,
}: LeaderboardPanelProps) {
  const [data, setData] = useState<LeaderboardFile | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();

    const load = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch(`/api/leaderboard?cb=${Date.now()}`, {
          signal: controller.signal,
          cache: "no-store",
        });

        if (!res.ok) {
          throw new Error(`Failed to load leaderboard (${res.status})`);
        }

        const json = (await res.json()) as LeaderboardFile;
        setData(json);
      } catch (err) {
        if (controller.signal.aborted) return;
        setError(err instanceof Error ? err.message : "Unknown error");
        setData(null);
      } finally {
        if (controller.signal.aborted) return;
        setLoading(false);
      }
    };

    void load();

    return () => controller.abort();
  }, [gameId, leaderboardKey]);

  const game = data?.games?.[gameId] ?? null;

  const entries = useMemo(() => {
    if (!game?.entries) return [];

    const sorted = [...game.entries].sort((a, b) => {
      const delta = a.score - b.score;
      return game.order === "asc" ? delta : -delta;
    });

    return sorted.slice(0, Math.max(0, limit));
  }, [game?.entries, game?.order, limit]);

  return (
    <Card
      className={
        className ??
        "w-full max-w-md bg-zinc-900/50 backdrop-blur-md border-zinc-800 shadow-2xl overflow-hidden rounded-2xl"
      }
    >
      <div className="p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-black text-white flex items-center gap-2">
            <Trophy size={20} className="text-amber-400" />
            Hall of Fame
          </h2>
          {game?.metric && (
            <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">
              {game.metric}
            </span>
          )}
        </div>

        {loading && (
          <div className="flex items-center justify-center py-8">
            <div className="w-6 h-6 border-2 border-sky-500/20 border-t-sky-500 rounded-full animate-spin" />
          </div>
        )}

        {!loading && error && (
          <p className="text-sm text-rose-400 py-4 text-center bg-rose-500/5 rounded-lg border border-rose-500/10">
            {error}
          </p>
        )}

        {!loading && !error && !game && (
          <p className="text-sm text-zinc-500 py-4 text-center">
            No entries found.
          </p>
        )}

        {!loading && !error && game && entries.length === 0 && (
          <p className="text-sm text-zinc-500 py-4 text-center">
            Be the first to claim a spot!
          </p>
        )}

        {!loading && !error && game && entries.length > 0 && (
          <div className="space-y-2">
            {entries.map((entry, index) => (
              <div
                key={`${entry.name}-${entry.createdAt}-${index}`}
                className="flex items-center justify-between p-3 rounded-xl bg-zinc-800/30 border border-zinc-800 transition-colors hover:bg-zinc-800/50 group"
              >
                <div className="flex items-center gap-3">
                  <span className={`w-6 h-6 flex items-center justify-center rounded-full text-xs font-black ${
                    index === 0 ? "bg-amber-500 text-black" : 
                    index === 1 ? "bg-zinc-300 text-black" : 
                    index === 2 ? "bg-amber-700 text-white" : "bg-zinc-800 text-zinc-400"
                  }`}>
                    {index + 1}
                  </span>
                  <span className="font-bold text-zinc-200 group-hover:text-white transition-colors">
                    {entry.name}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="tabular-nums text-lg font-black text-sky-400">
                    {entry.score}
                  </span>
                  {index === 0 && <Medal size={14} className="text-amber-400" />}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Card>
  );
}
