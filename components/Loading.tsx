import { LoaderCircle, Sparkles } from "lucide-react";
import React from "react";

const PHRASES = [
  "Fetching awesomeness…",
  "Waking up the database…",
  "Polishing pixels…",
  "Mixing the colors…",
  "Chasing down the bits…",
  "Serving up your data…",
];

export default function Loading({ text , full }: { text?: string | React.ReactNode , full?: boolean}) {
  const phrase =
    typeof text === "string" && !text
      ? PHRASES[Math.floor(Math.random() * PHRASES.length)]
      : null;

      const size = full ? "min-w-screen min-h-screen " : " min-w-full min-h-full";
  return (
    <div className={`flex flex-col items-center justify-center ${size}`}>
      {/* Centered Loader + Glow together */}
      <div className="relative flex items-center justify-center w-32 h-32">
        {/* SVG Halo using shadcn theme colors */}
        <svg
          className="absolute inset-0 w-full h-full blur-2xl opacity-70 animate-pulse"
          width="128"
          height="128"
          viewBox="0 0 256 256"
          fill="none"
        >
          <defs>
            {/* Use currentColor for theme-aware coloring */}
            <radialGradient id="halo" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.7" />
              <stop offset="80%" stopColor="var(--accent)" stopOpacity="0.3" />
              <stop offset="100%" stopColor="var(--background)" stopOpacity="0" />
            </radialGradient>
          </defs>
          <circle cx="128" cy="128" r="100" fill="url(#halo)" />
        </svg>
        {/* Loader Icon using text-primary */}
        <LoaderCircle
          size={64}
          className="relative z-10 animate-spin text-primary drop-shadow-lg"
          strokeWidth={1}
        />
        {/* Sparkles overlay using text-accent */}
        <Sparkles
          size={28}
          strokeWidth={1.5}
          className="absolute z-20 -top-4 -right-4 text-accent animate-bounce"
        />
      </div>
      {/* Animated Gradient Text using theme colors */}
      {(text || phrase) && (
        <h2
          className="mt-6 text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary via-accent to-primary animate-gradient-x"
          style={{
            backgroundSize: "200% auto",
            animation: "gradient-x 2.5s linear infinite alternate",
          }}
        >
          {text || phrase}
        </h2>
      )}
      <style>
        {`
          @keyframes gradient-x {
            0% { background-position: 0% 50%;}
            100% { background-position: 100% 50%;}
          }
        `}
      </style>
    </div>
  );
}
