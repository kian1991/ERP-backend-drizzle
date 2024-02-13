import { sql } from 'drizzle-orm'
import { db, queryClient } from '../client'

async function clearDb(): Promise<void> {
  const query = sql<string>`SELECT table_name
    FROM information_schema.tables
    WHERE table_schema = 'public'
      AND table_type = 'BASE TABLE';
  `

  const tables = await db.execute(query) // retrieve tables

  for (const table of tables) {
    const query = sql.raw(`TRUNCATE TABLE ${table.table_name} CASCADE;`)
    await db.execute(query) // Truncate (clear all the data) the table
  }
}

clearDb()
  .then(() => {
    console.log('All tables dropped')
  })
  .catch((err) => {
    console.error(err)
  })
  .finally(() => {
    void queryClient.end()
  })
