import express from 'express'
import cors from 'cors'
import { rateLimit } from 'express-rate-limit'
import {
  productRouter,
  warehouseRouter,
  addressRouter,
  customerRouter,
  employeeRouter,
  orderRouter,
  loginRouter
} from './routes'
// dotenv
import 'dotenv/config'

const app = express()

// Middlewares
app.use(cors({ origin: true }))
app.use(express.json())
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 50, // Limit each IP to 50 requests per `window` (here, per 15 minutes).
  standardHeaders: 'draft-7', // draft-6: `RateLimit-*` headers; draft-7: combined `RateLimit` header
  legacyHeaders: false // Disable the `X-RateLimit-*` headers.
})

// Apply the rate limiting middleware to all requests.
app.use(limiter)

// Routes
app.use('/warehouses', warehouseRouter)
app.use('/products', productRouter)
app.use('/addresses', addressRouter)
app.use('/customers', customerRouter)
app.use('/employees', employeeRouter)
app.use('/orders', orderRouter)
app.use('/login', loginRouter)

// export app for testing
export default app
