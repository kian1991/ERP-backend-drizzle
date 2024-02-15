/* eslint-disable @typescript-eslint/no-misused-promises */

import { Router } from 'express'
import { insertSalesOrderSchema } from '../../db/schema'
import { getSalesOrder, getSalesOrders, insertSalesOrder } from '../controller'
import { handleZodError } from '../util/zod-errorhandler'
import { numeric } from '../util/type-conversions'
import { STANDARD_PAGE, STANDARD_PAGE_SIZE } from '../constants'
import { type PaginationResponse } from './types'
import { ERRORS } from '../strings'

export const orderRouter = Router()

orderRouter.post('/', async (req, res) => {
  try {
    const newOrder = insertSalesOrderSchema.parse(req.body)
    const createdOrder = await insertSalesOrder(newOrder)
    res.status(201).json({ data: createdOrder })
  } catch (error: unknown) {
    handleZodError(error, res)
  }
})

orderRouter.get('/', async (req, res) => {
  try {
    // pagination
    const page = numeric.parse(req.query.page ?? STANDARD_PAGE) - 1
    const pageSize = numeric.parse(req.query.page_size ?? STANDARD_PAGE_SIZE)

    if (page < 0) {
      res.status(400).json({ error: { message: ERRORS.invalidPage } })
      return
    }

    const { data, totalCount } = await getSalesOrders({
      limit: pageSize,
      offset: page * pageSize
    })

    const pagination: PaginationResponse = {
      page: page + 1,
      pageSize,
      pageCount: Math.ceil(totalCount / pageSize),
      totalCount
    }

    res.status(200).json({ pagination, data })
  } catch (error: unknown) {
    console.error(error)
    handleZodError(error, res)
  }
})

orderRouter.get('/:id', async (req, res) => {
  try {
    const { id } = req.params
    const order = await getSalesOrder(numeric.parse(id))
    res.status(200).json({ data: order })
  } catch (error: unknown) {
    handleZodError(error, res)
  }
})
