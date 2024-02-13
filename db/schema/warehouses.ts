import {
  integer,
  serial,
  varchar,
  pgTable,
  doublePrecision
} from 'drizzle-orm/pg-core'
import { createInsertSchema, createSelectSchema } from 'drizzle-zod'
import { ERRORS } from '../../src/strings'

const warehouseSchema = {
  id: serial('id').primaryKey(),
  dunsNumber: varchar('duns_number').notNull().unique(),
  location: varchar('location').notNull().unique(),
  capacity: integer('capacity').notNull(),
  occupancy: doublePrecision('occupancy').default(0.0)
}

export const warehouses = pgTable('warehouses', warehouseSchema)
export type Warehouse = typeof warehouses.$inferSelect
export type NewWarehouse = typeof warehouses.$inferInsert

export const insertWarehouseSchema = createInsertSchema(warehouses, {
  capacity: (schema) => schema.capacity.min(0, ERRORS.positiveNumber)
})

export const selectWarehouseSchema = createSelectSchema(warehouses)
