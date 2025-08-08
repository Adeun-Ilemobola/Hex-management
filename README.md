

# 🏠 Hex Management

**Hex Management** is a modern real estate management platform built with **Next.js**, **Prisma**, and **BetterAuth**.  
It allows users to list properties, manage investments, invite external investors, and calculate optimal rental, lease, or sale prices.  

In the future, the platform will include an **AI-powered pricing engine** to automatically generate the best rates based on property data and market trends.

---

## ✨ Key Features

- **Property Management**  
  Create, edit, view, and manage property listings with images and detailed features.
  
- **Investment Blocks**  
  Track sales, leases, and rentals, including investor participation and contribution percentages.
  
- **External Investor Onboarding**  
  Invite investors via email (Resend), with verification links for secure confirmation.
  
- **Organization Management**  
  Create organizations, manage members, and assign roles (`member`, `admin`, `owner`).
  
- **Subscription Plans**  
  Stripe integration for paid tiers (Deluxe, Premium) and fallback to Free tier.
  
- **Email Notifications**  
  Transactional emails for onboarding, verification, and updates.
  
- **Cloud Storage**  
  Currently uses **Supabase Storage** for images (planned migration to **Amazon S3**).

---

## 🛠️ Tech Stack

**Core**
- [Next.js](https://nextjs.org/) 15.3+
- [React](https://react.dev/) 18
- [TypeScript](https://www.typescriptlang.org/)
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
git clone https://github.com/<your-username>/hex-management.git
cd hex-management

# Install dependencies
npm install

# Setup environment variables
cp .env.example .env.local
# Fill in your keys and secrets

# Prisma migrations
npx prisma migrate dev

# Run development server
npm run dev
````

---

## 🔑 Environment Variables

Create `.env.local` in your project root:

```env
# Better Auth
BETTER_AUTH_SECRET="your_better_auth_secret"
BETTER_AUTH_URL="http://localhost:3000"
NEXT_PUBLIC_TRPC_URL="http://localhost:3000/api/trpc"

# Supabase
DATABASE_URL="your_postgres_connection_url_with_pooler"
DIRECT_URL="your_direct_postgres_connection_url"
NEXT_PUBLIC_SUPABASE_URL="https://your-project.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your_supabase_anon_key"

# OAuth Providers
GOOGLE_CLIENT_ID="your_google_client_id"
GOOGLE_CLIENT_SECRET="your_google_client_secret"
REDDIT_CLIENT_ID="your_reddit_client_id"
REDDIT_CLIENT_SECRET="your_reddit_client_secret"
DISCORD_CLIENT_ID="your_discord_client_id"
DISCORD_CLIENT_SECRET="your_discord_client_secret"
GITHUB_CLIENT_ID="your_github_client_id"
GITHUB_CLIENT_SECRET="your_github_client_secret"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"

# Email (Resend)
RESEND_API_KEY="your_resend_api_key"

# Stripe
STRIPE_SECRET_KEY="your_stripe_secret_key"
STRIPE_PUBLISHABLE_KEY="your_stripe_publishable_key"

# OpenAI (optional future AI features)
OPENAI_API_KEY="your_openai_api_key"
```

> ⚠️ Never commit `.env.local` to GitHub — only commit `.env.example` with placeholder values.

---

## 📚 API Endpoints (tRPC)

All routes use `protectedProcedure` and require authentication via **BetterAuth**.

### **PropertiesRouter**

Manages property lifecycle, investment blocks, and investor onboarding.

| Endpoint                 | Method   | Purpose                                                               |
| ------------------------ | -------- | --------------------------------------------------------------------- |
| `getUserProperties`      | query    | List authenticated user’s properties (with filters).                  |
| `getPropertie`           | query    | Get a single property with images, investment block, and investors.   |
| `postPropertie`          | mutation | Create a property + investment block + investors; send invite emails. |
| `updataPropertie`        | mutation | Update property/investment block; send invites to new investors.      |
| `deleteImage`            | mutation | Remove image from DB and Supabase Storage.                            |
| `updataExternalInvestor` | mutation | Update details for one investor.                                      |
| `getUserProfle`          | query    | Get authenticated user profile.                                       |
| `updateUserProfle`       | mutation | Update profile details.                                               |
| `viewProperty`           | query    | Public-friendly property view with images, price, and features.       |

---

### **userConfigRouter**

Handles account-level settings and subscriptions.

| Endpoint              | Method   | Purpose                                                                          |
| --------------------- | -------- | -------------------------------------------------------------------------------- |
| `setPasswordForOAuth` | mutation | Add/change password for OAuth or credentials-based users.                        |
| `getUserPlan`         | query    | Get current plan, days left; handle expired subs (archive, rollover, downgrade). |

---

### **organizationRouter**

Handles organizations and member management.

| Endpoint             | Method   | Purpose                                                             |
| -------------------- | -------- | ------------------------------------------------------------------- |
| `onboardUserToOrg`   | mutation | Create user if needed, add to org with role, send onboarding email. |
| `getAllOrganization` | query    | List all orgs the user belongs to, with member counts.              |
| `getOrganization`    | query    | Get full org details (metadata, members, invitations).              |
| `createOrganization` | mutation | Create new org with plan-based seat limits and unique slug.         |

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

This project is licensed under the **MIT License** — see the [LICENSE](./LICENSE) file for details.

```

---

If you want, I can extend this README with **example request/response payloads** for each tRPC endpoint so that other developers can test your API without having to read through the code.  
That would make the repo *extremely* contributor-friendly. Would you like me to add that?
```
