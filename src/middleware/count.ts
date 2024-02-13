import { sql } from 'drizzle-orm'
import { db } from '../../db/client'

export interface LimitOptions {
  limit: number
  offset: number
}

/**
 * THis function returns the count of the table by the table name. Returns 0 if the table does not exist.
 * @param tableName {string} - The name of the table
 * @returns {Promise<number>} - The count of the table
 */
export const getCountOfTable = async (tableName: string): Promise<number> => {
  const preparedQuery = sql`SELECT reltuples::bigint AS estimate FROM pg_class WHERE relname=${tableName}`
  const result = await db.execute(preparedQuery)
  if (result.length === 0) return 0
  return result[0].estimate as number
}
