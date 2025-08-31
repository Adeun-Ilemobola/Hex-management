import { createAuthClient } from "better-auth/react" // make sure to import from better-auth/react
import { inferAdditionalFields } from "better-auth/client/plugins";
import { organizationClient } from "better-auth/client/plugins"
import { stripeClient } from "@better-auth/stripe/client"
import { magicLinkClient } from "better-auth/client/plugins";

import type { auth } from "@/lib/auth";
export const authClient = createAuthClient({
    plugins: [
        inferAdditionalFields<typeof auth>(),
        organizationClient(),
        stripeClient({
             subscription: true
        }),
        magicLinkClient()
    ]

})
export type Session = typeof authClient.$Infer.Session

