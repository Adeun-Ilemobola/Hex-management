"use client";
import { authClient } from "@/lib/auth-client";

import { Nav } from "@/components/Nav";
import DropBack from "@/components/DropBack";
import PropertyCard from "@/components/(propertyFragments)/propertyCard";


export default function Home() {
      const { data: session ,isPending } = authClient.useSession();
  
  return (
    <DropBack is={isPending} isTextMessage={{ data: "Loading..." }}>
    <div className="relative flex flex-col  min-h-screen  overflow-hidden">
        <Nav session={session} SignOut={authClient.signOut} />

        <div className="flex flex-1 justify-center items-center">
          <PropertyCard
            data={{
              img: "https://images.unsplash.com/photo-1522071820081-009f0129c71a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
              name: "Property 1",
              address: "123 Main St, City, State",
              status: "Available",
              saleStatus: "For Sale",
              id: "1",
            }}
            mode
          />
        </div>
    </div>
    </DropBack>
  );
}
