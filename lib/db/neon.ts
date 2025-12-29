import { neon, neonConfig } from '@neondatabase/serverless';

// Configure Neon for optimal performance
neonConfig.fetchConnectionCache = true;

/**
 * Create a Neon database client
 * This replaces the Supabase Postgres database connection
 * Note: Supabase Auth is still used for authentication
 */
export function createNeonClient() {
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL environment variable is not set');
  }

  const sql = neon(process.env.DATABASE_URL);
  return sql;
}

/**
 * Execute a SQL query using Neon
 * @param query SQL query string
 * @param params Query parameters
 * @returns Query results
 */
export async function executeQuery<T = unknown>(
  query: string,
  params: unknown[] = []
): Promise<T[]> {
  const sql = createNeonClient();
  return await sql(query, params) as T[];
}
