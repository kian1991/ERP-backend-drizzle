import { migrate } from 'drizzle-orm/postgres-js/migrator'
import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import { POSTGRES_URL } from '../src/constants'

const migrationClient = postgres(POSTGRES_URL, {
  max: 1
})

async function runMigrations(): Promise<void> {
  try {
    await migrate(drizzle(migrationClient), {
      migrationsFolder: './db/migrations'
    })
    console.log('Migrations complete 🦭')
    await migrationClient.end()
    process.exit(0)
  } catch (e) {
    console.error(e)
    process.exit(1)
  }
}

void runMigrations()
