/* eslint-disable @typescript-eslint/no-misused-promises */
// customers
import { Router } from 'express'
import { type Customer, insertCustomerSchema } from '../../db/schema'
import {
  deleteCustomer,
  getCustomer,
  getCustomers,
  insertCustomer,
  updateCustomer
} from '../controller/'
import { ERRORS } from '../strings'
import { numeric } from '../util/type-conversions'
import { handleZodError } from '../util/zod-errorhandler'

export const customerRouter = Router()

customerRouter.post('/', async (req, res) => {
  try {
    const newCustomer = insertCustomerSchema.parse(req.body)
    const createdCustomer: Customer = await insertCustomer(newCustomer)
    res.status(201).json({ data: createdCustomer })
  } catch (error: unknown) {
    handleZodError(error, res)
  }
})

customerRouter.get('/', async (req, res) => {
  try {
    const customers: Customer[] = await getCustomers()
    res.status(200).json({ data: customers })
  } catch (error: unknown) {
    handleZodError(error, res)
  }
})

customerRouter.get('/:id', async (req, res) => {
  try {
    const { id } = req.params
    const customer: Customer = await getCustomer(numeric.parse(id))
    if (customer === undefined) {
      res.status(404).json({ error: { message: ERRORS.notFoundbyId(id) } })
      return
    }
    res.status(200).json({ data: customer })
  } catch (error: unknown) {
    handleZodError(error, res)
  }
})

customerRouter.patch('/:id', async (req, res) => {
  try {
    const { id } = req.params
    const customer: Partial<Customer> = insertCustomerSchema
      .partial()
      .parse(req.body)

    if (Object.keys(customer).length === 0) {
      res.status(400).json({ error: { message: ERRORS.nothingToUpdate } })
      return
    }

    const updatedCustomer: Customer = await updateCustomer(
      numeric.parse(id),
      customer
    )
    res.status(200).json({ data: updatedCustomer })
  } catch (error: unknown) {
    handleZodError(error, res)
  }
})

customerRouter.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params
    const customer: Customer = await deleteCustomer(numeric.parse(id))
    res.status(200).json({ data: customer })
  } catch (error: unknown) {
    handleZodError(error, res)
  }
})
