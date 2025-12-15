import React, { useEffect, useState } from "react";
import { LoaderCircle, Sparkles } from "lucide-react";

const DEFAULT_PHRASES = [
  "Fetching awesomeness…",
  "Waking up the database…",
  "Polishing pixels…",
  "Mixing the colors…",
  "Chasing down the bits…",
  "Serving up your data…",
];

type LoadingProps = {
  text?: string | React.ReactNode;
  /** Fullscreen mode */
  full?: boolean;
  /** Optional 0–100 progress */
  progress?: number;
  /** Visual style variant */
  variant?: "brand" | "muted";
  /** Custom list of phrases to cycle through */
  phrases?: string[];
};

export default function Loading({
  text,
  full,
  progress,
  phrases = DEFAULT_PHRASES,
  variant = "brand",
}: LoadingProps) {
  // Store the random phrase in state to prevent hydration mismatches (SSR)
  // and to stop it from changing on every re-render (e.g. when progress updates).
  const [randomPhrase, setRandomPhrase] = useState<string | null>(null);

  useEffect(() => {
    // Only set the phrase on the client side
    if (typeof text === "undefined") {
      setRandomPhrase(phrases[Math.floor(Math.random() * phrases.length)]);
    }
  }, [text, phrases]);

  const size = full ? "min-h-screen min-w-full" : "min-h-[12rem] w-full";
  const displayContent = text ?? randomPhrase;
  const showText = !!displayContent && displayContent !== "";

  // Dynamic styles based on variant
  const gradientClass =
    variant === "brand"
      ? "from-blue-600 via-purple-600 to-pink-600 dark:from-blue-400 dark:via-purple-400 dark:to-pink-400"
      : "from-zinc-600 via-zinc-400 to-zinc-600 dark:from-zinc-300 dark:via-zinc-500 dark:to-zinc-300";

  const progressColorClass =
    variant === "brand"
      ? "from-blue-500 via-purple-500 to-pink-500"
      : "from-zinc-500 via-zinc-400 to-zinc-500";

  return (
    <div
      className={`relative ${size} grid place-items-center bg-background`}
      role="status"
      aria-busy="true"
      aria-live="polite"
    >
      <div className="relative flex flex-col items-center p-4">
        {/* Icon Stack */}
        <div className="relative flex h-24 w-24 items-center justify-center">
          <LoaderCircle
            className={`animate-spin drop-shadow-sm ${
              variant === "brand" ? "text-primary" : "text-muted-foreground"
            }`}
            size={64}
            strokeWidth={1.25}
          />
          <Sparkles
            className={`absolute -right-2 -top-2 animate-bounce ${
              variant === "brand" ? "text-amber-400" : "text-zinc-400"
            }`}
            size={22}
            strokeWidth={1.5}
          />
        </div>

        {/* Gradient Text */}
        {showText && (
          <div className="mt-4 max-w-sm text-center">
            <span
              className={`block text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r ${gradientClass} animate-gradient-x`}
              style={{
                backgroundSize: "200% auto",
                animation: "gradient-x 2.5s linear infinite alternate",
              }}
            >
              {displayContent}
            </span>
          </div>
        )}

        {/* Progress Bar */}
        {typeof progress === "number" && progress >= 0 && progress <= 100 && (
          <div className="mt-6 w-64 animate-in fade-in zoom-in duration-300">
            <div className="h-2 w-full rounded-full bg-muted/50 overflow-hidden border border-border/50">
              <div
                className={`h-full rounded-full bg-gradient-to-r ${progressColorClass} transition-[width] duration-300 ease-out`}
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="mt-2 flex justify-end">
              <span className="text-xs font-medium text-muted-foreground tabular-nums">
                {Math.round(progress)}%
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Inline styles for the gradient animation */}
      <style>{`
        @keyframes gradient-x {
          0% { background-position: 0% 50%; }
          100% { background-position: 100% 50%; }
        }
      `}</style>
    </div>
  );
}