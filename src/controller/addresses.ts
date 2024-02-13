import { eq } from 'drizzle-orm'
import { db } from '../../db/client'
import { addresses, type Address, type NewAddress } from '../../db/schema'

export async function getAddresses(): Promise<Address[]> {
  const addressesResult: Awaited<Address[]> =
    await db.query.addresses.findMany()
  return addressesResult
}

export async function getAddress(id: number): Promise<Address> {
  const [address]: Awaited<Address[]> = await db.query.addresses.findMany({
    where: eq(addresses.id, id)
  })
  return address
}

export async function insertAddress(address: NewAddress): Promise<Address> {
  const [inserted]: Awaited<Address[]> = await db
    .insert(addresses)
    .values(address)
    .returning()
  return inserted
}

export async function updateAddress(
  id: number,
  address: Partial<Address>
): Promise<Address> {
  const [updated]: Awaited<Address[]> = await db
    .update(addresses)
    .set({ ...address, updatedAt: new Date() })
    .where(eq(addresses.id, id))
    .returning()
  return updated
}

export async function deleteAddress(id: number): Promise<Address> {
  const [deleted]: Awaited<Address[]> = await db
    .delete(addresses)
    .where(eq(addresses.id, id))
    .returning()
  return deleted
}
