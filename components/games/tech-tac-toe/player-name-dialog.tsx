"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { User, Trophy } from "lucide-react";

interface PlayerNameDialogProps {
  open: boolean;
  score: number;
  onSubmit: (name: string) => void;
  onCancel: () => void;
  title?: string;
  playerLabel?: string;
}

export default function PlayerNameDialog({
  open,
  score,
  onSubmit,
  onCancel,
  title = "Congratulations! 🎉",
  playerLabel,
}: PlayerNameDialogProps) {
  const [name, setName] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onSubmit(name.trim().toUpperCase());
      setName("");
    }
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onCancel()}>
      <DialogContent className="sm:max-w-md bg-zinc-950 border border-zinc-800 shadow-2xl rounded-3xl overflow-hidden p-0">
        <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-transparent via-emerald-500 to-transparent opacity-30" />
        
        <form onSubmit={handleSubmit} className="p-8">
          <DialogHeader className="mb-8">
            <DialogTitle className="text-3xl font-black text-white text-center tracking-tight">
              {title}
            </DialogTitle>
            <DialogDescription className="text-center text-zinc-400 font-medium pt-2">
              {playerLabel ? `${playerLabel}, you` : "You"} reached a win streak of <span className="font-black text-emerald-400">{score}</span>! Enter your handle to join the Hall of Fame.
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col items-center py-2 space-y-6">
            <div className="bg-emerald-500/10 p-6 rounded-2xl border border-emerald-500/20 text-emerald-400 shadow-inner">
              <Trophy size={48} />
            </div>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="ENTER NAME"
              maxLength={10}
              autoFocus
              className="text-center text-2xl font-black uppercase bg-zinc-900 border-zinc-800 focus:border-emerald-500/50 focus:ring-emerald-500/20 py-8 rounded-2xl tracking-widest text-white"
            />
          </div>

          <DialogFooter className="mt-10">
            <div className="flex w-full gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                className="flex-1 border-zinc-800 text-zinc-500 hover:text-white hover:bg-zinc-900 hover:border-zinc-700 font-black tracking-widest uppercase text-xs py-7 rounded-2xl"
              >
                Skip
              </Button>
              <Button
                type="submit"
                disabled={!name.trim()}
                className="flex-1 bg-emerald-500 hover:bg-emerald-400 text-black font-black tracking-widest uppercase text-xs py-7 rounded-2xl shadow-xl transition-all transform hover:scale-[1.02] active:scale-[0.98]"
              >
                Record Score
              </Button>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
