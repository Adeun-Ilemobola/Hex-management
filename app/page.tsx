"use client";
import { authClient } from "@/lib/auth-client";

import { Nav } from "@/components/Nav";
import DropBack from "@/components/DropBack";


export default function Home() {
      const { data: session ,isPending } = authClient.useSession();
  
  return (
    <DropBack is={isPending} isTextMessage={{ data: "Loading..." }}>
    <div className="relative flex flex-col  min-h-screen  overflow-hidden">
        <Nav session={session} SignOut={authClient.signOut} />
    </div>
    </DropBack>
  );
}
