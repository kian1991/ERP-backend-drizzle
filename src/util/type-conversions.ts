import z from 'zod'
import { ERRORS } from '../strings'

export const numeric = z
  .string()
  .regex(/^\d+$/, ERRORS.integer)
  .transform(Number)
