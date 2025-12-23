"use client";
import { authClient } from "@/lib/auth-client";

import { Nav } from "@/components/Nav";
import DropBack from "@/components/DropBack";

import PropertyInvestmentLanding from "@/components/Property/PropertyInvestmentLanding";


export default function Home() {
  const { data: session, isPending } = authClient.useSession();
  console.log(session);
  

  return (
    <DropBack is={isPending} isTextMessage={{ data: "Loading..." }}>
      <div className="relative flex flex-col  min-h-screen  overflow-hidden">
        <Nav session={session} SignOut={() => authClient.signOut()} />

        <PropertyInvestmentLanding />
        
      </div>
    </DropBack>
  );
}
