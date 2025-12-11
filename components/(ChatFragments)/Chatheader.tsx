import * as React from "react";
import { ArrowLeft, Users, MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ChatheaderProps {
  Back: () => void;
  title: string;
  mebers: string[]; // keeping prop name as provided
}

export default function Chatheader({ Back, title, mebers }: ChatheaderProps) {
  const display = mebers.slice(0, 3);
  const extra = Math.max(0, mebers.length - display.length);

  const initials = (name: string) => {
    const parts = name.trim().split(/\s+/);
    const a = parts[0]?.[0] ?? "";
    const b = parts[1]?.[0] ?? "";
    return (a + b).toUpperCase() || "?";
  };

  return (
    <header
      className="relative z-30 w-full border-b border-border/50 
                 bg-gradient-to-b from-background/60 to-background/40 
                 dark:from-zinc-900/70 dark:to-zinc-900/40 
                 backdrop-blur-md supports-[backdrop-filter]:bg-background/50"
      role="banner"
    >
      {/* Decorative gradient bar */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 -top-px h-[2px] 
                   bg-[linear-gradient(90deg,theme(colors.indigo.500),theme(colors.fuchsia.500),theme(colors.sky.500))] 
                   opacity-70"
      />
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-2 px-3 py-3 sm:px-4 md:py-4">
        {/* Back */}
        <div className="flex items-center">
          <Button
            type="button"
            onClick={Back}
            variant="ghost"
            className="group h-10 w-10 rounded-2xl p-0 
                       ring-0 transition-all 
                       hover:scale-95 hover:bg-primary/10 
                       focus-visible:ring-2 focus-visible:ring-primary/60"
            aria-label="Go back"
          >
            <ArrowLeft className="h-5 w-5 text-foreground/80 transition group-hover:text-foreground" />
          </Button>
        </div>

        {/* Title & members */}
        <div className="flex min-w-0 flex-1 items-center justify-center">
          <div className="flex min-w-0 flex-col items-center text-center">
            <h1
              className="max-w-full truncate text-base font-semibold tracking-tight 
                         sm:text-lg md:text-xl"
              title={title}
            >
              {title}
            </h1>
            <div className="mt-1 flex items-center gap-2">
              {/* Avatars */}
              <div className="flex -space-x-2">
                {display.map((m, i) => (
                  <div
                    key={`${m}-${i}`}
                    className="flex h-6 w-6 items-center justify-center rounded-full 
                               border border-white/70 bg-gradient-to-br 
                               from-indigo-500/80 to-fuchsia-500/80 text-[10px] font-bold 
                               text-white shadow-sm dark:border-zinc-900/60"
                    aria-hidden
                    title={m}
                  >
                    {initials(m)}
                  </div>
                ))}
                {extra > 0 && (
                  <div
                    className="flex h-6 w-6 items-center justify-center rounded-full 
                               border border-white/70 bg-muted text-[10px] font-semibold 
                               text-foreground/80 shadow-sm dark:border-zinc-900/60"
                    aria-label={`${extra} more members`}
                    title={`${extra} more`}
                  >
                    +{extra}
                  </div>
                )}
              </div>

              {/* Members text */}
              <div className="flex items-center gap-1 text-xs text-muted-foreground sm:text-sm">
                <Users className="h-3.5 w-3.5 sm:h-4 sm:w-4" aria-hidden />
                <span className="truncate">
                  {mebers.length > 0
                    ? `Members: ${mebers.slice(0, 3).join(", ")}${extra > 0 ? "…" : ""}`
                    : "No members"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Actions placeholder (decorative, non-blocking) */}
        <div className="flex items-center">
          <Button
            type="button"
            variant="ghost"
            className="h-10 w-10 rounded-2xl p-0 hover:bg-muted/60"
            aria-label="More options"
          >
            <MoreVertical className="h-5 w-5 text-foreground/70" />
          </Button>
        </div>
      </div>
    </header>
  );
}
