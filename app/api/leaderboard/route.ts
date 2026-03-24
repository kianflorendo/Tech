import { NextRequest, NextResponse } from "next/server";
import { kv } from "@vercel/kv";

/**
 * Vercel KV Implementation for Leaderboard
 * Stored as a JSON object under the key: "leaderboard:tech-tac-toe"
 */
const LEADERBOARD_KEY = "leaderboard:tech-tac-toe";

interface Entry {
  name: string;
  score: number;
  createdAt: string;
  updatedAt?: string;
}

interface Game {
  metric: string;
  order: string;
  entries: Entry[];
}

interface Leaderboard {
  version: number;
  generatedAt?: string;
  games: Record<string, Game>;
}

export async function GET() {
  try {
    // Attempt to fetch leaderboard from KV
    const leaderboard = await kv.get<Leaderboard>(LEADERBOARD_KEY);
    
    // Default structure if database is empty
    const defaultStructure: Leaderboard = {
      version: 1,
      generatedAt: new Date().toISOString(),
      games: {
        "tech-tac-toe": {
          metric: "totalWins",
          order: "desc",
          entries: []
        }
      }
    };

    return NextResponse.json(leaderboard || defaultStructure);
  } catch (error) {
    console.error("Error reading leaderboard from KV:", error);
    // On failure, return an empty but valid structure to avoid UI crashes
    return NextResponse.json({ 
      error: "Failed to read leaderboard", 
      games: { "tech-tac-toe": { entries: [] } } 
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { gameId, name, score } = body;

    if (!gameId || !name || score === undefined) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // 1. Fetch current state
    let leaderboard = await kv.get<Leaderboard>(LEADERBOARD_KEY);
    
    // 2. Initialize if null
    if (!leaderboard) {
      leaderboard = {
        version: 1,
        games: {
          [gameId]: {
            metric: "totalWins",
            order: "desc",
            entries: []
          }
        }
      };
    }

    // Ensure the specific game object exists
    if (!leaderboard.games[gameId]) {
      leaderboard.games[gameId] = {
        metric: "totalWins",
        order: "desc",
        entries: []
      };
    }

    const entries = leaderboard.games[gameId].entries;
    const existingIndex = entries.findIndex(
      (entry) => entry.name.toUpperCase() === name.toUpperCase()
    );

    let savedEntry: Entry;
    if (existingIndex !== -1) {
      // Accumulate score for returning player
      entries[existingIndex].score += score;
      entries[existingIndex].updatedAt = new Date().toISOString();
      savedEntry = entries[existingIndex];
    } else {
      // New player — create entry
      savedEntry = {
        name: name.toUpperCase(),
        score,
        createdAt: new Date().toISOString(),
      };
      entries.push(savedEntry);
    }

    // 3. Sort by score descending and keep top 20
    leaderboard.games[gameId].entries = entries
      .sort((a, b) => b.score - a.score)
      .slice(0, 20);
    
    leaderboard.generatedAt = new Date().toISOString();

    // 4. Persist back to KV
    await kv.set(LEADERBOARD_KEY, leaderboard);

    return NextResponse.json({ success: true, entry: savedEntry });
  } catch (error) {
    console.error("Error updating leaderboard in KV:", error);
    return NextResponse.json({ error: "Failed to update leaderboard" }, { status: 500 });
  }
}
