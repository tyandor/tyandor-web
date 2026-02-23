import { neon } from '@neondatabase/serverless';

/**
 * Create a Neon database client
 */
export function createNeonClient() {
  if (!process.env.RADAR_POSTGRES_URL) {
    throw new Error('RADAR_POSTGRES_URL environment variable is not set');
  }

  const sql = neon(process.env.RADAR_POSTGRES_URL);
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
