import {
  doublePrecision,
  integer,
  json,
  pgTable,
  serial,
  timestamp,
  varchar
} from 'drizzle-orm/pg-core'
import { warehouses } from './warehouses'
import { ERRORS } from '../../src/strings'
import { createInsertSchema } from 'drizzle-zod'

const productSchema = {
  id: serial('id').primaryKey(),
  name: varchar('name').notNull(),
  description: varchar('description').notNull(),
  price: doublePrecision('price').notNull(),
  stockQuantity: integer('stock_quantity').notNull(),
  brand: varchar('brand').notNull(),
  category: varchar('category').notNull(),
  thumbnail: varchar('thumbnail').notNull(),
  images: json('images').notNull(),
  warehouseId: integer('warehouse_id').references(() => warehouses.id),
  createdAt: timestamp('created_at', { mode: 'date', withTimezone: false })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp('updated_at', { mode: 'date', withTimezone: false })
    .notNull()
    .defaultNow()
}

export const products = pgTable('products', productSchema)
export type Product = typeof products.$inferSelect
export type NewProduct = typeof products.$inferInsert

export const insertProductSchema = createInsertSchema(products, {
  price: (schema) => schema.price.min(0, ERRORS.positiveNumber),
  stockQuantity: (schema) => schema.stockQuantity.min(0, ERRORS.positiveNumber)
})

export const selectProductSchema = createInsertSchema(products)
