import { pgTable, serial, timestamp, varchar } from 'drizzle-orm/pg-core'
import { createInsertSchema, createSelectSchema } from 'drizzle-zod'
import { ERRORS } from '../../src/strings'

const addressColumns = {
  id: serial('id').primaryKey(),
  street: varchar('street').notNull(),
  city: varchar('city').notNull(),
  zip: varchar('zip').notNull(),
  createdAt: timestamp('created_at', { mode: 'date', withTimezone: false })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp('updated_at', { mode: 'date', withTimezone: false })
    .notNull()
    .defaultNow()
}

// Drizzle Schema
export const addresses = pgTable('addresses', addressColumns)

// TypeScript Types
export type Address = typeof addresses.$inferSelect
export type NewAddress = typeof addresses.$inferInsert

// Zod Schemata
export const insertAddressSchema = createInsertSchema(addresses, {
  zip: (schema) => schema.zip.regex(/\d{5}/, ERRORS.zip)
})
export const selectAddressSchema = createSelectSchema(addresses)
