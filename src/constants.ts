import 'dotenv/config'

// POSTGRES_URL
const postgresUrl = process.env.POSTGRES_URL ?? null
if (postgresUrl === null) {
  // Do null check
  throw new Error('POSTGRES_URL is not defined in .env file')
}
export const POSTGRES_URL = postgresUrl
