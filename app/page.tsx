"use client";
import { authClient } from "@/lib/auth-client";

import { Nav } from "@/components/Nav";
import Image from "next/image";

export default function Home() {
      const { data: session, isPending, error } = authClient.useSession();
  
  return (
    <div className="relative flex flex-col  min-h-screen  overflow-hidden">
        <Nav session={session} SignOut={authClient.signOut} />
    </div>
  );
}
