# Supabase Local Development

This directory contains the Supabase configuration for local development.

## Prerequisites

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) installed and running
- [Supabase CLI](https://supabase.com/docs/guides/cli) installed

```bash
# Install Supabase CLI (macOS)
brew install supabase/tap/supabase

# Or with npm
npm install -g supabase
```

## Quick Start

### 1. Initialize Supabase (if not already done)

```bash
cd supabase
supabase init
```

### 2. Start Local Supabase

```bash
supabase start
```

This will start:
- PostgreSQL database on port 54322
- Supabase Studio (admin UI) on http://localhost:54323
- API gateway on http://localhost:54321
- Auth server
- Storage server
- Realtime server

### 3. Apply Migrations

```bash
supabase db reset
```

This will reset the database and apply all migrations including seed data.

### 4. Access Supabase Studio

Open http://localhost:54323 in your browser to:
- View and edit data
- Run SQL queries
- Manage auth users
- View storage buckets

## Configuration

After starting, you'll get credentials like:

```
API URL: http://localhost:54321
GraphQL URL: http://localhost:54321/graphql/v1
DB URL: postgresql://postgres:postgres@localhost:54322/postgres
Studio URL: http://localhost:54323
anon key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
service_role key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## Development Workflow

### Creating a New Migration

```bash
supabase migration new my_migration_name
```

### Applying Migrations

```bash
supabase db push
```

### Resetting Database (with seed data)

```bash
supabase db reset
```

### Generating TypeScript Types

```bash
supabase gen types typescript --local > src/types/supabase.ts
```

## Seed Data

The seed data in `seed.sql` is automatically applied when running `supabase db reset`.

To manually apply seed data:

```bash
psql postgresql://postgres:postgres@localhost:54322/postgres -f seed.sql
```

## Stopping Supabase

```bash
supabase stop
```

To stop and remove all data:

```bash
supabase stop --no-backup
```

## Connecting from the App

Create a `.env.local` file in the project root:

```env
VITE_SUPABASE_URL=http://localhost:54321
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

## Troubleshooting

### Docker not running
```bash
# Check Docker status
docker info

# Start Docker Desktop if needed
open -a Docker
```

### Port conflicts
```bash
# Check what's using the ports
lsof -i :54321
lsof -i :54322
lsof -i :54323
```

### Reset everything
```bash
supabase stop --no-backup
supabase start
supabase db reset
```

## File Structure

```
supabase/
├── README.md           # This file
├── SPEC.md            # Database specification
├── config.toml        # Supabase configuration
├── migrations/
│   └── 00001_initial_schema.sql
└── seed.sql           # Seed data
```
