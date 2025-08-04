"use client";
import React from "react";
import Google from "./Icon/Google";
import GitHub from "./Icon/GitHub";
import Discord from "./Icon/Discord";
import Reddit from "./Icon/Reddit";
import { Button } from "./ui/button";
import { useMutation } from "@tanstack/react-query";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";

const Social: { id: SocialId; tsx: React.JSX.Element }[] = [
  { id: "google", tsx: <Google /> },
  { id: "github", tsx: <GitHub /> },
  { id: "discord", tsx: <Discord /> },
  { id: "reddit", tsx: <Reddit /> },
];
type SocialId = "google" | "github" | "discord" | "reddit";

export default function SocialSignOn() {
  const RegisterSocialMut = useMutation({
    mutationFn: async (provider: SocialId) => {
      await authClient.signIn.social(
        { provider, callbackURL: "/home" },
        {
          onSuccess() {
            toast.success("Login successful with " + provider);
          },
          onError(context) {
            toast.error(context.error.message);
          },
        }
      );
    },
  });

  return (
    <>
      {Social.map((s) => (
        <Button
          key={s.id}
          size="icon"
          variant="outline"
          disabled={RegisterSocialMut.isPending}
          onClick={() => RegisterSocialMut.mutate(s.id)}
          className="rounded-xl border-gray-200/60 bg-white/70 shadow-sm ring-1 ring-inset ring-white/40 backdrop-blur-sm transition hover:scale-105 hover:border-transparent hover:shadow-lg dark:border-gray-800/60 dark:bg-gray-900/60 dark:ring-white/10"
          aria-label={`Continue with ${s.id}`}
        >
          {s.tsx}
        </Button>
      ))}
    </>
  );
}
