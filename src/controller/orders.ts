import { eq, sql } from 'drizzle-orm'
import { db } from '../../db/client'
import {
  type NewOrder,
  orders,
  products,
  type NewOrderPosition,
  type NewInvoice,
  orderPositions,
  invoices,
  type NewSalesOrder,
  type Order
} from '../../db/schema'
import { getCountOfTable, type LimitOptions } from '../middleware'
import {
  type PagedFullSalesOrderReturnType,
  type FullSalesOrderReturnType
} from './types'

// insert single Sales Order
export async function insertSalesOrder(
  order: NewSalesOrder
): Promise<FullSalesOrderReturnType> {
  const newOrder: NewOrder = {
    customerId: order.customerId,
    status: 'new'
  }

  const [orderInsertResult] = await db
    .insert(orders)
    .values(newOrder)
    .returning()

  const positionsWithProducts = await Promise.all(
    order.positions.map(async (pos) => ({
      ...pos,
      product: await db.query.products.findFirst({
        where: eq(products.id, pos.productId)
      })
    }))
  )

  const newOrderPositions: NewOrderPosition[] = positionsWithProducts.map(
    (entry) => {
      if (entry.product == null)
        throw new Error(
          'Somethings Wrong with the request! At least one Product was not found'
        )
      return {
        orderId: orderInsertResult.id,
        productId: entry.productId,
        quantity: entry.quantity,
        totalAmount: entry.quantity * entry.product.price
      }
    }
  )

  // insert order positions
  const orderPostionInsertResult = await db
    .insert(orderPositions)
    .values(newOrderPositions)
    .returning()

  // Now Insert the Invoice
  const dueDate = new Date() // Now
  dueDate.setDate(dueDate.getDate() + 30)
  const newInvoice: NewInvoice = {
    dueDate,
    orderId: orderInsertResult.id,
    status: 'unpaid'
  }

  await db.insert(invoices).values(newInvoice)

  // update order with total ammount
  const totalAmount = orderPostionInsertResult.reduce(
    (acc: number, currVal) => (acc += currVal.totalAmount),
    0
  )

  // update order with total ammount
  await db
    .update(orders)
    .set({ totalAmount })
    .where(eq(orders.id, orderInsertResult.id))

  // TODO: Update Lifetime Value of Customer

  return await getSalesOrder(orderInsertResult.id)
}

// Get all Sales Orders including Positions
export async function getSalesOrders({
  limit,
  offset
}: LimitOptions): Promise<PagedFullSalesOrderReturnType> {
  const allOrders = await db.query.orders.findMany({
    limit,
    offset
  })

  const data = await Promise.all(
    allOrders.map(async (order: Order) => {
      const prepStmt = sql`SELECT * FROM order_positions, products WHERE order_id = ${order.id} AND order_positions.product_id = products.id`

      const _orderPositions = await db.execute(prepStmt)

      return {
        ...order,
        positions: _orderPositions
      }
    })
  )

  const orderCount = await getCountOfTable('orders')

  return { data, totalCount: orderCount }
}

// Get Sales Order by ID
export async function getSalesOrder(
  id: number
): Promise<FullSalesOrderReturnType> {
  const order: Order | undefined = await db.query.orders.findFirst({
    where: eq(orders.id, id)
  })

  // If Order not found throw an error
  if (order == null) throw new Error('Order not found')

  const prepStmt = sql`SELECT * FROM order_positions, products WHERE order_id = ${id} AND order_positions.product_id = products.id`

  const _orderPositions = await db.execute(prepStmt)

  return {
    ...order,
    positions: _orderPositions
  }
}
