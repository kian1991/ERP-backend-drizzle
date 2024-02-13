/* eslint-disable @typescript-eslint/no-misused-promises */
// addresses
import { Router } from 'express'
import { type Address, insertAddressSchema } from '../../db/schema'
import {
  deleteAddress,
  getAddress,
  getAddresses,
  insertAddress,
  updateAddress
} from '../controller/'
import { ERRORS } from '../strings'
import { numeric } from '../util/type-conversions'
import { handleZodError } from '../util/zod-errorhandler'

export const addressRouter = Router()

addressRouter.post('/', async (req, res, next) => {
  try {
    const newAddress = insertAddressSchema.parse(req.body)
    const createdAddress: Address = await insertAddress(newAddress)
    res.status(201).json({ data: createdAddress })
  } catch (error: unknown) {
    handleZodError(error, res)
  }
})

addressRouter.get('/', async (req, res) => {
  try {
    const addresses: Address[] = await getAddresses()
    res.status(200).json({ data: addresses })
  } catch (error: unknown) {
    handleZodError(error, res)
  }
})

addressRouter.get('/:id', async (req, res) => {
  try {
    const { id } = req.params
    const address: Address = await getAddress(numeric.parse(id))
    if (address === undefined) {
      res.status(404).json({ error: { message: ERRORS.notFoundbyId(id) } })
      return
    }
    res.status(200).json({ data: address })
  } catch (error: unknown) {
    handleZodError(error, res)
  }
})

addressRouter.patch('/:id', async (req, res) => {
  try {
    const { id } = req.params
    const address: Partial<Address> = insertAddressSchema
      .partial()
      .parse(req.body)

    if (Object.keys(address).length === 0) {
      res.status(400).json({ error: { message: ERRORS.nothingToUpdate } })
      return
    }

    const updatedAddress: Address = await updateAddress(
      numeric.parse(id),
      address
    )
    res.status(200).json({ data: updatedAddress })
  } catch (error: unknown) {
    handleZodError(error, res)
  }
})

addressRouter.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params
    const deletedAddress: Address = await deleteAddress(numeric.parse(id))
    res.status(200).json({ data: deletedAddress })
  } catch (error: unknown) {
    handleZodError(error, res)
  }
})
