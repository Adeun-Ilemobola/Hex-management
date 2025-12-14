

# 🏠 Hex Management



**Hex Management** is a modern **real estate management platform** built with [**Next.js**](https://nextjs.org/), [**Prisma**](https://www.prisma.io/), and [**BetterAuth**](https://github.com/BetterAuth). It streamlines **property lifecycle management**, **investment tracking**, and **team collaboration** in a secure, role-based environment.

🏠 **Property Listings** — Create and manage properties with images, descriptions, and *advanced pricing metrics* to calculate optimal **rental**, **lease**, or **sale** values.
👥 **Organizations & Roles** — Structure access with organizations where employees cannot create independent orgs. Govern with role-based permissions: `owner`, `admin`, `member`.
💬 **Real-Time Chat** — Communicate inside the platform with live chat between organization members, direct 1:1 messages, and auto-generated **group chats** for properties with **external investors**.
📧 **Investor Onboarding** — Invite investors via secure **email verification** powered by [**Resend**](https://resend.com/), with access codes and onboarding flows.
💳 **Subscriptions** — Powered by [**Stripe**](https://stripe.com/) for **Free**, **Deluxe**, and **Premium** tiers, ensuring secure billing and protection of sensitive user information.
🔗 **Future-Proofing** — Planned support for **account linking**, letting users connect and manage multiple accounts under a single profile.
📢 **Notifications & Engagement** — Built-in notifications, role management, and investor engagement keep teams and stakeholders aligned.
☁️ **Cloud Storage** — Store property images with **Supabase Storage** (with a planned migration to **Amazon S3** for scale).

✨ With integrated **chat**, **subscriptions**, **investor flows**, and **role-based access**, `Hex Management` unifies **real estate management**, **collaboration**, and **investment operations** into one powerful platform.

---

In the future, the platform will include an **AI-powered pricing engine** to automatically generate the best rates based on property data and market trends.
---

## ✨ Key Features

- **Property Management**  
  Create, edit, update, and view property listings with images, metadata, and detailed features.

- **Investment Blocks**  
  Manage property sales, rentals, and leases with investment blocks; track contribution percentages and investor participation.

- **External Investor Onboarding**  
  Invite investors via **Resend email**, with secure verification links and access code validation.

- **Organization Management**  
  Create organizations, assign roles (`member`, `admin`, `owner`), update roles, and manage memberships.

- **Chat & Messaging**  
  Real-time private and group chat rooms; send messages with images, unread notifications, and rate-limiting for spam control.

- **Subscription Plans**  
  Integrate with **Stripe** for Free, Deluxe, and Premium tiers; supports upgrades, trialing, and plan enforcement.

- **User Account & Profiles**  
  OAuth + password setup, user search by email, profile management, and plan resolution (personal vs. org-level).

- **Email Notifications**  
  Transactional emails for onboarding, verification, role updates, and external investor confirmation.

- **Cloud Storage**  
  Store property images via **Supabase Storage** with deletion support (future migration to **Amazon S3**).

- **Rate Limiting & Security**  
  Upstash Redis integration for API rate limiting; token/session handling for secure requests.


---

## 🛠️ Tech Stack

**Core**
- [Next.js](https://nextjs.org/) 15.3+
- [React](https://react.dev/) 19
- [TypeScript](https://www.typescriptlang.org/)
- [Bun](https://bun.sh/) Runtime & Package Manager
- [Prisma](https://www.prisma.io/) ORM
- [tRPC](https://trpc.io/) for type-safe APIs
- [BetterAuth](https://better-auth.com/) for authentication
- [Supabase](https://supabase.com/) for storage and Postgres hosting
- [Stripe](https://stripe.com/) for subscription billing
- [Zod](https://zod.dev/) for schema validation

**UI**
- [Tailwind CSS](https://tailwindcss.com/) v4
- [Radix UI](https://www.radix-ui.com/) components
- [Lucide Icons](https://lucide.dev/)

**Email**
- [Resend](https://resend.com/) for transactional emails
- [Nodemailer](https://nodemailer.com/) fallback

**Utilities**
- [Luxon](https://moment.github.io/luxon/) for date/time calculations
- [Axios](https://axios-http.com/) for HTTP requests
- [randomcolor](https://www.npmjs.com/package/randomcolor) for UI accents

---

## 📦 Installation

```bash
# Clone repository
git clone [https://github.com/](https://github.com/)<your-username>/hex-management.git
cd hex-management

# Install dependencies
bun install

# Setup environment variables
cp .env.example .env.local
# Fill in your keys and secrets

# Prisma migrations
bunx prisma migrate dev

# Run development server
bun dev
```

---

## 🔑 Environment Variables

> Copy these into `.env` locally and your deployment’s secret manager.  
> **Never commit real secrets**—commit `.env.example` instead.

### Core
- `NODE_ENV`: Node runtime mode (`development` | `production`).
- `NEXTAUTH_URL`: Base URL used for auth callbacks and in-app links.
- `NEXT_PUBLIC_TRPC_URL`: Client tRPC endpoint.

### Better Auth
- `BETTER_AUTH_SECRET`: Session/token signing secret (keep private).
- `BETTER_AUTH_URL`: Public base URL used by the auth client/server.

### Database (Supabase Postgres)
- `DATABASE_URL`: Pooled connection for app runtime (`:6543`, `pgbouncer=true`).
- `DIRECT_URL`: Direct connection for migrations (`:5432`).

### Supabase (client)
- `NEXT_PUBLIC_SUPABASE_URL`: Supabase project URL (public).
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Public anon key (browser-safe).

### OAuth Providers
- `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET`
- `REDDIT_CLIENT_ID` / `REDDIT_CLIENT_SECRET`
- `DISCORD_CLIENT_ID` / `DISCORD_CLIENT_SECRET`
- `GITHUB_CLIENT_ID` / `GITHUB_CLIENT_SECRET`

### Email (Resend)
- `RESEND_API_KEY`: Transactional email API key.

### Payments (Stripe)
- `STRIPE_SECRET_KEY`: Server key for Stripe.
- `STRIPE_PUBLISHABLE_KEY`: Client publishable key.
- `STRIPE_WEBHOOK_SECRET`: Webhook signature verification secret.

### Rate Limiting / Caching
- `UPSTASH_REDIS_REST_URL`: Upstash Redis REST endpoint.
- `UPSTASH_REDIS_REST_TOKEN`: Upstash REST auth token.


> ⚠️ Never commit `.env.local` to GitHub — only commit `.env.example` with placeholder values.

---

## 📚 API Endpoints (tRPC)


### **SubscriptionRouter**

Handles user or organization subscription upgrades.

| Endpoint               | Method   | Purpose                                                                                   |
| ---------------------- | -------- | ----------------------------------------------------------------------------------------- |
| `UpgradeSubscription`  | mutation | Upgrade or create a subscription (Deluxe/Premium). Uses Stripe + auth API. Fails if "free". |


### **PropertiesRouter**


Manages property lifecycle, investment blocks, external investor onboarding, and profile data.

| Endpoint                   | Method   | Purpose                                                                                         |
| ------------------------- | -------- | ----------------------------------------------------------------------------------------------- |
| `getUserProperties`       | query    | List properties visible to the user (owned or org-owned) with optional search/status filters.  |
| `getPropertie`            | query    | Get a single property with images, investment block, and external investors.                   |
| `postPropertie`           | mutation | Create property + images + investment block; invite external investors; create group chat; emails. |
| `updataPropertie`         | mutation | Update property, images, investment block; upsert external investors and notify new ones.      |
| `deleteImage`             | mutation | Remove an image from DB and storage.                                                            |
| `updataExternalInvestor`  | mutation | Update details for one external investor.                                                       |
| `getUserProfle`           | query    | Get authenticated user profile (selected fields).                                               |
| `updateUserProfle`        | mutation | Update authenticated user profile details.                                                      |
| `viewProperty`            | query    | Public-friendly property view with images, price, and key features.                            |
| `getPropertieNameById`    | query    | Fetch property name by id.                                                                      |
| `acceptInvitePropertie`   | mutation | Verify or deny an investor invite using access code; link user to investment on verify.        |




---





Handles account-level settings and subscriptions.

| Endpoint              | Method   | Purpose                                                                          |
| --------------------- | -------- | -------------------------------------------------------------------------------- |
| `setPasswordForOAuth` | mutation | Add/change password for OAuth or credentials-based users.                        |
| `getUserPlan`         | query    | Get current plan, days left; handle expired subs (archive, rollover, downgrade). |

---

### **OrganizationRouter**

Manages organization membership, onboarding, and role administration.

| Endpoint                 | Method    | Purpose                                                                 |
| ------------------------ | --------- | ----------------------------------------------------------------------- |
| `getActiveMember`        | query     | Get the logged-in user’s active membership (if role is `member` or `admin`). |
| `onboardUserToOrg`       | mutation  | Invite existing/new users to join an organization; sends invite or magic link. |
| `finishOnboarding`       | query     | Complete onboarding for a signed-in new user; add them to the org.       |
| `getAllOrganization`     | query     | List all organizations where the user is an owner; includes member counts. |
| `getOrganization`        | query     | Fetch full organization details with metadata and subscription info.     |
| `createOrganization`     | mutation  | Create a new organization (requires subscription, enforces plan limits). |
| `updateMemberRole`       | mutation  | Update or remove a member’s role (admin/owner/member); sends email notice. |
| `getOwnerOrganizations`  | query     | List organizations owned by the user, including seats and subscription data. |
| `getFullOrganizationInfo`| query     | Fetch detailed organization info including metadata, members, and invites. |


---

### **ChatRoomRouter**

Manages user chat rooms, messages, and per-room notifications.

| Endpoint               | Method   | Purpose                                                                                 |
| --------------------- | -------- | --------------------------------------------------------------------------------------- |
| `getUserRooms`        | query    | List rooms the user belongs to; includes other participants, membership info, and badges. |
| `getRoomChatById`     | query    | Fetch a room (by `roomId`) and its messages (with images).                               |
| `newMessage`          | mutation | Send a message to a room; saves images and bumps unread for other members.               |
| `userRooms`           | query    | Alternate listing of user rooms with sanitized participant info and unread count.        |
| `getUserChats`        | query    | Get ordered messages for a room and reset caller’s unread counter to 0.                  |
| `createRoom`          | mutation | Create a new PRIVATE 1:1 room (enforces plan limits, avoids duplicates).                 |
| `userRoomNotification`| mutation | Reset the caller’s notification count for a specific room.                               |


---

### **UserConfigRouter**

Account credentials, plan resolution, user lookup, and magic-link verification.

| Endpoint              | Method   | Purpose                                                                                 |
| -------------------- | -------- | --------------------------------------------------------------------------------------- |
| `setPasswordForOAuth`| mutation | Set or change password: create credential password if none; else change with current → new. |
| `getUserPlan`        | query    | Get active plan: prefer org metadata if user is member/admin; else use user subscription. |
| `SearchUserByEmail`  | mutation | Search publicly visible users by email; returns lightweight profile cards.             |
| `magicLinkVerify`    | query    | Verify a magic-link token and return provider response.                                |
---
## 📌 Roadmap

* **AI-powered pricing engine** — Auto-calculate optimal rent, lease, or sale price.
* **S3 migration** — Move from Supabase Storage to Amazon S3 for scalability.
* **Real-time chat** — Chat rooms for investors and tenants per property.
* **Advanced reporting** — Export investment/property data to CSV/Excel.
* **One-click investor acceptance** — Accept partnership directly from email.

---

## 🧩 Dependencies

### Core Dependencies

See `package.json` for full list. Highlights:

```jsonc
"@prisma/client": "^6.10.0",
"@supabase/supabase-js": "^2.50.0",
"@trpc/server": "^11.1.3",
"better-auth": "^1.2.8",
"lucide-react": "^0.511.0",
"luxon": "^3.7.1",
"next": "15.3.2",
"react": "^18.2.0",
"resend": "^4.6.0",
"stripe": "^18.2.1",
"tailwindcss": "^4",
"zod": "^3.24.4"
```

---

## 🚀 Contributing

1. Fork the repository.
2. Create a branch: `git checkout -b feature/your-feature`.
3. Commit your changes: `git commit -m 'Add my feature'`.
4. Push to the branch: `git push origin feature/your-feature`.
5. Submit a pull request.

---

## 📄 License

<!-- This project is licensed under the **MIT License** — see the [LICENSE](./LICENSE) file for details. -->

```

---

```
