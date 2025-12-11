"use client";

import React, { useState } from "react";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { ArrowRight, Loader2 } from "lucide-react";

import Strips from "@/components/Designs/strip";
import InputBox from "@/components/InputBox";
import SocialSignOn from "@/components/SocialSignOn";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { zodLoginSchema } from "@/lib/Zod";
import { authClient } from "@/lib/auth-client";

export default function Page() {
  const [loginInfo, setLoginInfo] = useState<z.infer<typeof zodLoginSchema>>({
    email: "",
    password: "",
  });

  const LoginMut = useMutation({
    mutationFn: async (loginData: z.infer<typeof zodLoginSchema>) => {
      toast.loading("Signing in...", { id: "signin" });
      try {
        const res = await authClient.signIn.email({
          password: loginData.password,
          email: loginData.email,
          callbackURL: "/home",
          fetchOptions: {
            onSuccess: () => {
              toast.success("Login successful", { id: "signin" });
            },
          },
        });

        if (res?.error) {
          toast.error(res.error.message || "Login failed", { id: "signin" });
          console.log(res.error);
          return;
        }
        if (res?.data) {
          toast.success("Login successful", { id: "signin" });
        }
      } catch (error) {
        toast.error(
          `Login failed: ${error instanceof Error ? error.message : "Unknown error"}`,
          { id: "signin" }
        );
        console.log(error);
      }
    },
  });

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const result = zodLoginSchema.safeParse(loginInfo);
    if (!result.success) {
      result.error.errors.forEach((err) => toast.error(err.message));
      return;
    }
    LoginMut.mutate(result.data);
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-white dark:bg-gray-950">
      {/* Animated pastel gradient blobs */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-24 -left-24 h-80 w-80 rounded-full bg-gradient-to-r from-blue-400/30 via-purple-400/30 to-pink-400/30 blur-3xl animate-slow-float" />
        <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-gradient-to-r from-cyan-400/20 to-blue-500/20 blur-3xl animate-slow-float [animation-delay:300ms]" />
      </div>

      {/* Decorative multicolor strips */}
      <Strips stripConut={3} className="absolute top-[5rem] left-[-12rem] w-[580px] gap-5 -rotate-45" height={2} />
      <Strips stripConut={3} className="absolute bottom-[5rem] right-[-12rem] w-[580px] gap-5 -rotate-45" height={2} />

      {/* Centered container */}
      <div className="relative z-10 mx-auto flex min-h-screen max-w-7xl items-center justify-center px-4">
        <Card className="w-full max-w-md border border-white/20 bg-white/70 backdrop-blur-xl dark:border-white/10 dark:bg-gray-900/60 rounded-3xl shadow-xl">
          <CardHeader className="space-y-2">
            <div className="mx-auto inline-flex items-center rounded-full border border-blue-500/20 bg-gradient-to-r from-blue-500/10 to-purple-500/10 px-4 py-1 text-xs font-semibold text-blue-700 dark:text-purple-300">
              Welcome back
            </div>
            <CardTitle className="text-center text-3xl font-black tracking-tight">
              <span className="text-gray-900 dark:text-white">Sign in to</span>{" "}
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                your account
              </span>
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-6">
            <form
              className="flex flex-col gap-4"
              onSubmit={handleSubmit}
              aria-label="Login form"
            >
              <InputBox
                label="Email"
                type="email"
                placeholder="you@example.com"
                disabled={LoginMut.isPending}
                onChange={(e) => setLoginInfo({ ...loginInfo, email: e })}
                value={loginInfo.email}
                className="w-full"
              />

              <InputBox
                label="Password"
                type="password"
                placeholder="••••••••"
                disabled={LoginMut.isPending}
                onChange={(e) => setLoginInfo({ ...loginInfo, password: e })}
                value={loginInfo.password}
                className="w-full"
              />

              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500 dark:text-gray-400">
                  Use your email and password
                </span>
                <a
                  href="/forgot-password"
                  className="font-medium text-blue-600 hover:underline dark:text-purple-300"
                >
                  Forgot password?
                </a>
              </div>

              <Button
                type="submit"
                size="lg"
                disabled={LoginMut.isPending}
                className="group relative mt-2 w-full rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 text-white transition-all duration-300 hover:from-blue-700 hover:to-purple-700 hover:shadow-2xl hover:shadow-blue-500/25"
              >
                {LoginMut.isPending ? (
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                ) : null}
                <span className="relative z-10 inline-flex items-center">
                  Sign in
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-0.5" />
                </span>
                <span className="absolute inset-0 -z-10 rounded-2xl opacity-0 blur-xl transition-opacity duration-300 group-hover:opacity-100 bg-gradient-to-r from-blue-700 to-purple-700" />
              </Button>
            </form>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-gray-200 dark:border-gray-800" />
              </div>
              <div className="relative flex justify-center">
                <span className="bg-white px-3 text-xs uppercase tracking-wider text-gray-500 dark:bg-gray-900 dark:text-gray-400">
                  or continue with
                </span>
              </div>
            </div>

            {/* Social sign on (icons with subtle rings) */}
            <div className="flex items-center justify-center gap-3">
              <SocialSignOn />
            </div>
          </CardContent>

          <CardFooter className="flex flex-col items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
            <span>
              New here?{" "}
              <a
                href="/register"
                className="font-medium text-blue-600 hover:underline dark:text-purple-300"
              >
                Create an account
              </a>
            </span>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
