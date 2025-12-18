import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

// Optional: Lucide SVG icons
import { Ghost, ArrowLeft, AlertTriangle, Sparkles, Compass } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen w-full bg-background px-4 py-12">
      {/* SVG "clouds" background */}
      <svg className="absolute z-0 left-1/2 top-10 -translate-x-1/2 opacity-30 blur-sm"
        width="450" height="120" viewBox="0 0 450 120" fill="none">
        <ellipse cx="120" cy="80" rx="120" ry="40" fill="var(--muted)" />
        <ellipse cx="350" cy="60" rx="100" ry="30" fill="var(--muted)" />
        <ellipse cx="220" cy="100" rx="80" ry="20" fill="var(--muted)" />
      </svg>

      {/* Card with ghost and 404 ------- */}
      <Card className="relative z-10 w-full max-w-md rounded-2xl shadow-md bg-card/95 border border-border flex flex-col items-center gap-2">
        <CardContent className="flex flex-col items-center justify-center py-12 px-6 space-y-4">
          <span className="flex items-center justify-center relative">
            {/*  SVG Ghost */}
            <Ghost size={80} className="text-primary opacity-90 drop-shadow-lg animate-float" />
            <Sparkles size={28} className="absolute -top-4 -right-3 text-accent animate-bounce" />
          </span>
          <h1 className="text-5xl font-black text-primary tracking-tight">404</h1>
          <Separator className="my-2 w-16 bg-accent" />
          <div className="flex items-center gap-2">
            <AlertTriangle className="text-destructive" size={22} />
            <h2 className="text-xl font-bold text-foreground">Page Not Found</h2>
          </div>
          <p className="text-center text-muted-foreground mb-2 max-w-xs">
            Oops! We couldn&#39;t find the page you&#39;re looking for<br />
            Maybe it lost in the cloud, or just taking a break
          </p>
          <Link href="/" className="w-full mt-4">
            <Button
              variant="default"
              className="w-full flex items-center gap-2"
              aria-label="Return Home"
            >
              <ArrowLeft className="w-5 h-5" /> Return Home
            </Button>
          </Link>
        </CardContent>
      </Card>

      {/* Compass SVG for bottom decoration */}
      <div className="relative z-0 mt-8">
        <Compass className="mx-auto text-accent opacity-80 animate-spin-slow" size={38} />
      </div>
      {/* Fun floating/fade-in keyframes */}
      <style>
        {`
          .animate-float {
            animation: float 3.2s ease-in-out infinite;
          }
          @keyframes float {
            0%, 100% { transform: translateY(0px);}
            50% { transform: translateY(-18px);}
          }
          .animate-spin-slow {
            animation: spin 8s linear infinite;
          }
          @keyframes spin {
            100% { transform: rotate(360deg);}
          }
        `}
      </style>
    </div>
  );
}
