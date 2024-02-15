/* eslint-disable @typescript-eslint/no-misused-promises */
// products
import { Router } from 'express'
import { type Product, insertProductSchema } from '../../db/schema'
import {
  deleteProduct,
  getProduct,
  getProducts,
  insertProduct,
  updateProduct
} from '../controller/'
import { ERRORS } from '../strings'
import { numeric } from '../util/type-conversions'
import { handleZodError } from '../util/zod-errorhandler'
import { type PaginationResponse } from './types'
import { STANDARD_PAGE, STANDARD_PAGE_SIZE } from '../constants'

export const productRouter = Router()

productRouter.post('/', async (req, res, next) => {
  try {
    const newProduct = insertProductSchema.parse(req.body)
    const createdProduct: Product = await insertProduct(newProduct)
    res.status(201).json({ data: createdProduct })
  } catch (error: unknown) {
    handleZodError(error, res)
  }
})

productRouter.get('/', async (req, res) => {
  try {
    // pagination
    const page = numeric.parse(req.query.page ?? STANDARD_PAGE)
    const pageSize = numeric.parse(req.query.page_size ?? STANDARD_PAGE_SIZE)

    const { data, totalCount } = await getProducts({
      limit: pageSize,
      offset: page * pageSize
    })

    const pagination: PaginationResponse = {
      page,
      pageSize,
      pageCount: Math.ceil(totalCount / pageSize),
      totalCount
    }

    res.status(200).json({ pagination, data })
  } catch (error: unknown) {
    handleZodError(error, res)
  }
})

productRouter.get('/:id', async (req, res) => {
  try {
    const { id } = req.params
    const product: Product = await getProduct(numeric.parse(id))
    if (product === undefined) {
      res.status(404).json({ error: { message: ERRORS.notFoundbyId(id) } })
      return
    }
    res.status(200).json({ data: product })
  } catch (error: unknown) {
    handleZodError(error, res)
  }
})

productRouter.patch('/:id', async (req, res) => {
  try {
    const { id } = req.params
    const product: Partial<Product> = insertProductSchema
      .partial()
      .parse(req.body)

    if (Object.keys(product).length === 0) {
      res.status(400).json({ error: { message: ERRORS.nothingToUpdate } })
      return
    }

    const updatedProduct: Product = await updateProduct(
      numeric.parse(id),
      product
    )
    res.status(200).json({ data: updatedProduct })
  } catch (error: unknown) {
    handleZodError(error, res)
  }
})

productRouter.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params
    const deletedProduct: Product = await deleteProduct(numeric.parse(id))
    res.status(200).json({ data: deletedProduct })
  } catch (error: unknown) {
    handleZodError(error, res)
  }
})
