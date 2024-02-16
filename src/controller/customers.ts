import { eq, sql } from 'drizzle-orm'
import { db } from '../../db/client'
import {
  customers,
  type Customer,
  type NewCustomer,
  type Address
} from '../../db/schema'
import { getCountOfTable, type LimitOptions } from '../middleware'

export async function getCustomers({ limit, offset }: LimitOptions): Promise<{
  data: Array<Customer & Address>
  totalCount: number
}> {
  const preparedStatement = sql`SELECT * FROM customers, addresses WHERE customers.address_id = addresses.id`
  const customers: Awaited<Array<Customer & Address>> =
    await db.execute(preparedStatement)

  const totalCount: number = await getCountOfTable('customers')

  return { data: customers, totalCount }
}

export async function getCustomer(id: number): Promise<Customer> {
  const preparedStatement = sql`SELECT * FROM customers, addresses WHERE customers.id = ${id} AND customers.address_id = addresses.id`
  const [customer]: Awaited<Customer[]> = await db.execute(preparedStatement)

  return customer
}
export async function getCustomerByEmail(email: string): Promise<Customer> {
  const preparedStatement = sql`SELECT * FROM customers, addresses WHERE customers.email = ${email} AND customers.address_id = addresses.id`
  const [customer]: Awaited<Customer[]> = await db.execute(preparedStatement)

  return customer
}

export async function insertCustomer(customer: NewCustomer): Promise<Customer> {
  const [inserted]: Awaited<Customer[]> = await db
    .insert(customers)
    .values(customer)
    .returning()
  return inserted
}

export async function updateCustomer(
  id: number,
  customer: Partial<Customer>
): Promise<Customer> {
  const [updated]: Awaited<Customer[]> = await db
    .update(customers)
    .set({ ...customer, updatedAt: new Date() })
    .where(eq(customers.id, id))
    .returning()
  return updated
}

export async function deleteCustomer(id: number): Promise<Customer> {
  const [deleted]: Awaited<Customer[]> = await db
    .delete(customers)
    .where(eq(customers.id, id))
    .returning()
  return deleted
}
