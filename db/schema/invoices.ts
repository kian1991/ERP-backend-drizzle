import {
  varchar,
  serial,
  pgTable,
  integer,
  timestamp
} from 'drizzle-orm/pg-core'
import { orders } from './orders'
import { createInsertSchema, createSelectSchema } from 'drizzle-zod'

const invoiceSchema = {
  id: serial('id').primaryKey(),
  orderId: integer('order_id')
    .references(() => orders.id)
    .notNull(),
  dueDate: timestamp('due_date', {
    mode: 'date',
    withTimezone: false
  }).notNull(),
  status: varchar('status').notNull()
}

export const invoices = pgTable('invoices', invoiceSchema)
export type Invoice = typeof invoices.$inferSelect
export type NewInvoice = typeof invoices.$inferInsert

export const selectInvoiceSchema = createSelectSchema(invoices)
export const insertInvoiceSchema = createInsertSchema(invoices)
