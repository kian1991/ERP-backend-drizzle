import { eq } from 'drizzle-orm'
import { db } from '../../db/client'
import { customers, type Customer, type NewCustomer } from '../../db/schema'

export async function getCustomers(): Promise<Customer[]> {
  const customersResult: Awaited<Customer[]> =
    await db.query.customers.findMany()
  return customersResult
}

export async function getCustomer(id: number): Promise<Customer> {
  const [customer]: Awaited<Customer[]> = await db.query.customers.findMany({
    where: eq(customers.id, id)
  })
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
