/* eslint-disable @typescript-eslint/no-misused-promises */

import { Router } from 'express'
import { insertSalesOrderSchema } from '../../db/schema'
import {
  getSalesOrder,
  getSalesOrders,
  getSalesOrdersFull,
  insertSalesOrder
} from '../controller'
import { handleZodError } from '../util/zod-errorhandler'
import { numeric } from '../util/type-conversions'

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

orderRouter.get('/full', async (req, res) => {
  try {
    const orders = await getSalesOrdersFull()
    res.status(200).json({ data: orders })
  } catch (error: unknown) {
    handleZodError(error, res)
  }
})

orderRouter.get('/', async (req, res) => {
  try {
    const orders = await getSalesOrders()
    res.status(200).json({ data: orders })
  } catch (error: unknown) {
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
