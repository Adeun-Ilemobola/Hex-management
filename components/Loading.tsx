import React from "react";
import { LoaderCircle, Sparkles } from "lucide-react";

const PHRASES = [
  "Fetching awesomeness…",
  "Waking up the database…",
  "Polishing pixels…",
  "Mixing the colors…",
  "Chasing down the bits…",
  "Serving up your data…",
];

type LoadingProps = {
  /** If undefined -> uses a random phrase. If "" -> hides text. If ReactNode/String -> shows it. */
  text?: string | React.ReactNode;
  /** Fullscreen mode */
  full?: boolean;
  /** Optional 0–100 progress */
  progress?: number;
  /** Subtle vs brandy glow */
  variant?: "brand" | "muted";
};

export default function Loading({
  text,
  full,
  progress,
  variant = "brand",
}: LoadingProps) {
  const phrase =
    typeof text === "undefined"
      ? PHRASES[Math.floor(Math.random() * PHRASES.length)]
      : null;

  const size = full ? "min-h-screen min-w-full" : "min-h-[12rem] w-full";
  const showText = typeof text === "string" ? text.length > 0 : !!text || phrase;

  return (
    <div
      className={`relative ${size} grid place-items-center`}
      role="status"
      aria-busy="true"
    >
      {/* Center stack */}
      <div className="relative flex flex-col items-center">
        {/* Soft gradient glow */}
        <div
          className={`pointer-events-none absolute -inset-10 blur-2xl opacity-60 ${
            variant === "brand"
              ? "bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400"
              : "bg-gradient-to-r from-zinc-300 via-zinc-200 to-zinc-300 dark:from-zinc-700 dark:via-zinc-800 dark:to-zinc-700"
          } rounded-full`}
          aria-hidden
        />

        {/* Icon */}
        <div className="relative flex h-24 w-24 items-center justify-center">
          <LoaderCircle
            className="animate-spin text-primary drop-shadow-sm"
            size={64}
            strokeWidth={1.25}
          />
          <Sparkles
            className="absolute -right-2 -top-2 text-accent animate-bounce"
            size={22}
            strokeWidth={1.5}
          />
        </div>

        {/* Text (gradient animated, theme-aware) */}
        {showText && (
          <div className="mt-4">
            <span
              className="block text-center text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 dark:from-blue-400 dark:via-purple-400 dark:to-pink-400 animate-gradient-x"
              style={{
                backgroundSize: "200% auto",
                animation: "gradient-x 2.5s linear infinite alternate",
              }}
            >
              {text ?? phrase}
            </span>
          </div>
        )}

        {/* Optional progress */}
        {typeof progress === "number" && progress >= 0 && progress <= 100 && (
          <div className="mt-4 w-64">
            <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 transition-[width]"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="mt-1 text-center text-xs text-muted-foreground">
              {Math.round(progress)}%
            </div>
          </div>
        )}
      </div>

      {/* Inline keyframes (no external CSS) */}
      <style>{`
        @keyframes gradient-x {
          0% { background-position: 0% 50%; }
          100% { background-position: 100% 50%; }
        }
      `}</style>
    </div>
  );
}
