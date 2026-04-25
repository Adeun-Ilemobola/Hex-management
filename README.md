# Hex Management

Hex Management is a full-stack real estate management platform for property owners, organizations, teams, and external investors. The application brings property management, investment tracking, investor onboarding, subscription billing, team permissions, and real-time communication into one role-based system.

Built with Next.js, TypeScript, Prisma, tRPC, Better Auth, Supabase, Stripe, Resend, and Upstash Redis.

---

## Overview

Hex Management is designed to help real estate teams manage the full property lifecycle from listing creation to investor participation. Users can create and manage properties, upload images, define pricing and investment details, invite external investors, communicate through private and group chat rooms, and enforce access through organizations and roles.

The platform supports both personal and organization-based workflows, making it suitable for individual property managers, investment teams, and real estate businesses that need structured collaboration and secure access control.

---

## Core Features

### Property Management

* Create, edit, update, view, and delete property listings.
* Manage property images, descriptions, metadata, pricing, and detailed property features.
* Support rental, lease, and sale-based property workflows.
* Store and manage property media through Supabase Storage.

### Investment Management

* Create investment blocks for property sales, rentals, and leases.
* Track investor participation and contribution percentages.
* Link external investors to property investment records after invite verification.
* Support property-specific investor collaboration.

### External Investor Onboarding

* Invite external investors through transactional email.
* Send secure verification links and access codes using Resend.
* Validate investor access before linking them to property investment data.
* Support onboarding flows for investors who do not yet have an account.

### Organization and Role Management

* Create and manage organizations.
* Assign and update member roles using role-based permissions.
* Supported roles include `owner`, `admin`, and `member`.
* Restrict employee/member access based on organization rules.
* Manage organization-level subscriptions, seats, members, and onboarding.

### Chat and Messaging

* Real-time private and group chat rooms.
* Direct 1:1 messaging between users.
* Property-related group chats for teams and external investors.
* Message image support, unread message counts, and notification resets.
* Rate limiting to reduce spam and abuse.

### Subscription Billing

* Stripe-powered subscription plans.
* Supports Free, Deluxe, and Premium tiers.
* Handles upgrades, trials, plan enforcement, and subscription status checks.
* Supports personal and organization-level plan resolution.

### Authentication and User Accounts

* Authentication powered by Better Auth.
* OAuth and credentials-based account support.
* Password setup for OAuth users.
* Magic-link verification support.
* User profile management and email-based user search.

### Email Notifications

* Transactional email support through Resend.
* Sends onboarding, verification, role update, and investor confirmation emails.
* Nodemailer fallback support for email workflows.

### Security and Rate Limiting

* Session and token-based request protection.
* API rate limiting through Upstash Redis.
* Role-based access checks for organization and property actions.
* Environment-based secret management.

---

## Tech Stack

### Framework and Runtime

* [Next.js](https://nextjs.org/) 15.3+
* [React](https://react.dev/) 19
* [TypeScript](https://www.typescriptlang.org/)
* [Bun](https://bun.sh/) runtime and package manager

### Backend and Data

* [Prisma](https://www.prisma.io/) ORM
* [tRPC](https://trpc.io/) for type-safe APIs
* [Supabase](https://supabase.com/) for Postgres hosting and storage
* [Zod](https://zod.dev/) for schema validation

### Authentication and Authorization

* [Better Auth](https://better-auth.com/) for authentication
* Role-based organization access control

### Payments and Email

* [Stripe](https://stripe.com/) for subscription billing
* [Resend](https://resend.com/) for transactional email
* [Nodemailer](https://nodemailer.com/) as an email fallback

### UI

* [Tailwind CSS](https://tailwindcss.com/) v4
* [Radix UI](https://www.radix-ui.com/) components
* [Lucide Icons](https://lucide.dev/)

### Infrastructure and Utilities

* [Upstash Redis](https://upstash.com/) for rate limiting
* [Luxon](https://moment.github.io/luxon/) for date and time handling
* [Axios](https://axios-http.com/) for HTTP requests
* `randomcolor` for UI accent generation

---

## Getting Started

### Prerequisites

Make sure the following tools are installed:

* Bun
* Node.js
* PostgreSQL or a Supabase Postgres database
* Stripe account
* Resend account
* Upstash Redis database

### Installation

```bash
git clone https://github.com/<your-username>/hex-management.git
cd hex-management
bun install
```

### Environment Setup

Create a local environment file:

```bash
cp .env.example .env.local
```

Then fill in the required environment variables.

### Database Setup

Run Prisma migrations:

```bash
bunx prisma migrate dev
```

Optional Prisma commands:

```bash
bunx prisma generate
bunx prisma studio
```

### Development Server

Start the development server:

```bash
bun dev
```

The application will be available at:

```bash
http://localhost:3000
```

---

## Environment Variables

Never commit real secrets to GitHub. Keep real values in `.env.local` or your deployment secret manager, and only commit placeholder values in `.env.example`.

### Core

| Variable               | Description                                                       |
| ---------------------- | ----------------------------------------------------------------- |
| `NODE_ENV`             | Runtime mode: `development` or `production`.                      |
| `NEXTAUTH_URL`         | Base URL used for authentication callbacks and application links. |
| `NEXT_PUBLIC_TRPC_URL` | Public tRPC endpoint used by the client.                          |

### Better Auth

| Variable             | Description                                         |
| -------------------- | --------------------------------------------------- |
| `BETTER_AUTH_SECRET` | Secret used for signing auth sessions and tokens.   |
| `BETTER_AUTH_URL`    | Public base URL used by the auth client and server. |

### Database

| Variable       | Description                                                 |
| -------------- | ----------------------------------------------------------- |
| `DATABASE_URL` | Pooled database connection used by the application runtime. |
| `DIRECT_URL`   | Direct database connection used by Prisma migrations.       |

### Supabase

| Variable                        | Description                                            |
| ------------------------------- | ------------------------------------------------------ |
| `NEXT_PUBLIC_SUPABASE_URL`      | Public Supabase project URL.                           |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Public Supabase anon key used by browser-safe clients. |

### OAuth Providers

| Variable                | Description                  |
| ----------------------- | ---------------------------- |
| `GOOGLE_CLIENT_ID`      | Google OAuth client ID.      |
| `GOOGLE_CLIENT_SECRET`  | Google OAuth client secret.  |
| `REDDIT_CLIENT_ID`      | Reddit OAuth client ID.      |
| `REDDIT_CLIENT_SECRET`  | Reddit OAuth client secret.  |
| `DISCORD_CLIENT_ID`     | Discord OAuth client ID.     |
| `DISCORD_CLIENT_SECRET` | Discord OAuth client secret. |
| `GITHUB_CLIENT_ID`      | GitHub OAuth client ID.      |
| `GITHUB_CLIENT_SECRET`  | GitHub OAuth client secret.  |

### Email

| Variable         | Description                              |
| ---------------- | ---------------------------------------- |
| `RESEND_API_KEY` | Resend API key for transactional emails. |

### Stripe

| Variable                 | Description                                   |
| ------------------------ | --------------------------------------------- |
| `STRIPE_SECRET_KEY`      | Stripe server-side secret key.                |
| `STRIPE_PUBLISHABLE_KEY` | Stripe client-side publishable key.           |
| `STRIPE_WEBHOOK_SECRET`  | Stripe webhook signature verification secret. |

### Rate Limiting

| Variable                   | Description                              |
| -------------------------- | ---------------------------------------- |
| `UPSTASH_REDIS_REST_URL`   | Upstash Redis REST endpoint.             |
| `UPSTASH_REDIS_REST_TOKEN` | Upstash Redis REST authentication token. |

---

## API Structure

The application uses tRPC routers to organize backend functionality.

### Subscription Router

| Endpoint              | Type     | Description                                                             |
| --------------------- | -------- | ----------------------------------------------------------------------- |
| `UpgradeSubscription` | Mutation | Creates or upgrades a user or organization subscription through Stripe. |

### Properties Router

| Endpoint                 | Type     | Description                                                                                                             |
| ------------------------ | -------- | ----------------------------------------------------------------------------------------------------------------------- |
| `getUserProperties`      | Query    | Lists properties visible to the authenticated user, including owned and organization-owned properties.                  |
| `getPropertie`           | Query    | Fetches a single property with images, investment details, and external investors.                                      |
| `postPropertie`          | Mutation | Creates a property, uploads images, creates investment data, invites investors, creates a group chat, and sends emails. |
| `updataPropertie`        | Mutation | Updates property details, images, investment data, and external investor records.                                       |
| `deleteImage`            | Mutation | Deletes a property image from the database and storage provider.                                                        |
| `updataExternalInvestor` | Mutation | Updates information for an external investor.                                                                           |
| `getUserProfle`          | Query    | Fetches selected authenticated user profile fields.                                                                     |
| `updateUserProfle`       | Mutation | Updates authenticated user profile details.                                                                             |
| `viewProperty`           | Query    | Returns a public-friendly property view with images, pricing, and key features.                                         |
| `getPropertieNameById`   | Query    | Fetches a property name by ID.                                                                                          |
| `acceptInvitePropertie`  | Mutation | Verifies an investor invite using an access code and links the user to the investment record.                           |

> Note: Some endpoint names currently contain spelling inconsistencies such as `Propertie`, `updata`, and `Profle`. Consider renaming them before the project becomes harder to refactor.

### Organization Router

| Endpoint                  | Type     | Description                                                                    |
| ------------------------- | -------- | ------------------------------------------------------------------------------ |
| `getActiveMember`         | Query    | Gets the authenticated user’s active organization membership.                  |
| `onboardUserToOrg`        | Mutation | Invites an existing or new user to join an organization.                       |
| `finishOnboarding`        | Query    | Completes onboarding for a signed-in user and adds them to the organization.   |
| `getAllOrganization`      | Query    | Lists organizations owned by the authenticated user.                           |
| `getOrganization`         | Query    | Fetches organization details, metadata, members, and subscription information. |
| `createOrganization`      | Mutation | Creates a new organization and enforces subscription-based limits.             |
| `updateMemberRole`        | Mutation | Updates or removes a member role and sends an email notification.              |
| `getOwnerOrganizations`   | Query    | Lists organizations owned by the user with seat and subscription data.         |
| `getFullOrganizationInfo` | Query    | Fetches detailed organization metadata, members, invites, and related data.    |

### Chat Room Router

| Endpoint               | Type     | Description                                                                       |
| ---------------------- | -------- | --------------------------------------------------------------------------------- |
| `getUserRooms`         | Query    | Lists chat rooms the user belongs to, including participants and badges.          |
| `getRoomChatById`      | Query    | Fetches a room and its messages by room ID.                                       |
| `newMessage`           | Mutation | Sends a message, stores images, and updates unread counts for other members.      |
| `userRooms`            | Query    | Lists sanitized user rooms with unread message counts.                            |
| `getUserChats`         | Query    | Fetches ordered room messages and resets the caller’s unread count.               |
| `createRoom`           | Mutation | Creates a private 1:1 chat room while enforcing plan limits and duplicate checks. |
| `userRoomNotification` | Mutation | Resets the caller’s notification count for a room.                                |

### User Config Router

| Endpoint              | Type     | Description                                                                      |
| --------------------- | -------- | -------------------------------------------------------------------------------- |
| `setPasswordForOAuth` | Mutation | Sets or changes a password for OAuth or credentials-based accounts.              |
| `getUserPlan`         | Query    | Resolves the active user plan, preferring organization metadata when applicable. |
| `SearchUserByEmail`   | Mutation | Searches visible users by email and returns lightweight profile cards.           |
| `magicLinkVerify`     | Query    | Verifies a magic-link token and returns provider response data.                  |

---

## Current Status

Hex Management is under active development. Core property management, organization workflows, subscriptions, authentication, investor onboarding, storage, and chat features are already represented in the application structure.

Some areas are still evolving, including endpoint naming consistency, storage migration planning, reporting, and future AI-assisted pricing.

---

## Roadmap

* AI-powered pricing engine for rent, lease, and sale estimates.
* Migration from Supabase Storage to Amazon S3 for scalable media storage.
* Advanced reporting with CSV and Excel export.
* Improved investor acceptance directly from email.
* Account linking for users who manage multiple identities or organizations.
* Expanded notification and engagement workflows.
* API endpoint naming cleanup and consistency pass.

---

## Project Structure

A suggested structure for this section:

```bash
hex-management/
├── app/                 # Next.js app routes and layouts
├── components/          # Reusable UI components
├── lib/                 # Shared utilities and service clients
├── server/              # tRPC routers, server actions, and backend logic
├── prisma/              # Prisma schema and migrations
├── public/              # Static assets
├── styles/              # Global styles and Tailwind setup
└── README.md
```

Update this section to match the actual repository structure before publishing.

---

## Scripts

Common development commands:

```bash
bun dev              # Start the local development server
bun build            # Build the production application
bun start            # Start the production server
bun lint             # Run linting
bunx prisma studio   # Open Prisma Studio
bunx prisma generate # Generate Prisma client
bunx prisma migrate dev # Run local database migrations
```

Update these scripts if your `package.json` uses different command names.

---

## Dependencies

See `package.json` for the complete dependency list. Key dependencies include:

```jsonc
{
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
}
```

---

## Contributing

Contributions are welcome once the project is ready for public collaboration.

To contribute:

1. Fork the repository.
2. Create a feature branch:

```bash
git checkout -b feature/your-feature
```

3. Commit your changes:

```bash
git commit -m "Add your feature"
```

4. Push to your branch:

```bash
git push origin feature/your-feature
```

5. Open a pull request.

---

## License

License information has not been finalized yet.

Before publishing the repository publicly, add a `LICENSE` file and update this section accordingly.

Suggested options:

* MIT License for a permissive open-source project.
* Private/proprietary license if the platform is intended to remain closed-source.

---

## Author

Built by AD as part of a full-stack real estate management platform project.
