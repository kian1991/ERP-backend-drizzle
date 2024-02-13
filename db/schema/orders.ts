import {
  varchar,
  serial,
  pgTable,
  integer,
  timestamp,
  doublePrecision
} from 'drizzle-orm/pg-core'
import { customers } from './customers'
import { createInsertSchema, createSelectSchema } from 'drizzle-zod'
import { ERRORS } from '../../src/strings'

const orderSchema = {
  id: serial('id').primaryKey(),
  customerId: integer('customer_id')
    .references(() => customers.id)
    .notNull(),
  status: varchar('status').notNull(),
  totalAmount: doublePrecision('total_amount').notNull(),
  createdAt: timestamp('created_at', { mode: 'date', withTimezone: false })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp('updated_at', { mode: 'date', withTimezone: false })
    .notNull()
    .defaultNow()
}

export const orders = pgTable('orders', orderSchema)
export type Order = typeof orders.$inferSelect
export type NewOrder = typeof orders.$inferInsert
export const insertOrderSchema = createInsertSchema(orders, {
  totalAmount: (schema) => schema.totalAmount.min(0, ERRORS.positiveNumber)
})
export const selectOrderSchema = createSelectSchema(orders)
