// Products
import { db } from '../../db/client'
import { products, type NewProduct, type Product } from '../../db/schema'
import { eq } from 'drizzle-orm'
import { getCountOfTable, type LimitOptions } from '../middleware'

export async function getProducts({
  limit,
  offset
}: LimitOptions): Promise<{ data: Product[]; totalCount: number }> {
  const productsResult: Awaited<Product[]> = await db.query.products.findMany({
    limit,
    offset
  })

  const totalCount: number = await getCountOfTable('products')
  return { data: productsResult, totalCount }
}

export async function getProduct(id: number): Promise<Product> {
  const [product]: Awaited<Product[]> = await db.query.products.findMany({
    where: eq(products.id, id)
  })
  return product
}

export async function insertProduct(product: NewProduct): Promise<Product> {
  const [inserted]: Awaited<Product[]> = await db
    .insert(products)
    .values(product)
    .returning()
  return inserted
}

export async function updateProduct(
  id: number,
  product: Partial<Product>
): Promise<Product> {
  const [updated]: Awaited<Product[]> = await db
    .update(products)
    .set({ ...product, updatedAt: new Date() })
    .where(eq(products.id, id))
    .returning()
  return updated
}

export async function deleteProduct(id: number): Promise<Product> {
  const [deleted]: Awaited<Product[]> = await db
    .delete(products)
    .where(eq(products.id, id))
    .returning()
  return deleted
}
