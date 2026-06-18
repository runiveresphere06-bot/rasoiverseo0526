# RasoiVerse

India's community-driven recipe platform — discover, listen, cook, and share authentic regional recipes.

## Tech Stack

- **Next.js 16** (App Router, TypeScript)
- **Tailwind CSS 4** — premium minimal design
- **PostgreSQL** (Neon) + **Prisma ORM**
- **Auth.js** — Google OAuth, email/password, RBAC
- **Cloudinary** — images & audio (Phase 2)
- **Resend** — transactional email
- **Vercel** — deployment

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment

Copy `.env.example` to `.env.local` and fill in your values:

```bash
cp .env.example .env.local
```

Required for local development:
- `DATABASE_URL` — Neon PostgreSQL connection string
- `AUTH_SECRET` — run `openssl rand -base64 32`
- `NEXTAUTH_URL` — `http://localhost:3000`
- `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET`

### 3. Set up the database

```bash
npm run db:push
npm run db:seed
```

### 4. Run the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Project Structure

```
src/
├── app/
│   ├── (auth)/          # Login, register, password reset
│   ├── (site)/          # Public pages with header/footer
│   ├── admin/           # Protected admin dashboard
│   └── api/auth/        # Auth API routes
├── components/
│   ├── admin/           # Admin UI components
│   ├── auth/            # Auth forms
│   ├── home/            # Homepage sections
│   ├── layout/          # Header, footer, logo
│   └── recipes/         # Recipe cards
├── lib/
│   ├── auth.ts          # (re-exported from src/auth.ts)
│   ├── constants.ts     # Brand, admin emails, states
│   ├── email.ts         # Resend email helpers
│   ├── prisma.ts        # Database client
│   ├── rbac.ts          # Role-based access helpers
│   └── recipes.ts       # Recipe data queries
└── auth.ts              # Auth.js configuration
prisma/
├── schema.prisma        # Database schema
└── seed.ts              # Seed states, categories, recipes
```

## Admin Access

These emails are automatically granted `ADMIN` role on sign-in:

- theredhacker06@gmail.com
- runiveresphere06@gmail.com
- rupalisuryawanshi05@gmail.com
- p.manoj0860@gmail.com

## Development Phases

- **Phase 1** ✅ Architecture, auth, homepage, admin foundation
- **Phase 2** ✅ Recipe library, search/filters, detail pages, audio player, natural-language submissions, admin review/publish workflow
- **Phase 3** ✅ Comments, ratings, favorites, community feed, admin moderation, profile, SEO basics
- **Phase 4**: Full SEO polish, optimization, production deployment

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Production build |
| `npm run db:push` | Push schema to database |
| `npm run db:seed` | Seed placeholder data |
| `npm run db:studio` | Open Prisma Studio |
