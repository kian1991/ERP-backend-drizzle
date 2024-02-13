/* eslint-disable @typescript-eslint/no-misused-promises */
import { Router } from 'express'
import { type Warehouse, insertWarehouseSchema } from '../../db/schema'
import {
  deleteWarehouse,
  getWarehouse,
  getWarehouses,
  insertWarehouse,
  updateWarehouse
} from '../controller/'
import { ERRORS } from '../strings'
import { numeric } from '../util/type-conversions'
import { handleZodError } from '../util/zod-errorhandler'

export const warehouseRouter = Router()

warehouseRouter.post('/', async (req, res, next) => {
  try {
    const newWarehouse = insertWarehouseSchema.parse(req.body)
    const createdWarehouse: Warehouse = await insertWarehouse(newWarehouse)
    res.status(201).json({ data: createdWarehouse })
  } catch (error: unknown) {
    handleZodError(error, res)
  }
})

warehouseRouter.get('/', async (req, res) => {
  try {
    const warehouses: Warehouse[] = await getWarehouses()
    res.status(200).json({ data: warehouses })
  } catch (error: unknown) {
    console.error(error)
    if (error instanceof Error)
      res.status(400).json({ error: { ...error, name: 'Parsing Error' } })
  }
})

warehouseRouter.get('/:id', async (req, res) => {
  try {
    const { id } = req.params
    const warehouse: Warehouse = await getWarehouse(numeric.parse(id))
    if (warehouse === undefined) {
      res.status(404).json({ error: { message: ERRORS.notFoundbyId(id) } })
      return
    }
    res.status(200).json({ data: warehouse })
  } catch (error: unknown) {
    // console.error(error)
    handleZodError(error, res)
    console.error(error)
  }
})

warehouseRouter.patch('/:id', async (req, res) => {
  try {
    const { id } = req.params
    const warehouse: Partial<Warehouse> = insertWarehouseSchema
      .partial()
      .parse(req.body)

    if (Object.keys(warehouse).length === 0) {
      res.status(400).json({ error: { message: ERRORS.nothingToUpdate } })
      return
    }

    const updatedWarehouse: Warehouse = await updateWarehouse(
      numeric.parse(id),
      warehouse
    )
    res.status(200).json({ data: updatedWarehouse })
  } catch (error: unknown) {
    handleZodError(error, res)
  }
})

warehouseRouter.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params

    const deletedWarehouse: Warehouse = await deleteWarehouse(numeric.parse(id))
    res.status(200).json({ data: deletedWarehouse })
  } catch (error: unknown) {
    handleZodError(error, res)
  }
})
