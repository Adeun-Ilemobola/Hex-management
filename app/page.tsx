"use client";
import { authClient } from "@/lib/auth-client";

import { Nav } from "@/components/Nav";


export default function Home() {
      const { data: session } = authClient.useSession();
  
  return (
    <div className="relative flex flex-col  min-h-screen  overflow-hidden">
        <Nav session={session} SignOut={authClient.signOut} />
    </div>
  );
}
