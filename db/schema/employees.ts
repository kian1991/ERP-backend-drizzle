import {
  varchar,
  serial,
  pgTable,
  uniqueIndex,
  integer,
  timestamp,
  doublePrecision
} from 'drizzle-orm/pg-core'
import { addresses } from './addresses'
import { warehouses } from './warehouses'
import { createInsertSchema, createSelectSchema } from 'drizzle-zod'
import { ERRORS } from '../../src/strings'

const employeeSchema = {
  id: serial('id').primaryKey(),
  name: varchar('name').notNull(),
  lastName: varchar('last_name').notNull(),
  phone: varchar('phone'),
  addressId: integer('address_id')
    .notNull()
    .references(() => addresses.id),
  position: varchar('position').notNull(),
  email: varchar('email').unique().notNull(),
  hireDate: timestamp('hire_date', {
    mode: 'date',
    withTimezone: false
  }).notNull(),
  salary: doublePrecision('salary'),
  warehouseId: integer('warehouse_id').references(() => warehouses.id),
  createdAt: timestamp('created_at', { mode: 'date', withTimezone: false })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp('updated_at', { mode: 'date', withTimezone: false })
    .notNull()
    .defaultNow()
}

export const employees = pgTable('employees', employeeSchema, (employee) => {
  return {
    employeeEmailIndex: uniqueIndex('employee_email_idx').on(employee.email)
  }
})

export type Employee = typeof employees.$inferSelect
export type NewEmployee = typeof employees.$inferInsert

export const insertEmployeeSchema = createInsertSchema(employees, {
  email: (schema) => schema.email.email(ERRORS.email),
  phone: (schema) => schema.phone.regex(/^\+49\d{10}$/, ERRORS.phone)
})
export const selectEmployeeSchema = createSelectSchema(employees)
