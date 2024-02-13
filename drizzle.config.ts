import 'dotenv/config';
import type { Config } from 'drizzle-kit';
import { POSTGRES_URL } from './src/constants';

export default {
	schema: ['./db/schema/*'],
	dbCredentials: {
		connectionString: POSTGRES_URL,
	},
	driver: 'pg',
	out: './db/migrations',
} satisfies Config;
