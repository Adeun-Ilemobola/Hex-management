"use client";

import React, { useState } from "react";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Loader2, ArrowRight } from "lucide-react";

import Strips from "@/components/Designs/strip";
import InputBox, { SelectorBox } from "@/components/InputBox";
import SocialSignOn from "@/components/SocialSignOn";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

import { zodRegisterSchema } from "@/lib/Zod";
import { authClient } from "@/lib/auth-client";
import { countries } from "@/lib/utils";

export default function Page() {
  const router = useRouter();

  const [registerInfo, setRegisterInfo] = useState<z.infer<typeof zodRegisterSchema>>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phoneNumber: "",
    country: "",
    terms: true,
  });

  const registerMut = useMutation({
    mutationFn: async (con: z.infer<typeof zodRegisterSchema>) => {
      toast.loading("Creating your account…", { id: "signup" });
      await authClient.signUp.email(
        {
          name: con.name,
          email: con.email,
          password: con.password,
          country: con.country ?? "Unknown",
          phoneNumber: con.phoneNumber,
        },
        {
          onSuccess: () => {
            toast.success("Successfully signed up", { id: "signup" });
            router.push("/home");
          },
          onError(context) {
            toast.error(context.error.message, { id: "signup" });
          },
        }
      );
    },
  });

  const getCountryData = useMutation({
    mutationFn: async (country: string) => {
      const response = await fetch(`https://restcountries.com/v3.1/name/${encodeURIComponent(country)}`);
      if (!response.ok) throw new Error("Network response was not ok");
      return response.json();
    },
    onError: (error) => {
      toast.error("Error fetching country data");
      console.error("Error fetching country data:", error);
    },
  });

  function setCountry(e: string, _identify: string) {
    if (!e || e === registerInfo.country || e === "None") return;
    setRegisterInfo((prev) => ({ ...prev, country: e }));
    getCountryData.mutate(e);
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const result = zodRegisterSchema.safeParse(registerInfo);
    if (!result.success) {
      result.error.errors.forEach((err) => toast.error(err.message));
      return;
    }
    registerMut.mutate(result.data);
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-white dark:bg-gray-950">
      {/* Animated pastel gradient blobs */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-24 -left-24 h-80 w-80 rounded-full bg-gradient-to-r from-blue-400/30 via-purple-400/30 to-pink-400/30 blur-3xl animate-slow-float" />
        <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-gradient-to-r from-cyan-400/20 to-blue-500/20 blur-3xl animate-slow-float [animation-delay:300ms]" />
      </div>

      {/* Decorative multicolor strips */}
      <Strips stripConut={3} className="absolute top-[4rem] left-[-10rem] w-[520px] gap-5 -rotate-45" height={2} />
      <Strips stripConut={3} className="absolute bottom-[4rem] right-[-10rem] w-[520px] gap-5 -rotate-45" height={2} />

      {/* Centered container */}
      <div className="relative z-10 mx-auto flex min-h-screen max-w-7xl items-center justify-center px-4">
        <Card className="w-full max-w-2xl rounded-3xl border border-white/20 bg-white/70 shadow-2xl backdrop-blur-xl dark:border-white/10 dark:bg-gray-900/60">
          <CardHeader className="space-y-2">
            <div className="mx-auto inline-flex items-center rounded-full border border-blue-500/20 bg-gradient-to-r from-blue-500/10 to-purple-500/10 px-4 py-1 text-xs font-semibold text-blue-700 dark:text-purple-300">
              Create your account
            </div>
            <CardTitle className="text-center text-3xl font-black tracking-tight">
              <span className="text-gray-900 dark:text-white">Get started with</span>{" "}
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                a free account
              </span>
            </CardTitle>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <InputBox
                disabled={registerMut.isPending}
                label="Name"
                type="text"
                value={registerInfo.name}
                onChange={(e) => setRegisterInfo((prev) => ({ ...prev, name: e }))}
                placeholder="Jane Doe"
                className="w-full"
              />
              <InputBox
                disabled={registerMut.isPending}
                label="Email"
                type="email"
                value={registerInfo.email}
                onChange={(e) => setRegisterInfo((prev) => ({ ...prev, email: e }))}
                placeholder="you@example.com"
                className="w-full"
              />
              <InputBox
                disabled={registerMut.isPending}
                label="Password"
                type="password"
                value={registerInfo.password}
                onChange={(e) => setRegisterInfo((prev) => ({ ...prev, password: e }))}
                placeholder="••••••••"
                className="w-full"
              />
              <InputBox
                disabled={registerMut.isPending}
                label="Confirm password"
                type="password"
                value={registerInfo.confirmPassword}
                onChange={(e) => setRegisterInfo((prev) => ({ ...prev, confirmPassword: e }))}
                placeholder="••••••••"
                className="w-full"
              />
              <InputBox
                disabled={registerMut.isPending}
                label="Phone number"
                type="text"
                value={registerInfo.phoneNumber}
                onChange={(e) => setRegisterInfo((prev) => ({ ...prev, phoneNumber: e }))}
                placeholder="+1 604 555 1234"
                className="w-full"
              />

              <SelectorBox
                isDisable={registerMut.isPending}
                label="Country"
                identify="country"
                value={registerInfo.country}
                setValue={(e) => setCountry(e, "country")}
                options={[
                  { value: "None", label: "None" },
                  ...countries.map((country) => ({ value: country, label: country })),
                ]}
              />

              <div className="md:col-span-2 mt-2 flex items-center gap-2">
                <Switch
                  checked={registerInfo.terms}
                  onCheckedChange={(c) =>
                    setRegisterInfo((pre) => ({
                      ...pre,
                      terms: Boolean(c) as true,
                    }))
                  }
                  id="terms"
                />
                <Label htmlFor="terms" className="text-sm text-gray-600 dark:text-gray-300">
                  I accept the{" "}
                  <a href="/terms" className="text-blue-600 hover:underline dark:text-purple-300">
                    terms and conditions
                  </a>
                </Label>
              </div>

              <div className="md:col-span-2 mt-1">
                <Button
                  type="submit"
                  disabled={registerMut.isPending}
                  className="group relative w-full rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 text-white transition-all duration-300 hover:from-blue-700 hover:to-purple-700 hover:shadow-2xl hover:shadow-blue-500/25"
                  size="lg"
                >
                  {registerMut.isPending ? (
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  ) : null}
                  <span className="relative z-10 inline-flex items-center">
                    Register
                    <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-0.5" />
                  </span>
                  <span className="absolute inset-0 -z-10 rounded-2xl opacity-0 blur-xl transition-opacity duration-300 group-hover:opacity-100 bg-gradient-to-r from-blue-700 to-purple-700" />
                </Button>
              </div>

              {/* Divider */}
              <div className="md:col-span-2 relative my-2">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-gray-200 dark:border-gray-800" />
                </div>
                <div className="relative flex justify-center">
                  <span className="bg-white px-3 text-xs uppercase tracking-wider text-gray-500 dark:bg-gray-900 dark:text-gray-400">
                    or continue with
                  </span>
                </div>
              </div>

              <div className="md:col-span-2 flex items-center justify-center gap-3">
                <SocialSignOn />
              </div>

              <div className="md:col-span-2 text-center text-sm text-gray-600 dark:text-gray-400">
                Already have an account?{" "}
                <a href="/login" className="font-medium text-blue-600 hover:underline dark:text-purple-300">
                  Sign in
                </a>
              </div>
            </form>
          </CardContent>

          <CardFooter />
        </Card>
      </div>
    </div>
  );
}
