import e, { type Response } from 'express'
import z from 'zod'

export function handleZodError(error: unknown, res: Response): void {
  if (error instanceof z.ZodError) {
    res.status(400).json({ error: { ...error, name: 'Parsing Error' } })
  } else {
    console.error(error)
    res.status(500).json({ error: { message: 'Internal Server Error' } })
  }
}
