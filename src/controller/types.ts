import type postgres from 'postgres'
import { type Order } from '../../db/schema'

export type FullSalesOrderReturnType = Order & {
  positions: postgres.RowList<Array<Record<string, unknown>>>
}

export interface PagedFullSalesOrderReturnType {
  data: FullSalesOrderReturnType[]
  totalCount: number
}

export interface PagedOrderReturnType {
  data: Order[]
  totalCount: number
}
