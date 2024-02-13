import { db } from '../../db/client'
import { warehouses, type NewWarehouse, type Warehouse } from '../../db/schema'
import { eq } from 'drizzle-orm'

export async function getWarehouses(): Promise<Warehouse[]> {
  const warehousesResult: Awaited<Warehouse[]> =
    await db.query.warehouses.findMany()
  return warehousesResult
}

export async function getWarehouse(id: number): Promise<Warehouse> {
  const [warehouse]: Awaited<Warehouse[]> = await db.query.warehouses.findMany({
    where: eq(warehouses.id, id)
  })
  return warehouse
}

export async function insertWarehouse(
  warehouse: NewWarehouse
): Promise<Warehouse> {
  const [inserted]: Awaited<Warehouse[]> = await db
    .insert(warehouses)
    .values(warehouse)
    .returning()
  return inserted
}

export async function updateWarehouse(
  id: number,
  warehouse: Partial<Warehouse>
): Promise<Warehouse> {
  const [updated]: Awaited<Warehouse[]> = await db
    .update(warehouses)
    .set(warehouse)
    .where(eq(warehouses.id, id))
    .returning()
  return updated
}

export async function deleteWarehouse(id: number): Promise<Warehouse> {
  const [deleted]: Awaited<Warehouse[]> = await db
    .delete(warehouses)
    .where(eq(warehouses.id, id))
    .returning()
  return deleted
}
