/* eslint-disable @typescript-eslint/no-misused-promises */

import { Router } from 'express'
import { z } from 'zod'
import { db } from '../../db/client'
import { eq } from 'drizzle-orm'
import { customers } from '../../db/schema'
import { handleZodError } from '../util/zod-errorhandler'
import { ERRORS } from '../strings'
import { getCustomerByEmail } from '../controller'

export const loginRouter = Router()

const doesEmailExist = async (email: string): Promise<boolean> => {
  const result = await db.query.customers.findFirst({
    where: eq(customers.email, email)
  })
  return result !== undefined
}

const emailSchema = z.object({
  email: z
    .string()
    .email()
    .refine(async (email) => await doesEmailExist(email), ERRORS.emailNotInDb)
})

loginRouter.post('/', async (req, res) => {
  try {
    const { email } = await emailSchema.parseAsync(req.body)
    console.log('email', email)
    const userData = await getCustomerByEmail(email)
    res.status(201).json({ data: userData })
  } catch (error: unknown) {
    handleZodError(error, res)
  }
})
