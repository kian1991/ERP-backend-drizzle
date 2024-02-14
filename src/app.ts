import express from 'express'
import cors from 'cors'
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

app.use(cors({ origin: true }))
app.use(express.json())

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
