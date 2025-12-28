# Migration from Supabase Postgres to Neon Database

This document describes the migration from Supabase PostgreSQL to Neon PostgreSQL database.

## Overview

**What Changed:**
- Database provider: Supabase PostgreSQL → Neon PostgreSQL
- Database queries now use `@neondatabase/serverless` instead of Supabase client
- Supabase is now **ONLY** used for authentication (Auth), not database

**What Stayed the Same:**
- Supabase Auth is still used for user authentication
- All authentication flows remain unchanged
- Database schema remains the same (PostgreSQL)
- All application functionality remains the same

## Code Changes

### New Files
- `lib/db/neon.ts` - Neon database client
- `.env.example` - Example environment variables

### Modified Files
- `app/api/radar/technologies/route.ts` - Updated to use Neon
- `app/api/radar/technologies/[id]/route.ts` - Updated to use Neon
- `app/api/radar/sync/route.ts` - Updated to use Neon
- `app/radar/page.tsx` - Updated to use Neon
- `package.json` - Added `@neondatabase/serverless` dependency
- `CLAUDE.md` - Updated documentation
- `README.md` - Updated documentation

### Files Unchanged (Auth Only)
These files still use Supabase for authentication:
- `lib/supabase/client.ts`
- `lib/supabase/server.ts`
- `middleware.ts`
- `app/api/auth/callback/route.ts`
- `app/auth/actions.ts`
- `app/components/AuthForm.tsx`
- `app/components/Navigation.tsx`

## Environment Variables

### Removed
- `SUPABASE_SERVICE_ROLE_KEY` (no longer needed for database operations)

### Added
- `DATABASE_URL` - Neon PostgreSQL connection string

### Updated `.env.local`
```bash
# Neon Database (PostgreSQL)
DATABASE_URL=postgresql://user:password@ep-xxx-xxx.us-east-2.aws.neon.tech/dbname?sslmode=require

# Supabase Authentication (Auth only - NOT database)
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

## Migration Steps

### 1. Set Up Neon Database

1. Create a Neon project at [neon.tech](https://neon.tech)
2. Create a new database
3. Copy the connection string from Neon dashboard
4. Add to `.env.local` as `DATABASE_URL`

### 2. Migrate Database Schema

Export your existing database schema from Supabase and import to Neon:

```bash
# Export from Supabase (using pg_dump or Supabase dashboard)
# Import to Neon using their SQL editor or pg_restore
```

Alternatively, use the provided schema files:
- `radar_schema.sql` - Basic schema
- `radar_schema_complete.sql` - Complete schema with all tables

### 3. Migrate Data

If you have existing data in Supabase:

```bash
# Export data from Supabase
pg_dump -h your-supabase-host -U postgres -d postgres --data-only > data.sql

# Import to Neon
psql "postgresql://user:password@ep-xxx-xxx.us-east-2.aws.neon.tech/dbname?sslmode=require" < data.sql
```

### 4. Install Dependencies

```bash
bun install
```

This will install the `@neondatabase/serverless` package.

### 5. Update Environment Variables

Update your deployment environment variables:
- **Vercel/Netlify**: Add `DATABASE_URL` in dashboard
- **Local**: Update `.env.local`
- Remove `SUPABASE_SERVICE_ROLE_KEY` if no longer needed

### 6. Test Locally

```bash
bun run dev
```

Test the following:
- Technology Radar page (`/radar`)
- Creating/editing/deleting technologies
- RSS sync endpoint (if applicable)

### 7. Deploy

Deploy to your hosting platform (e.g., Vercel) with the new `DATABASE_URL` environment variable.

## Key Differences

### Before (Supabase)
```typescript
const supabase = createClient();
const { data, error } = await supabase
  .from('technologies')
  .select('*')
  .order('name');
```

### After (Neon)
```typescript
const sql = createNeonClient();
const data = await sql`
  SELECT * FROM technologies
  ORDER BY name ASC
`;
```

## Benefits of Neon

1. **Serverless PostgreSQL** - Auto-scaling with true pay-per-use pricing
2. **Better Performance** - HTTP-based queries optimized for serverless
3. **Branching** - Create database branches for development/testing
4. **Instant Scaling** - Scales to zero when not in use
5. **Connection Pooling** - Built-in connection pooling for serverless

## Rollback Plan

If you need to rollback to Supabase:

1. Keep your Supabase project active during migration
2. Revert code changes using git
3. Restore `SUPABASE_SERVICE_ROLE_KEY` environment variable
4. Redeploy with previous version

## Support

- Neon Documentation: https://neon.tech/docs
- Neon Discord: https://discord.gg/neon
- Issue Tracker: https://github.com/neondatabase/neon/issues

## Notes

- Supabase Auth continues to work exactly as before
- No changes to authentication flows
- No changes to user-facing functionality
- Database schema remains PostgreSQL-compatible
- All existing SQL queries work the same way
