# CryptoMole 🕵️

A coin-specific crypto news website that delivers updates directly from official project sources. No rumors, no speculation—just verified announcements from official team channels.

## Features

- **Coin-Specific News**: Each covered coin has its own dedicated feed with official announcements
- **Source Verification**: Every post links to its original source (X/Twitter, blog, community calls, etc.)
- **AI Crypto Focus**: Initially covering top AI crypto projects (RENDER, AKT, TAO, NEAR, FET, etc.)
- **Dark-Friendly Design**: Modern, responsive UI with a mole/crypto-insider brand aesthetic
- **Fast & Cached**: ISR (Incremental Static Regeneration) for fast page loads with automatic refresh

## Tech Stack

- **Framework**: Next.js 16 (App Router, TypeScript)
- **Database**: Neon Postgres with Drizzle ORM
- **Styling**: Tailwind CSS v4
- **Hosting**: Vercel (optimized deployment)

## Getting Started

### Prerequisites

- Node.js 20+
- A Neon Postgres database (or any PostgreSQL database)

### Local Development

1. **Clone the repository**

   ```bash
   git clone https://github.com/your-org/cryptomole.git
   cd cryptomole
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   Copy the example env file and fill in your values:

   ```bash
   cp .env.example .env
   ```

   Required environment variables:
   - `DATABASE_URL` - Your Postgres connection string (with connection pooling)
   - `DATABASE_URL_UNPOOLED` - Direct Postgres connection (for migrations)
   - `INGEST_API_KEY` - API key for post ingestion (generate a secure random string)

4. **Set up the database**

   Push the schema to your database:

   ```bash
   npm run db:push
   ```

   Or generate and run migrations:

   ```bash
   npm run db:generate
   npm run db:migrate
   ```

5. **Seed initial data**

   ```bash
   npm run db:seed
   ```

   This populates the initial coins and sample posts (sample posts only in development).

6. **Start the development server**

   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) to view the site.

## Database Schema

### Coins Table

| Column       | Type      | Description                       |
|--------------|-----------|-----------------------------------|
| id           | UUID      | Primary key                       |
| slug         | text      | URL-friendly identifier (unique)  |
| name         | text      | Full project name                 |
| ticker       | text      | Token ticker symbol               |
| description  | text      | Project description               |
| website      | text      | Official website URL              |
| x_handle     | text      | Official X/Twitter handle         |
| discord_url  | text      | Official Discord invite URL       |
| telegram_url | text      | Official Telegram URL             |
| logo_url     | text      | Path to logo image                |
| created_at   | timestamp | Creation timestamp                |
| updated_at   | timestamp | Last update timestamp             |

### Posts Table

| Column       | Type                          | Description                        |
|--------------|-------------------------------|------------------------------------|
| id           | UUID                          | Primary key                        |
| coin_id      | UUID                          | Foreign key to coins               |
| title        | text                          | Post headline                      |
| summary      | text                          | Brief summary/excerpt              |
| body         | text                          | Full post content                  |
| source_type  | enum                          | x, inbox, blog, call, announcement |
| source_url   | text                          | Link to original source            |
| published_at | timestamp                     | Original publication date          |
| status       | enum (draft/approved/rejected)| Moderation status                  |
| created_at   | timestamp                     | Creation timestamp                 |
| updated_at   | timestamp                     | Last update timestamp              |

## API Endpoints

### POST /api/posts

Submit a new post (defaults to draft status).

**Headers:**
```
Authorization: Bearer YOUR_INGEST_API_KEY
```

**Body:**
```json
{
  "coinSlug": "render",
  "title": "Render Network Announces Partnership",
  "summary": "Brief summary of the announcement",
  "body": "Full post content...",
  "sourceType": "x",
  "sourceUrl": "https://x.com/rendernetwork/status/123",
  "publishedAt": "2024-01-15T12:00:00Z"
}
```

### GET /api/posts

List posts (requires auth). Use `?status=draft` to filter.

### POST /api/admin/approve

Approve or reject a post.

**Body:**
```json
{
  "postId": "uuid-of-post",
  "action": "approve"
}
```

## Deploying to Vercel

### 1. Connect to Vercel

```bash
npm i -g vercel
vercel
```

### 2. Add Neon Integration

1. Go to your Vercel project dashboard
2. Navigate to **Storage** → **Create Database** → **Neon**
3. Follow the prompts to create or connect a Neon database
4. Vercel will automatically inject `DATABASE_URL` and `DATABASE_URL_UNPOOLED`

### 3. Add Environment Variables

In the Vercel dashboard, add:
- `INGEST_API_KEY` - Your secure API key for post ingestion (optional - API endpoints return 503 if not set)

### 4. Deploy

```bash
vercel --prod
```

**Automatic Database Setup**: Each build automatically:
- Creates the database schema (tables, enums) if not exists
- Upserts the 9 seed coins (idempotent - won't duplicate)
- Uses `DATABASE_URL_UNPOOLED` for DDL operations when available
- Never seeds sample posts in production

No manual migration step is required after the Neon integration is connected.

### Graceful Degradation

- **Pages**: If the database is unavailable or tables don't exist, pages show empty states instead of crashing
- **API Endpoints**: Return 503 "Service Unavailable" if `INGEST_API_KEY` is not configured

## Project Structure

```
cryptomole/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── posts/route.ts       # Post ingestion API
│   │   │   └── admin/approve/route.ts
│   │   ├── coin/[slug]/page.tsx     # Per-coin news feed
│   │   ├── post/[id]/page.tsx       # Individual post page
│   │   ├── about/page.tsx           # About page
│   │   ├── sponsor/page.tsx         # Sponsor placeholder
│   │   ├── layout.tsx               # Root layout
│   │   ├── page.tsx                 # Home page
│   │   └── globals.css              # Global styles
│   ├── components/
│   │   ├── PostCard.tsx             # Post card component
│   │   └── CoinCard.tsx             # Coin card/chip components
│   ├── db/
│   │   ├── index.ts                 # Database connection
│   │   └── schema.ts                # Drizzle schema
│   └── lib/
│       └── queries.ts               # Data fetching functions
├── scripts/
│   └── seed.ts                      # Database seed script
├── drizzle.config.ts                # Drizzle configuration
├── .env.example                     # Environment template
└── package.json
```

## Initial Coins

The seed script includes these AI crypto projects:

| Ticker  | Name                               |
|---------|------------------------------------|
| RENDER  | Render Network                     |
| AKT     | Akash Network                      |
| VVV     | Venice AI                          |
| IO      | io.net                             |
| TAO     | Bittensor                          |
| FET     | ASI Alliance (Fetch.ai)            |
| VIRTUAL | Virtuals Protocol                  |
| NEAR    | NEAR Protocol                      |
| ATH     | Aethir                             |

To add more coins, insert them into the `coins` table or extend the seed script.

## Scripts

| Command           | Description                           |
|-------------------|---------------------------------------|
| `npm run dev`     | Start development server              |
| `npm run build`   | Build for production (runs db:setup first) |
| `npm run start`   | Start production server               |
| `npm run lint`    | Run ESLint                            |
| `npm run db:setup`| Create schema + upsert coins (idempotent, runs on build) |
| `npm run db:push` | Push schema to database (Drizzle)     |
| `npm run db:generate` | Generate migration files          |
| `npm run db:migrate`  | Run pending migrations            |
| `npm run db:studio`   | Open Drizzle Studio                |
| `npm run db:seed`     | Seed database with initial data (dev) |

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run `npm run lint` and `npm run build`
5. Submit a pull request

## License

MIT

---

**A Guild of Crews site**
