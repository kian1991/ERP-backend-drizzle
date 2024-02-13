import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import { POSTGRES_URL } from '../../src/constants'
import * as schemas from '../schema'

// for query purposes
const queryClient = postgres(POSTGRES_URL)
const db = drizzle(queryClient, { schema: schemas })

export { queryClient, db }
