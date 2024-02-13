import { integer, serial, pgTable, doublePrecision } from 'drizzle-orm/pg-core'
import { orders } from './orders'
import { products } from './products'
import { createInsertSchema, createSelectSchema } from 'drizzle-zod'
import { ERRORS } from '../../src/strings'

const orderPositionSchema = {
  id: serial('id').primaryKey(),
  orderId: integer('order_id')
    .references(() => orders.id)
    .notNull(),
  productId: integer('product_id')
    .references(() => products.id)
    .notNull(),
  quantity: integer('quantity').notNull(),
  totalAmount: doublePrecision('total_amount').notNull()
}

export const orderPositions = pgTable('order_positions', orderPositionSchema)
export type OrderPosition = typeof orderPositions.$inferSelect
export type NewOrderPosition = typeof orderPositions.$inferInsert

export const orderInsertSchema = createInsertSchema(orderPositions, {
  quantity: (schema) => schema.quantity.min(1, ERRORS.quantity)
})

export const orderSelectSchema = createSelectSchema(orderPositions)
