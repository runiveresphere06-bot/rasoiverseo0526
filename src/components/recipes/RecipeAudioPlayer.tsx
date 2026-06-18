"use client";

import type { AudioLanguage } from "@prisma/client";
import { cn } from "@/lib/utils";

const LANGUAGE_LABELS: Record<AudioLanguage, string> = {
  ENGLISH: "English",
  HINDI: "Hindi",
  MARATHI: "Marathi",
};

interface AudioTrack {
  id: string;
  language: AudioLanguage;
  audioUrl: string;
}

interface RecipeAudioPlayerProps {
  tracks: AudioTrack[];
}

export function RecipeAudioPlayer({ tracks }: RecipeAudioPlayerProps) {
  if (tracks.length === 0) return null;

  return (
    <div className="rounded-2xl border border-primary/8 bg-white p-6 shadow-sm">
      <h2 className="font-serif text-xl font-semibold text-primary">
        Listen to Recipe
      </h2>
      <p className="mt-1 text-sm text-primary/60">
        Audio-guided cooking instructions
      </p>

      <div className="mt-4 space-y-4">
        {tracks.map((track) => (
          <div key={track.id} className="rounded-xl bg-background p-4">
            <p className="mb-2 text-sm font-medium text-primary">
              {LANGUAGE_LABELS[track.language]}
            </p>
            <audio
              controls
              preload="none"
              className={cn("w-full")}
              src={track.audioUrl}
            >
              Your browser does not support audio playback.
            </audio>
          </div>
        ))}
      </div>
    </div>
  );
}
