import {
  doublePrecision,
  integer,
  pgTable,
  serial,
  timestamp,
  uniqueIndex,
  varchar
} from 'drizzle-orm/pg-core'
import { addresses } from './addresses'
import { createInsertSchema, createSelectSchema } from 'drizzle-zod'
import { ERRORS } from '../../src/strings'

const customerSchema = {
  id: serial('id').primaryKey(),
  name: varchar('name').notNull(),
  lastName: varchar('last_name').notNull(),
  phone: varchar('phone'),
  email: varchar('email').unique().notNull(),
  lifetimeValue: doublePrecision('lifetime_value').default(0.0),
  addressId: integer('address_id')
    .references(() => addresses.id)
    .notNull(),
  createdAt: timestamp('created_at', { mode: 'date', withTimezone: false })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp('updated_at', { mode: 'date', withTimezone: false })
    .notNull()
    .defaultNow()
}

export const customers = pgTable('customers', customerSchema, (customers) => {
  return {
    customerEmailIndex: uniqueIndex('customer_email_idx').on(customers.email)
  }
})

export type Customer = typeof customers.$inferSelect
export type NewCustomer = typeof customers.$inferInsert

export const insertCustomerSchema = createInsertSchema(customers, {
  email: (schema) => schema.email.email(ERRORS.email),
  // german phone number
  phone: (schema) => schema.phone.regex(/^\+49\d{10}$/, ERRORS.phone)
})

export const selectCustomerSchema = createSelectSchema(customers)
