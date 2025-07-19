"use client";
import { authClient } from "@/lib/auth-client";

import { Nav } from "@/components/Nav";
import DropBack from "@/components/DropBack";
import PropertyCard from "@/components/(propertyFragments)/propertyCard";
import { sampleProperties } from "@/lib/Zod";


export default function Home() {
  const { data: session, isPending } = authClient.useSession();

  return (
    <DropBack is={isPending} isTextMessage={{ data: "Loading..." }}>
      <div className="relative flex flex-col  min-h-screen  overflow-hidden">
        <Nav session={session} SignOut={authClient.signOut} />

        <div className="flex flex-1 gap-2.5 justify-center items-center">
          {sampleProperties.map((data) => (
            <PropertyCard key={data.id} data={data} mode={true} />
          ))}

        </div>
      </div>
    </DropBack>
  );
}
